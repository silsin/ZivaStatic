import { useEffect, useState } from 'react'
import { Users, Server, DollarSign, Activity, AlertTriangle, Loader2 } from 'lucide-react'
import client from '../../api/client'

function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    yellow: 'bg-yellow-600/20 text-yellow-400',
    red: 'bg-red-600/20 text-red-400',
  }
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-500/15 text-green-400',
    provisioning: 'bg-yellow-500/15 text-yellow-400',
    error: 'bg-red-500/15 text-red-400',
    pending: 'bg-gray-500/15 text-gray-400',
    cancelled: 'bg-gray-500/15 text-gray-500',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.pending}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, usersRes, subsRes] = await Promise.all([
          client.get('/admin/stats'),
          client.get('/admin/users?page=1&limit=5'),
          client.get('/admin/subscriptions'),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data)
        setSubs(subsRes.data.slice(0, 5))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
    </div>
  )

  const byStatus = stats?.servers_by_status || {}

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.total_users} />
        <StatCard icon={Server} label="Total Servers" value={stats?.total_servers} />
        <StatCard icon={DollarSign} label="Revenue (active)" value={stats ? `$${stats.total_revenue.toFixed(2)}` : null} color="green" />
        <StatCard icon={Activity} label="Active Servers" value={byStatus.running ?? 0} color="green" />
        <StatCard icon={Loader2} label="Provisioning" value={byStatus.provisioning ?? 0} color="yellow" />
        <StatCard icon={AlertTriangle} label="Error Servers" value={byStatus.error ?? 0} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Recent Users</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Servers</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-300 truncate max-w-[180px]">{u.email}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{u.server_count}</td>
                  <td className="px-5 py-3"><StatusBadge status={u.subscription_status || 'none'} /></td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-gray-600">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Subscriptions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-white">Recent Subscriptions</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3">User</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-300 truncate max-w-[180px]">{s.user_email}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">${s.price_usd}</td>
                  <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-6 text-center text-sm text-gray-600">No subscriptions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
