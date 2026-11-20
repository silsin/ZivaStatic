import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Server, AlertCircle, Loader2 } from 'lucide-react'
import client from '../api/client'
import useAuthStore from '../store/authStore'
import ServerCard from '../components/ServerCard'
import { useLang } from '../i18n/LanguageContext'

export default function DashboardPage() {
  const { t, num } = useLang()
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const setUser = useAuthStore((s) => s.setUser)
  const user = useAuthStore((s) => s.user)
  const pollRef = useRef(null)

  async function fetchServers() {
    try {
      const res = await client.get('/servers')
      setServers(res.data)
      return res.data
    } catch {
      setError(t.dashboard.loadError)
      return []
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const meRes = await client.get('/auth/me')
        setUser(meRes.data)
      } catch {}
      const data = await fetchServers()
      setLoading(false)
      if (data.some((s) => s.status === 'provisioning')) startPolling()
    }
    init()
    return () => stopPolling()
  }, [])

  function startPolling() {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      const data = await fetchServers()
      if (!data.some((s) => s.status === 'provisioning')) stopPolling()
    }, 5000)
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  const activeCount = servers.filter((s) => s.status === 'active').length
  const provisioningCount = servers.filter((s) => s.status === 'provisioning').length

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t.dashboard.title}</h1>
            {user && (
              <p className="text-gray-500 text-sm">{user.email}</p>
            )}
          </div>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} />
            {t.dashboard.newIp}
          </Link>
        </div>

        {/* Stats */}
        {servers.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-white">{num(servers.length)}</div>
              <div className="text-sm text-gray-500 mt-1">{t.dashboard.total}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-green-400">{num(activeCount)}</div>
              <div className="text-sm text-gray-500 mt-1">{t.dashboard.active}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-yellow-400">{num(provisioningCount)}</div>
              <div className="text-sm text-gray-500 mt-1">{t.dashboard.provisioning}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={24} className="animate-spin me-3" />
            {t.dashboard.loading}
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Server size={28} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t.dashboard.emptyTitle}</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm">
              {t.dashboard.emptySub}
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              <Plus size={16} />
              {t.dashboard.emptyButton}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
