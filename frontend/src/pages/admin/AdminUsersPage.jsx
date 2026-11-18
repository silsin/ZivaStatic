import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, ChevronRight, ShieldCheck } from 'lucide-react'
import client from '../../api/client'

function StatusBadge({ status }) {
  const map = {
    active: 'bg-green-500/15 text-green-400',
    pending: 'bg-yellow-500/15 text-yellow-400',
    cancelled: 'bg-gray-500/15 text-gray-500',
    none: 'bg-gray-500/15 text-gray-600',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || map.none}`}>
      {status}
    </span>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  async function load(p = 1, s = '') {
    setLoading(true)
    try {
      const res = await client.get(`/admin/users?page=${p}&limit=20${s ? `&search=${encodeURIComponent(s)}` : ''}`)
      setUsers(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load(page, search) }, [page])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    load(1, search)
  }

  async function toggleAdmin(user) {
    try {
      await client.patch(`/admin/users/${user.id}`, { is_admin: !user.is_admin })
      load(page, search)
    } catch (e) { console.error(e) }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Users</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email…"
              className="bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">Search</button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-800 bg-gray-900/60">
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Joined</th>
              <th className="text-left px-5 py-3">Servers</th>
              <th className="text-left px-5 py-3">Subscription</th>
              <th className="text-left px-5 py-3">Admin</th>
              <th className="text-left px-5 py-3">Active</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center"><Loader2 className="animate-spin text-blue-500 mx-auto" size={24} /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-600">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3.5 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    {u.is_admin && <ShieldCheck size={13} className="text-blue-400 flex-shrink-0" />}
                    {u.email}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{u.server_count}</td>
                <td className="px-5 py-3.5"><StatusBadge status={u.subscription_status || 'none'} /></td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleAdmin(u)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      u.is_admin ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      u.is_admin ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`w-2 h-2 rounded-full inline-block ${u.is_active ? 'bg-green-400' : 'bg-gray-600'}`} />
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-colors">← Prev</button>
          <span className="text-xs text-gray-500">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={users.length < 20} className="text-sm text-gray-400 hover:text-white disabled:opacity-40 transition-colors">Next →</button>
        </div>
      </div>
    </div>
  )
}
