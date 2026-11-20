import { useEffect, useState } from 'react'
import { ArrowRight, MapPin, Server, Clock, Check } from 'lucide-react'
import client from '../api/client'
import LocationCard from '../components/LocationCard'
import { useLang } from '../i18n/LanguageContext'

export default function OrderPage() {
  const { t, city, country, num, isRtl } = useLang()
  const [locations, setLocations] = useState([])
  const [selected, setSelected] = useState(null)
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    client
      .get('/locations')
      .then((res) => setLocations(res.data))
      .catch(() => setError(t.order.loadError))
      .finally(() => setLoadingLocations(false))
  }, [])

  async function handleContinue() {
    if (!selected) return
    setError('')
    setSubmitting(true)
    try {
      const res = await client.post('/subscriptions', {
        location: selected.name,
        server_type: 'cx22',
      })
      window.location.href = res.data.checkout_url
    } catch (err) {
      setError(err.response?.data?.detail || t.order.checkoutError)
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-14">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            {t.order.title}
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            {t.order.sub}
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12 text-sm">
          {t.order.steps.map((label, idx) => ({ n: idx + 1, label, active: idx === 0 })).map((s, i, arr) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.active ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                  {num(s.n)}
                </span>
                <span className={s.active ? 'text-white font-medium' : 'text-gray-500'}>{s.label}</span>
              </div>
              {i < arr.length - 1 && <ArrowRight size={14} className="text-gray-700 rtl:rotate-180" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Location grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={16} className="text-blue-400" />
              <span className="font-semibold text-white">{t.order.available}</span>
              {!loadingLocations && (
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                  {t.order.locationsCount(locations.length)}
                </span>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {loadingLocations ? (
              <div className="flex items-center justify-center py-20 text-gray-400">
                <span className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full me-3" />
                {t.order.loadingLocations}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {locations.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    selected={selected?.id === loc.id}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Server size={16} className="text-blue-400" />
                {t.order.summary}
              </h3>

              {selected ? (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                  <span className="text-2xl">{selected.flag_emoji}</span>
                  <div>
                    <div className="font-semibold text-white text-sm">{city(selected.city)}{isRtl ? '، ' : ', '}{country(selected.country)}</div>
                    <div className="text-xs text-blue-400">{t.order.selectedLocation}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl px-4 py-3 mb-5 text-center">
                  <MapPin size={18} className="text-gray-600 mx-auto mb-1" />
                  <p className="text-gray-500 text-sm">{t.order.selectLocation}</p>
                </div>
              )}

              <div className="space-y-2 mb-5">
                {t.order.included.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <span className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-blue-400" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-5 mb-5">
                <div className="flex items-end justify-between">
                  <span className="text-gray-400 text-sm">{t.order.monthlyTotal}</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{t.common.price}</div>
                    <div className="text-xs text-gray-500">{t.common.perMonth}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selected || submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    {t.order.processing}
                  </>
                ) : (
                  <>
                    {t.order.continue}
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-600">
                <Clock size={11} />
                {t.order.live}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
