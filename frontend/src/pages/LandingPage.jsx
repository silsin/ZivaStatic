import { Link } from 'react-router-dom'
import {
  MapPin, Server, Clock, ShieldCheck, Globe, Zap, Check,
  ArrowRight, Star, Building2, Wifi, Lock, RefreshCw
} from 'lucide-react'

const FEATURES = [
  {
    icon: MapPin,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Truly Dedicated IP',
    desc: 'Your IP address belongs only to you. Nobody else shares it. It never changes, never rotates, never gets reassigned.',
  },
  {
    icon: Globe,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'Global Locations',
    desc: 'Pick your IP location from datacenters across Germany, Finland, Singapore, and the United States.',
  },
  {
    icon: Clock,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Ready in Minutes',
    desc: 'Your dedicated server is provisioned automatically the moment your order is confirmed. No waiting, no support tickets.',
  },
  {
    icon: Wifi,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: '4 Connection Methods',
    desc: 'Connect from any device using OpenVPN, WireGuard, IKEv2, or V2Ray — all pre-configured and ready to download.',
  },
  {
    icon: Server,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    title: 'Your Own Server',
    desc: 'Not a shared proxy. You get a real dedicated cloud server. No IP reputation issues, no throttling, no overcrowding.',
  },
  {
    icon: RefreshCw,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Always On',
    desc: 'Your server runs 24/7 with automatic restarts. Your IP is always reachable whenever you need it.',
  },
]

const USE_CASES = [
  {
    icon: Building2,
    title: 'Business & Remote Work',
    desc: 'Whitelist a fixed IP in your firewall, CRM, payment gateway, or ERP system. Your team connects from one known address no matter where they are.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access',
    desc: 'Restrict access to servers, databases, and admin panels by IP. Only traffic from your dedicated IP gets through.',
  },
  {
    icon: Globe,
    title: 'Geo-specific Needs',
    desc: 'Need a German IP for banking, a US IP for a service, or a Singapore IP for regional access? Pick the location that fits.',
  },
  {
    icon: Lock,
    title: 'Privacy & Control',
    desc: "Your internet traffic routes through a server you control. No logs, no shared users, no wondering who else is on your IP.",
  },
]

const STEPS = [
  { step: '01', title: 'Pick a location', desc: 'Choose the country where your IP should appear.' },
  { step: '02', title: 'Complete payment', desc: 'Secure checkout, monthly subscription, cancel anytime.' },
  { step: '03', title: 'Server is provisioned', desc: 'Your dedicated server is set up automatically within minutes.' },
  { step: '04', title: 'Download & connect', desc: 'Download your connection config and connect from any device.' },
]

const PRICING_FEATURES = [
  'Dedicated server — yours alone',
  'Fixed static IP address',
  'Your choice of global location',
  '4 ready-to-use connection configs',
  'Available 24/7, automatic restarts',
  'Cancel anytime',
]

const FAQS = [
  {
    q: 'What exactly is a static IP address?',
    a: 'A static IP is a fixed internet address that never changes. Unlike a home or mobile connection where your IP rotates, a static IP stays the same every time you connect — making it reliable for whitelisting, remote access, and identity consistency online.',
  },
  {
    q: 'How is this different from a regular VPN service?',
    a: 'Standard VPN services give you a shared IP used by thousands of people. With us, you get a dedicated server with an IP that belongs only to you. Nobody else uses it, it never gets flagged for someone else\'s behavior, and it\'s yours as long as your subscription is active.',
  },
  {
    q: 'What are OpenVPN, WireGuard, IKEv2, and V2Ray?',
    a: 'These are connection protocols — the technical methods your device uses to route traffic through your server. We configure all four automatically. Most users pick WireGuard (fastest) or OpenVPN (most compatible). You just download the config and connect.',
  },
  {
    q: 'How long does setup take?',
    a: 'Your server is provisioned automatically within 5–10 minutes of payment. No manual intervention required.',
  },
  {
    q: 'Can I use this for my entire team?',
    a: 'Yes. You can share the connection configs with your team so everyone routes through the same dedicated IP. This is ideal for IP whitelisting in business tools.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'Your server and IP address are released at the end of your billing period. You can reorder at any time, though the same IP address cannot be guaranteed after cancellation.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Servers provisioned automatically — no waiting
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Your Own
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Static IP Address
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          A dedicated IP address in a location you choose. Fixed, permanent, and yours alone.
          Connect from any device using the included configs.
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mb-12 text-base">
          Used for business whitelisting, secure remote access, geo-specific browsing, and privacy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/order"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            Get Your Static IP
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg border border-gray-700"
          >
            Create Account
          </Link>
        </div>

        {/* Social proof bar */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
            </div>
            <span>Trusted by businesses worldwide</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-400" />
            <span>No shared IPs — ever</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-400" />
            <span>Live in under 10 minutes</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you get</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A complete dedicated IP solution. Everything set up for you, nothing to configure manually.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors group">
                  <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={22} className={f.color} />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Who uses a static IP?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Anyone who needs a consistent, reliable internet identity — for work, security, or access.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {USE_CASES.map((u) => {
            const Icon = u.icon
            return (
              <div key={u.title} className="flex gap-5 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{u.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{u.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400">From order to connected in four steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-blue-500/40 to-transparent z-0" />
                )}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative z-10">
                  <div className="text-3xl font-black text-blue-500/30 mb-3">{s.step}</div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">One plan, everything included</h2>
          <p className="text-gray-400">No tiers, no upsells, no surprises.</p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-black text-white">$9.99</span>
              <span className="text-gray-400 mb-2">/ month</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">Per dedicated IP. Cancel anytime.</p>

            <ul className="space-y-3 mb-8">
              {PRICING_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-blue-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/order"
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all text-base shadow-lg shadow-blue-500/20"
            >
              Get Your Static IP
              <ArrowRight size={18} />
            </Link>

            <p className="text-center text-gray-600 text-xs mt-4">
              Secure checkout · Instant provisioning · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Ready for your own static IP?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Pick a location, complete your order, and your dedicated IP is live within minutes.
        </p>
        <Link
          to="/order"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all text-lg shadow-lg shadow-blue-500/25"
        >
          Get Started Now
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 font-semibold text-gray-400">
            <ShieldCheck size={18} className="text-blue-400" />
            ZivaStatic
          </div>
          <div className="flex gap-6">
            <Link to="/order" className="hover:text-gray-300 transition-colors">Order</Link>
            <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">Register</Link>
          </div>
          <div>© {new Date().getFullYear()} ZivaStatic. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
