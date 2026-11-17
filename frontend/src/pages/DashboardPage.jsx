import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import useAuthStore from '../store/authStore'
import ServerCard from '../components/ServerCard'

export default function DashboardPage() {
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
    } catch (err) {
      setError('Failed to load servers.')
      return []
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const meRes = await client.get('/auth/me')
        setUser(meRes.data)
      } catch {
        // non-critical
      }
      const data = await fetchServers()
      setLoading(false)

      if (data.some((s) => s.status === 'provisioning')) {
        startPolling()
      }
    }
    init()
    return () => stopPolling()
  }, [])

  function startPolling() {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      const data = await fetchServers()
      if (!data.some((s) => s.status === 'provisioning')) {
        stopPolling()
      }
    }, 5000)
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            {user && (
              <p className="text-gray-400 text-sm">
                {user.email}
                {user.created_at && (
                  <span className="ml-3 text-gray-600">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                )}
              </p>
            )}
          </div>
          <Link
            to="/order"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            + Order New Server
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <span className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full mr-3" />
            Loading servers...
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🖥️</div>
            <h2 className="text-xl font-semibold mb-2">No servers yet</h2>
            <p className="text-gray-400 mb-6">Order your first static IP VPN server to get started.</p>
            <Link
              to="/order"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Order Your First Server
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Servers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
