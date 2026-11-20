import { useEffect, useState } from 'react'
import { Loader2, Edit2, Check, X, RefreshCw } from 'lucide-react'
import client from '../../api/client'

const LOCATION_FLAGS = {
  nbg1: '🇩🇪', fsn1: '🇩🇪', hel1: '🇫🇮', ash: '🇺🇸', hil: '🇺🇸', sin: '🇸🇬',
}

export default function AdminPricingPage() {
  const [hetznerPrices, setHetznerPrices] = useState([])
  const [typeByLocation, setTypeByLocation] = useState({})
  const [overrides, setOverrides] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // location_name string
  const [editVal, setEditVal] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [hRes, oRes, lRes] = await Promise.all([
        client.get('/admin/hetzner-prices'),
        client.get('/admin/prices'),
        client.get('/locations'),
      ])
      setHetznerPrices(hRes.data.server_types || [])
      setTypeByLocation(hRes.data.location_server_types || {})
      setOverrides(oRes.data)
      setLocations(lRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Cost of the server type we actually order for a location, at that location.
  function costFor(locName) {
    const type = typeByLocation[locName]
    const price = hetznerPrices.find((t) => t.name === type)?.prices_by_location?.[locName]
    return { type, price: price ?? null }
  }

  function getOverride(locName) {
    return overrides.find((o) => o.location_name === locName)
  }

  async function savePrice(locationName) {
    setSaving(true)
    try {
      const override = getOverride(locationName)
      await client.post('/admin/prices', {
        location_name: locationName,
        price_usd: parseFloat(editVal),
        is_active: override ? override.is_active : true,
      })
      setEditing(null)
      await load()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  async function toggleLocation(locationName, currentActive) {
    const override = getOverride(locationName)
    const price = override ? override.price_usd : 9.99
    try {
      await client.post('/admin/prices', { location_name: locationName, price_usd: price, is_active: !currentActive })
      await load()
    } catch (e) { console.error(e) }
  }

  async function deleteOverride(locationName) {
    try {
      await client.delete(`/admin/prices/${locationName}`)
      await load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Pricing</h1>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-xs text-gray-500">Cost is the monthly Hetzner price of the server type ordered for each location, in your Hetzner account currency (usually EUR, incl. VAT). N/A means that type is not sold at that location. Default selling price: <span className="text-blue-400 font-medium">$9.99/mo</span></p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-blue-500" size={28} /></div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Hetzner Cost</th>
                <th className="text-left px-5 py-3">Our Price</th>
                <th className="text-left px-5 py-3">Margin</th>
                <th className="text-left px-5 py-3">Active</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => {
                const override = getOverride(loc.name)
                const ourPrice = override ? override.price_usd : 9.99
                const isActive = override ? override.is_active : true
                const { type: hType, price: hPrice } = costFor(loc.name)
                const margin = hPrice ? (ourPrice - hPrice).toFixed(2) : null
                const isEditing = editing === loc.name

                return (
                  <tr key={loc.name} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-200">
                      <span className="mr-2">{LOCATION_FLAGS[loc.name] || '🌍'}</span>
                      {loc.city}, {loc.country} <span className="text-gray-600 ml-1 text-xs">({loc.name})</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">
                      {hPrice ? <>{hPrice.toFixed(2)}/mo <span className="text-gray-600 text-xs">({hType})</span></> : <span className="text-gray-600">N/A {hType && `(${hType})`}</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">$</span>
                          <input
                            autoFocus
                            type="number" step="0.01" min="0"
                            value={editVal}
                            onChange={(e) => setEditVal(e.target.value)}
                            className="w-24 bg-gray-800 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                          />
                          <button onClick={() => savePrice(loc.name)} disabled={saving} className="text-green-400 hover:text-green-300">
                            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                          </button>
                          <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-gray-300"><X size={13} /></button>
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${override ? 'text-blue-400' : 'text-gray-300'}`}>
                          ${ourPrice.toFixed(2)}
                          {override && <span className="text-xs text-gray-600 ml-1">(custom)</span>}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {margin !== null ? (
                        <span className={parseFloat(margin) > 0 ? 'text-green-400' : 'text-red-400'}>
                          {margin}
                        </span>
                      ) : <span className="text-gray-600">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleLocation(loc.name, isActive)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${
                          isActive ? 'bg-green-600' : 'bg-gray-700'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          isActive ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setEditing(loc.name); setEditVal(ourPrice.toFixed(2)) }}
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        {override && (
                          <button onClick={() => deleteOverride(loc.name)} className="text-xs text-gray-600 hover:text-red-400 transition-colors">Reset</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Hetzner server types reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">Hetzner Server Types Reference</h2>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hetznerPrices.filter((t) => /^(cx|cpx)/.test(t.name)).slice(0, 12).map((t) => (
            <div key={t.name} className="bg-gray-800 rounded-lg p-3">
              <p className="text-sm font-medium text-white">{t.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.cores} vCPU · {t.memory}GB RAM</p>
              <p className="text-sm text-blue-400 mt-1">{t.monthly_price_gross ? parseFloat(t.monthly_price_gross).toFixed(2) : 'N/A'}/mo</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
