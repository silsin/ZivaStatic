import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, LayoutDashboard, LogOut, LogIn, ArrowRight } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { useLang } from '../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const { t } = useLang()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50 text-white px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity" dir="ltr">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <span className="text-white">Ziva<span className="text-blue-400">Static</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
              >
                <LayoutDashboard size={15} />
                {t.nav.dashboard}
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={14} className="rtl:rotate-180" />
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
              >
                <LogIn size={15} className="rtl:rotate-180" />
                {t.nav.signIn}
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                {t.nav.getStarted}
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
