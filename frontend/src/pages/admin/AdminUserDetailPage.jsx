import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Server, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import client from '../../api/client'

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-500/15 text-green-400',
    provisioning: 'bg-yellow-500/15 text-yellow-400',
    running: 'bg-green-500/15 text-green-400',
    error: 'bg-red-500/15 text-red-400',
    pending: 'bg-gray-500/15 text-gray-400',
    cancelled: 'bg-gray-500/15 text-gray-500',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.pending}`}>
      {status}
    </span>
  )
}

export default function AdminUserDetailPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await client.get(`/admin/users/${userId}`)
      setUser(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [userId])

  async function updateSubStatus(subId, newStatus) {
    try {
      await client.patch(`/admin/subscriptions/${subId}`, { status: newStatus })
      load()
    } catch (e) { console.error(e) }
  }

  async function toggleActive() {
    try {
      await client.patch(`/admin/users/${userId}`, { is_active: !user.is_active })
      load()
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" size={28} /></div>
  if (!user) return <div className="p-6 text-gray-500">User not found.</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin/users')} className="text-gray-500 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-white">{user.email}</h1>
        {user.is_admin && <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-600/15 px-2 py-0.5 rounded-full"><ShieldCheck size={11} /> Admin</span>}
      </div>

      {/* Profile card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Profile</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-gray-500 mb-1">User ID</p><p className="text-gray-300 font-mono text-xs">{user.id.slice(0, 8)}…</p></div>
          <div><p className="text-gray-500 mb-1">Joined</p><p className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p></div>
          <div><p className="text-gray-500 mb-1">Status</p><StatusBadge status={user.is_active ? 'active' : 'suspended'} /></div>
          <div><p className="text-gray-500 mb-1">Actions</p>
            <button onClick={toggleActive} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              {user.is_active ? 'Suspend user' : 'Activate user'}
            </button>
          </div>
        </div>
      </div>

      {/* Servers */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <Server size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-white">Servers ({user.servers.length})</h2>
        </div>
        {user.servers.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-600">No servers.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">IP</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {user.servers.map((s) => (
                <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-sm text-gray-300">{s.name}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-400">{s.ip_address || '—'}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{s.location}</td>
                  <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3 text-sm text-gray-400">{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Subscriptions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <CreditCard size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-white">Subscriptions ({user.subscriptions.length})</h2>
        </div>
        {user.subscriptions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-gray-600">No subscriptions.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3">Plan</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Started</th>
                <th className="text-left px-5 py-3">Ends</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {user.subscriptions.map((s) => (
                <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-sm text-gray-300">{s.plan_name}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">${s.price_usd}</td>
                  <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-3 text-sm text-gray-400">{s.started_at ? new Date(s.started_at).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{s.ends_at ? new Date(s.ends_at).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3">
                    <select
                      value={s.status}
                      onChange={(e) => updateSubStatus(s.id, e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 px-2 py-1 focus:outline-none focus:border-blue-500"
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
        )}
      </div>
    </div>
  )
}
