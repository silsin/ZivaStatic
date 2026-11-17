import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🎯',
    title: 'Static IP',
    desc: 'You get a dedicated IP address that nobody else shares. Consistent identity for every connection.',
  },
  {
    icon: '🔐',
    title: '4 Protocols',
    desc: 'OpenVPN, WireGuard, IKEv2, and V2Ray — all auto-configured and ready to use on any device.',
  },
  {
    icon: '🌍',
    title: 'Global Locations',
    desc: 'Choose from all Hetzner datacenters across Europe, North America, and Asia.',
  },
  {
    icon: '⚡',
    title: 'Instant Setup',
    desc: 'Your server is provisioned automatically in minutes after payment. No manual steps.',
  },
]

const PRICING_FEATURES = [
  'Dedicated Hetzner server',
  'Static IP address',
  '4 VPN protocols (OpenVPN, WireGuard, IKEv2, V2Ray)',
  'All global Hetzner locations',
  'Full root access',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Powered by Hetzner Cloud
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Your Own Static IP VPN
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          A dedicated server with a static IP address, four VPN protocols configured automatically,
          and your choice of any Hetzner datacenter worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/order"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg"
          >
            Get Started — $9.99/mo
          </Link>
          <Link
            to="/login"
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-lg border border-gray-700"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 transition-colors"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
        <div className="max-w-sm mx-auto bg-gray-900 border border-blue-500/40 rounded-2xl p-8 text-center shadow-xl shadow-blue-500/10">
          <div className="text-5xl font-extrabold text-white mb-1">
            $9.99
          </div>
          <div className="text-gray-400 mb-8">per month</div>
          <ul className="text-left space-y-3 mb-8">
            {PRICING_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            to="/order"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} StaticIP VPN. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
