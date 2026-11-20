import { Download, QrCode, Lock, Zap, Shield, Radio } from 'lucide-react'
import client from '../api/client'

const PROTOCOL_META = {
  openvpn: {
    icon: Lock,
    name: 'OpenVPN',
    description: '.ovpn config file',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
  },
  wireguard: {
    icon: Zap,
    name: 'WireGuard',
    description: 'wg0.conf file',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  ikev2: {
    icon: Shield,
    name: 'IKEv2',
    description: 'Certificate config',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  v2ray: {
    icon: Radio,
    name: 'V2Ray',
    description: 'VMess JSON config',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
}

export default function VpnConfigCard({ protocol, serverId }) {
  const meta = PROTOCOL_META[protocol] || {
    icon: Lock,
    name: protocol,
    description: 'Config file',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
  }

  const Icon = meta.icon

  async function handleDownload() {
    try {
      const response = await client.get(`/vpn-configs/${serverId}/${protocol}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const ext = protocol === 'wireguard' ? 'conf' : protocol === 'v2ray' ? 'json' : protocol === 'ikev2' ? 'mobileconfig' : 'ovpn'
      link.setAttribute('download', `${protocol}-${serverId}.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
      alert('Failed to download config. Please try again.')
    }
  }

  function handleQrCode() {
    window.open(`/api/v1/vpn-configs/${serverId}/${protocol}/qr`, '_blank')
  }

  return (
    <div className={`bg-gray-800/50 border ${meta.border} rounded-xl p-5 flex flex-col gap-4 hover:bg-gray-800 transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${meta.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={meta.color} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{meta.name}</h3>
          <p className="text-xs text-gray-400">{meta.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <Download size={14} />
          Download
        </button>
        <button
          onClick={handleQrCode}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          <QrCode size={14} />
          QR Code
        </button>
      </div>
    </div>
  )
}
