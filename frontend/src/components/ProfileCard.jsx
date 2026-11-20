import { Download, QrCode, Lock, Zap, Shield, Radio } from 'lucide-react'
import client from '../api/client'
import { useLang } from '../i18n/LanguageContext'

// Visual style per profile type. Names/descriptions come from the translations.
const PROFILE_STYLE = {
  openvpn: { icon: Lock, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', ext: 'ovpn' },
  wireguard: { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', ext: 'conf' },
  ikev2: { icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', ext: 'mobileconfig' },
  v2ray: { icon: Radio, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', ext: 'json' },
}

const FALLBACK_STYLE = {
  icon: Lock, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', ext: 'conf',
}

export default function ProfileCard({ protocol, serverId }) {
  const { t } = useLang()
  const style = PROFILE_STYLE[protocol] || FALLBACK_STYLE
  const label = t.profiles[protocol] || { name: protocol, desc: '' }
  const Icon = style.icon

  async function handleDownload() {
    try {
      const response = await client.get(`/profiles/${serverId}/${protocol}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `profile-${protocol}-${serverId.slice(0, 8)}.${style.ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
      alert(t.profiles.downloadError)
    }
  }

  function handleQrCode() {
    window.open(`/api/v1/profiles/${serverId}/${protocol}/qr`, '_blank')
  }

  return (
    <div className={`bg-gray-800/50 border ${style.border} rounded-xl p-5 flex flex-col gap-4 hover:bg-gray-800 transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={style.color} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{label.name}</h3>
          <p className="text-xs text-gray-400">{label.desc}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Download size={14} />
          {t.profiles.download}
        </button>
        <button
          onClick={handleQrCode}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <QrCode size={14} />
          {t.profiles.qr}
        </button>
      </div>
    </div>
  )
}
