import { Link } from 'react-router-dom'

function StatusBadge({ status }) {
  if (status === 'provisioning') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        <span className="animate-spin h-3 w-3 border-2 border-yellow-400 border-t-transparent rounded-full" />
        Provisioning
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <span className="h-2 w-2 rounded-full bg-green-400" />
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
      <span className="h-2 w-2 rounded-full bg-red-400" />
      Error
    </span>
  )
}

export default function ServerCard({ server }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white">{server.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{server.location}</p>
        </div>
        <StatusBadge status={server.status} />
      </div>

      <div className="text-sm text-gray-300 font-mono">
        {server.ip_address ? server.ip_address : (
          <span className="text-gray-500 italic">Provisioning...</span>
        )}
      </div>

      <Link
        to={`/servers/${server.id}`}
        className="mt-auto text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
      >
        View Details →
      </Link>
    </div>
  )
}
