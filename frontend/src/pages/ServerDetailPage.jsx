import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import VpnConfigCard from '../components/VpnConfigCard'

const PROTOCOLS = ['openvpn', 'wireguard', 'ikev2', 'v2ray']

function StatusBadge({ status }) {
  if (status === 'provisioning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        <span className="animate-spin h-3.5 w-3.5 border-2 border-yellow-400 border-t-transparent rounded-full" />
        Provisioning
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
      Error
    </span>
  )
}

export default function ServerDetailPage() {
  const { id } = useParams()
  const [server, setServer] = useState(null)
  const [availableProtocols, setAvailableProtocols] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  async function fetchServer() {
    try {
      const res = await client.get(`/servers/${id}`)
      setServer(res.data)
      return res.data
    } catch (err) {
      setError('Failed to load server details.')
      return null
    }
  }

  async function fetchConfigs() {
    try {
      const res = await client.get(`/vpn-configs/${id}`)
      const data = res.data
      // Accept array of strings, or array of objects with protocol field
      if (Array.isArray(data)) {
        const protos = data.map((item) => (typeof item === 'string' ? item : item.protocol))
        setAvailableProtocols(protos.filter((p) => PROTOCOLS.includes(p)))
      }
    } catch {
      // configs may not be ready yet — not a fatal error
    }
  }

  useEffect(() => {
    async function init() {
      const srv = await fetchServer()
      if (srv?.status === 'active') {
        await fetchConfigs()
      }
      setLoading(false)

      if (srv?.status === 'provisioning') {
        startPolling()
      }
    }
    init()
    return () => stopPolling()
  }, [id])

  function startPolling() {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      const srv = await fetchServer()
      if (srv && srv.status !== 'provisioning') {
        stopPolling()
        if (srv.status === 'active') {
          await fetchConfigs()
        }
      }
    }, 5000)
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        <span className="animate-spin h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full mr-3" />
        Loading server...
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-6">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-white mb-2">Server not found</h2>
        <p className="text-gray-400 mb-6">{error || 'This server does not exist or you do not have access.'}</p>
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Server info card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold">{server.name}</h1>
              <p className="text-gray-400 text-sm mt-1">{server.location}</p>
            </div>
            <StatusBadge status={server.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 mb-1">IP Address</div>
              <div className="font-mono text-white">
                {server.ip_address || (
                  <span className="text-gray-500 italic">Not assigned yet</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Created</div>
              <div className="text-white">
                {server.created_at
                  ? new Date(server.created_at).toLocaleString()
                  : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific content */}
        {server.status === 'provisioning' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
            <span className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full inline-block mb-4" />
            <h2 className="text-xl font-semibold mb-2">Setting up your server</h2>
            <p className="text-gray-400">
              Your server is being set up. This takes about 5 minutes. This page will update
              automatically.
            </p>
          </div>
        )}

        {server.status === 'active' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">VPN Configurations</h2>
            {availableProtocols.length === 0 ? (
              <div className="text-gray-400 text-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
                VPN configurations are still being prepared. Please refresh in a moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProtocols.map((proto) => (
                  <VpnConfigCard key={proto} protocol={proto} serverId={id} />
                ))}
              </div>
            )}
          </div>
        )}

        {server.status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">Server setup failed</h2>
            <p className="text-gray-400 mb-4">
              There was an error provisioning your server. Please contact support and reference
              your server ID: <span className="font-mono text-white">{server.id}</span>
            </p>
            <a
              href="mailto:support@staticipvpn.com"
              className="text-blue-400 hover:text-blue-300"
            >
              support@staticipvpn.com
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
