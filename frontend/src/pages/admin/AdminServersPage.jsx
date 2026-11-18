import { useEffect, useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import client from '../../api/client'

function StatusBadge({ status }) {
  const map = {
    running: 'bg-green-500/15 text-green-400',
    active: 'bg-green-500/15 text-green-400',
    provisioning: 'bg-yellow-500/15 text-yellow-400',
    error: 'bg-red-500/15 text-red-400',
  }
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-500/15 text-gray-400'}`}>{status}</span>
}

function ConfirmDialog({ onConfirm, onCancel, serverName }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold">Delete Server</h3>
        </div>
        <p className="text-sm text-gray-400 mb-5">Delete <span className="text-white font-mono">{serverName}</span>? This will permanently remove it from Hetzner and cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm py-2 rounded-lg transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminServersPage() {
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmServer, setConfirmServer] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await client.get('/admin/servers')
      setServers(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(server) {
    setConfirmServer(null)
    setDeleting(server.id)
    try {
      await client.delete(`/admin/servers/${server.id}`)
      await load()
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  return (
    <div className="p-6 space-y-5">
      {confirmServer && (
        <ConfirmDialog
          serverName={confirmServer.name}
          onConfirm={() => handleDelete(confirmServer)}
          onCancel={() => setConfirmServer(null)}
        />
      )}
      <h1 className="text-xl font-bold text-white">Servers</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">IP Address</th>
              <th className="text-left px-5 py-3">Location</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Created</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center"><Loader2 className="animate-spin text-blue-500 mx-auto" size={24} /></td></tr>
            ) : servers.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-600">No servers</td></tr>
            ) : servers.map((s) => (
              <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-400 truncate max-w-[140px]">{s.user_email}</td>
                <td className="px-5 py-3.5 text-sm text-gray-200">{s.name}</td>
                <td className="px-5 py-3.5 text-sm font-mono text-gray-300">{s.ip_address || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.location}</td>
                <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  {deleting === s.id ? (
                    <Loader2 size={15} className="animate-spin text-gray-500" />
                  ) : (
                    <button onClick={() => setConfirmServer(s)} className="text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
