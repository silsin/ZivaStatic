import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import client from '../../api/client'

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-500/15 text-green-400',
    pending: 'bg-yellow-500/15 text-yellow-400',
    cancelled: 'bg-gray-500/15 text-gray-500',
  }
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.pending}`}>{status}</span>
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await client.get('/admin/subscriptions')
      setSubs(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, newStatus) {
    try {
      await client.patch(`/admin/subscriptions/${id}`, { status: newStatus })
      load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-bold text-white">Subscriptions</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800">
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Started</th>
              <th className="text-left px-5 py-3">Ends</th>
              <th className="text-left px-5 py-3">Created</th>
              <th className="text-left px-5 py-3">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-10 text-center"><Loader2 className="animate-spin text-blue-500 mx-auto" size={24} /></td></tr>
            ) : subs.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-600">No subscriptions</td></tr>
            ) : subs.map((s) => (
              <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-300 truncate max-w-[160px]">{s.user_email}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.plan_name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-300">${s.price_usd}</td>
                <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.started_at ? new Date(s.started_at).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.ends_at ? new Date(s.ends_at).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 px-2 py-1.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">active</option>
                    <option value="pending">pending</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
