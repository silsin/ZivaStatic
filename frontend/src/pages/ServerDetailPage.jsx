import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Server, MapPin, Calendar, Copy, Check, Loader2, AlertTriangle, Mail } from 'lucide-react'
import client from '../api/client'
import VpnConfigCard from '../components/VpnConfigCard'

const PROTOCOLS = ['openvpn', 'wireguard', 'ikev2', 'v2ray']

function StatusBadge({ status }) {
  if (status === 'provisioning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
        <Loader2 size={13} className="animate-spin" />
        Provisioning
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/15 text-green-400 border border-green-500/25">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/25">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Error
    </span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors text-gray-300"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
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
    } catch {
      setError('Failed to load IP details.')
      return null
    }
  }

  async function fetchConfigs() {
    try {
      const res = await client.get(`/vpn-configs/${id}`)
      if (Array.isArray(res.data)) {
        const protos = res.data.map((item) => (typeof item === 'string' ? item : item.protocol))
        setAvailableProtocols(protos.filter((p) => PROTOCOLS.includes(p)))
      }
    } catch {}
  }

  useEffect(() => {
    async function init() {
      const srv = await fetchServer()
      if (srv?.status === 'active') await fetchConfigs()
      setLoading(false)
      if (srv?.status === 'provisioning') startPolling()
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
        if (srv.status === 'active') await fetchConfigs()
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
        <Loader2 size={22} className="animate-spin mr-3" />
        Loading...
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle size={40} className="text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Not found</h2>
        <p className="text-gray-400 mb-6 text-sm">{error || 'This IP does not exist or you do not have access.'}</p>
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} />
          Back to Dashboard
        </Link>

        {/* IP Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 mb-6">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Your Static IP</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin size={13} />
                {server.location}
              </div>
            </div>
            <StatusBadge status={server.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">IP Address</div>
              {server.ip_address ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-white text-lg font-semibold">{server.ip_address}</span>
                  <CopyButton text={server.ip_address} />
                </div>
              ) : (
                <span className="text-gray-600 text-sm italic">Being assigned...</span>
              )}
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Server ID</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-gray-300 text-sm">{server.id.slice(0, 16)}...</span>
                <CopyButton text={server.id} />
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Location</div>
              <div className="flex items-center gap-2 text-white">
                <MapPin size={15} className="text-blue-400" />
                {server.location}
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Provisioned</div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Calendar size={15} className="text-blue-400" />
                {server.created_at ? new Date(server.created_at).toLocaleString() : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Provisioning state */}
        {server.status === 'provisioning' && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-10 text-center mb-6">
            <Loader2 size={40} className="animate-spin text-yellow-400 mx-auto mb-5" />
            <h2 className="text-xl font-semibold mb-2 text-white">Setting up your server</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              Your dedicated server is being provisioned and all connection configs are being configured.
              This takes around 5–10 minutes. This page updates automatically.
            </p>
          </div>
        )}

        {/* Active — connection configs */}
        {server.status === 'active' && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Server size={16} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Connection Configs</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                Download and use on any device
              </span>
            </div>

            {availableProtocols.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400 text-sm">
                <Loader2 size={18} className="animate-spin mx-auto mb-3 text-gray-600" />
                Connection configs are being finalized. Refresh in a moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProtocols.map((proto) => (
                  <VpnConfigCard key={proto} protocol={proto} serverId={id} />
                ))}
              </div>
            )}

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mt-6 text-sm text-gray-400 leading-relaxed">
              <strong className="text-white block mb-1">How to connect</strong>
              Download the config file for your preferred method. Import it into your VPN client
              (WireGuard app, OpenVPN client, or your device's built-in IKEv2 settings).
              Once connected, all your traffic will appear to come from your dedicated IP: <strong className="text-white font-mono">{server.ip_address}</strong>.
            </div>
          </div>
        )}

        {/* Error state */}
        {server.status === 'error' && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-10 text-center">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-400">Setup failed</h2>
            <p className="text-gray-400 text-sm mb-5 max-w-sm mx-auto">
              There was a problem provisioning your server. Please contact support with your server ID.
            </p>
            <div className="font-mono text-xs text-gray-500 bg-gray-900 rounded-lg px-4 py-2 inline-block mb-5">
              {server.id}
            </div>
            <br />
            <a
              href="mailto:support@zivastatic.com"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              <Mail size={14} />
              support@zivastatic.com
            </a>
          </div>
        )}

      </div>
    </div>
  )
}
