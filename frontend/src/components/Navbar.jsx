import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, LayoutDashboard, LogOut, LogIn, Zap } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
          <ShieldCheck size={22} className="text-blue-400" />
          StaticIP VPN
        </Link>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Zap size={15} />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
