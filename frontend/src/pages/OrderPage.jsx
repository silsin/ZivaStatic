import { useEffect, useState } from 'react'
import client from '../api/client'
import LocationCard from '../components/LocationCard'

export default function OrderPage() {
  const [locations, setLocations] = useState([])
  const [selected, setSelected] = useState(null)
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    client
      .get('/locations')
      .then((res) => setLocations(res.data))
      .catch(() => setError('Failed to load locations. Please refresh.'))
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
      setError(err.response?.data?.detail || 'Failed to start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Choose Your Location</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Select a Hetzner datacenter for your dedicated VPN server. After payment, your server
            is automatically provisioned and all VPN configs are ready within minutes.
          </p>
        </div>

        {/* Flow steps */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-10 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
            Pick location
          </div>
          <span className="hidden sm:block text-gray-600">→</span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 text-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
            Pay securely
          </div>
          <span className="hidden sm:block text-gray-600">→</span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 text-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
            Server auto-provisioned
          </div>
          <span className="hidden sm:block text-gray-600">→</span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 text-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</span>
            Download VPN configs
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loadingLocations ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <span className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full mr-3" />
            Loading locations...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
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

        {selected && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-6 py-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected.flag_emoji}</span>
              <div>
                <div className="font-semibold text-white">{selected.city}, {selected.country}</div>
                <div className="text-sm text-blue-400">Selected datacenter</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">$9.99</div>
              <div className="text-sm text-gray-400">/month</div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selected || submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-10 py-3.5 rounded-xl transition-colors text-lg"
          >
            {submitting ? 'Redirecting to checkout...' : 'Continue to Payment →'}
          </button>
        </div>
      </div>
    </div>
  )
}
