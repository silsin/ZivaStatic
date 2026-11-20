import { Link } from 'react-router-dom'
import {
  MapPin, Server, Clock, ShieldCheck, Globe, Zap, Check, ArrowRight,
  Building2, Wifi, Lock, RefreshCw, Users, Code2, ShoppingCart, Briefcase, FlaskConical,
} from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

const FEATURE_STYLE = [
  { icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Globe, color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Wifi, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { icon: Server, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: RefreshCw, color: 'text-pink-400', bg: 'bg-pink-500/10' },
]

const USE_CASE_ICONS = [Building2, ShieldCheck, Users, Code2, ShoppingCart, Briefcase, FlaskConical, Lock]

const TRUST_ICONS = [
  { icon: ShieldCheck, color: 'text-green-400' },
  { icon: Clock, color: 'text-blue-400' },
  { icon: Globe, color: 'text-purple-400' },
]

export default function LandingPage() {
  const { t, num } = useLang()
  const L = t.landing

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 sm:pt-28 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {L.badge}
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.25]">
          <span className="bg-gradient-to-br from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            {L.heroLine1}
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            {L.heroLine2}
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">{L.heroP1}</p>
        <p className="text-gray-500 max-w-xl mx-auto mb-12 text-base">{L.heroP2}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/order"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            {L.ctaPrimary}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg border border-gray-700"
          >
            {L.ctaSecondary}
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
          {L.trust.map((text, i) => {
            const { icon: Icon, color } = TRUST_ICONS[i]
            return (
              <div key={text} className="flex items-center gap-2">
                <Icon size={14} className={color} />
                <span>{text}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{L.featuresTitle}</h2>
            <p className="text-gray-400 max-w-xl mx-auto">{L.featuresSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {L.features.map((f, i) => {
              const { icon: Icon, color, bg } = FEATURE_STYLE[i]
              return (
                <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                  <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={22} className={color} />
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{L.useCasesTitle}</h2>
          <p className="text-gray-400 max-w-xl mx-auto">{L.useCasesSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {L.useCases.map((u, i) => {
            const Icon = USE_CASE_ICONS[i]
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{L.stepsTitle}</h2>
            <p className="text-gray-400">{L.stepsSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {L.steps.map((s, i) => (
              <div key={s.title} className="relative">
                {i < L.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 start-full w-full h-px bg-gradient-to-r rtl:bg-gradient-to-l from-blue-500/40 to-transparent z-0" />
                )}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative z-10">
                  <div className="text-3xl font-black text-blue-500/30 mb-3">{num(`0${i + 1}`)}</div>
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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{L.pricingTitle}</h2>
          <p className="text-gray-400">{L.pricingSub}</p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="flex items-end gap-2 mb-1">
              <span className="text-5xl font-black text-white">{t.common.price}</span>
              <span className="text-gray-400 mb-2">{t.common.month}</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">{L.pricingNote}</p>

            <ul className="space-y-3 mb-8">
              {L.pricingFeatures.map((item) => (
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
              {L.ctaPrimary}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>

            <p className="text-center text-gray-600 text-xs mt-4">{L.pricingFooter}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-900/50 border-y border-gray-800 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{L.faqTitle}</h2>
          </div>
          <div className="space-y-4">
            {L.faqs.map((faq) => (
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
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-[1.3] bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          {L.ctaTitle}
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">{L.ctaSub}</p>
        <Link
          to="/order"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl transition-all text-lg shadow-lg shadow-blue-500/25"
        >
          {L.ctaButton}
          <ArrowRight size={20} className="rtl:rotate-180" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 font-semibold text-gray-400" dir="ltr">
            <Zap size={18} className="text-blue-400" />
            ZivaStatic
          </div>
          <div className="flex gap-6">
            <Link to="/order" className="hover:text-gray-300 transition-colors">{L.footerOrder}</Link>
            <Link to="/login" className="hover:text-gray-300 transition-colors">{L.footerLogin}</Link>
            <Link to="/register" className="hover:text-gray-300 transition-colors">{L.footerRegister}</Link>
          </div>
          <div>© {num(new Date().getFullYear())} ZivaStatic. {L.rights}</div>
        </div>
      </footer>
    </div>
  )
}
