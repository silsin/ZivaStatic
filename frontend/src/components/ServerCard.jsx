import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Loader2 } from 'lucide-react'

function StatusBadge({ status }) {
  if (status === 'provisioning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/25">
        <Loader2 size={11} className="animate-spin" />
        Provisioning
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Error
    </span>
  )
}

export default function ServerCard({ server }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <MapPin size={13} />
          {server.location}
        </div>
        <StatusBadge status={server.status} />
      </div>

      <div>
        <div className="text-xs text-gray-600 mb-1 uppercase tracking-wider">IP Address</div>
        <div className="font-mono text-white text-lg font-semibold">
          {server.ip_address || (
            <span className="text-gray-600 text-sm font-normal">Assigning...</span>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600">{server.name}</div>

      <Link
        to={`/servers/${server.id}`}
        className="mt-auto inline-flex items-center justify-center gap-2 text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium group-hover:bg-gray-700"
      >
        Manage IP
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
