import { Link, useNavigate } from 'react-router-dom'
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
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">
          StaticIP VPN
        </Link>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/order"
                className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition-colors font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
