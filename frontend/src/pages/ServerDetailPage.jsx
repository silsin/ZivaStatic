import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Server, MapPin, Calendar, Copy, Check, Loader2, AlertTriangle, Mail } from 'lucide-react'
import client from '../api/client'
import ProfileCard from '../components/ProfileCard'
import { useLang } from '../i18n/LanguageContext'

const PROTOCOLS = ['openvpn', 'wireguard', 'ikev2', 'v2ray']

function StatusBadge({ status }) {
  const { t } = useLang()
  if (status === 'provisioning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
        <Loader2 size={13} className="animate-spin" />
        {t.status.provisioning}
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-500/15 text-green-400 border border-green-500/25">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        {t.status.active}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/25">
      <span className="w-2 h-2 rounded-full bg-red-400" />
      {t.status.error}
    </span>
  )
}

function CopyButton({ text }) {
  const { t } = useLang()
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
      {copied ? t.common.copied : t.common.copy}
    </button>
  )
}

export default function ServerDetailPage() {
  const { t, lang } = useLang()
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
      setError(t.detail.loadError)
      return null
    }
  }

  async function fetchConfigs() {
    try {
      const res = await client.get(`/profiles/${id}`)
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
        <Loader2 size={22} className="animate-spin me-3" />
        {t.common.loading}
      </div>
    )
  }

  if (error || !server) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-6">
        <AlertTriangle size={40} className="text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">{t.detail.notFound}</h2>
        <p className="text-gray-400 mb-6 text-sm">{error || t.detail.notFoundText}</p>
        <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm">{t.detail.back}</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={15} className="rtl:rotate-180" />
          {t.detail.back}
        </Link>

        {/* IP Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-7 mb-6">
          <div className="flex items-start justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{t.detail.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin size={13} />
                {server.location}
              </div>
            </div>
            <StatusBadge status={server.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.detail.ipAddress}</div>
              {server.ip_address ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-white text-lg font-semibold" dir="ltr">{server.ip_address}</span>
                  <CopyButton text={server.ip_address} />
                </div>
              ) : (
                <span className="text-gray-600 text-sm italic">{t.detail.beingAssigned}</span>
              )}
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.detail.serverId}</div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-gray-300 text-sm" dir="ltr">{server.id.slice(0, 16)}...</span>
                <CopyButton text={server.id} />
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.detail.location}</div>
              <div className="flex items-center gap-2 text-white">
                <MapPin size={15} className="text-blue-400" />
                {server.location}
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-xl p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{t.detail.created}</div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Calendar size={15} className="text-blue-400" />
                {server.created_at ? new Date(server.created_at).toLocaleString(lang === 'fa' ? 'fa-IR' : undefined) : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Provisioning state */}
        {server.status === 'provisioning' && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-10 text-center mb-6">
            <Loader2 size={40} className="animate-spin text-yellow-400 mx-auto mb-5" />
            <h2 className="text-xl font-semibold mb-2 text-white">{t.detail.settingUpTitle}</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
              {t.detail.settingUpText}
            </p>
          </div>
        )}

        {/* Active — connection configs */}
        {server.status === 'active' && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Server size={16} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-white">{t.detail.profilesTitle}</h2>
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                {t.detail.profilesHint}
              </span>
            </div>

            {availableProtocols.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400 text-sm">
                <Loader2 size={18} className="animate-spin mx-auto mb-3 text-gray-600" />
                {t.detail.finalizing}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableProtocols.map((proto) => (
                  <ProfileCard key={proto} protocol={proto} serverId={id} />
                ))}
              </div>
            )}

            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mt-6 text-sm text-gray-400 leading-relaxed">
              <strong className="text-white block mb-1">{t.detail.howTitle}</strong>
              {t.detail.howText}{' '}
              <strong className="text-white font-mono" dir="ltr">{server.ip_address}</strong>
            </div>
          </div>
        )}

        {/* Error state */}
        {server.status === 'error' && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-10 text-center">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-400">{t.detail.errorTitle}</h2>
            <p className="text-gray-400 text-sm mb-5 max-w-sm mx-auto">
              {t.detail.errorText}
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
