import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Loader2, AlertCircle, Check } from 'lucide-react'
import client from '../api/client'
import useAuthStore from '../store/authStore'

const PERKS = [
  'Your own dedicated IP address',
  'All 4 connection configs included',
  'Live within 10 minutes of ordering',
]

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setToken = useAuthStore((s) => s.setToken)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await client.post('/auth/register', { email, password })
      setToken(res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm">Get your static IP address in minutes</p>
        </div>

        {/* Perks */}
        <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 mb-6 space-y-2">
          {PERKS.map((p) => (
            <div key={p} className="flex items-center gap-2.5 text-sm text-gray-300">
              <span className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={10} className="text-blue-400" />
              </span>
              {p}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-sm px-4 py-3 rounded-lg">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400 font-medium">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400 font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm text-gray-400 font-medium">Confirm password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
