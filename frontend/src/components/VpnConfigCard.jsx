import client from '../api/client'

const PROTOCOL_META = {
  openvpn: {
    icon: '🔒',
    name: 'OpenVPN',
    description: '.ovpn file',
  },
  wireguard: {
    icon: '⚡',
    name: 'WireGuard',
    description: 'wg0.conf file',
  },
  ikev2: {
    icon: '🛡️',
    name: 'IKEv2',
    description: 'Certificate config',
  },
  v2ray: {
    icon: '🚀',
    name: 'V2Ray',
    description: 'VMess JSON config',
  },
}

export default function VpnConfigCard({ protocol, serverId }) {
  const meta = PROTOCOL_META[protocol] || {
    icon: '🔑',
    name: protocol,
    description: 'Config file',
  }

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
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{meta.icon}</span>
        <div>
          <h3 className="font-semibold text-white">{meta.name}</h3>
          <p className="text-sm text-gray-400">{meta.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleDownload}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          ⬇ Download
        </button>
        <button
          onClick={handleQrCode}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          📱 QR Code
        </button>
      </div>
    </div>
  )
}
