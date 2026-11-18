import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import client from '../../api/client'

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full relative transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-700'
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
        checked ? 'translate-x-4' : 'translate-x-0.5'
      }`} />
    </button>
  )
}

function Section({ title, children, onSave, saving }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-semibold text-white mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
      <div className="mt-6">
        <button
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save changes
        </button>
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})

  async function load() {
    setLoading(true)
    try {
      const res = await client.get('/admin/settings')
      const map = {}
      res.data.forEach((s) => { map[s.key] = s.value })
      setSettings(map)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  function get(key, fallback = '') { return settings[key] ?? fallback }
  function set(key, value) { setSettings((s) => ({ ...s, [key]: value })) }

  async function saveKeys(keys, sectionKey) {
    setSaving((s) => ({ ...s, [sectionKey]: true }))
    try {
      await Promise.all(
        keys.map((key) =>
          client.post('/admin/settings', { key, value: String(settings[key] ?? '') })
        )
      )
    } catch (e) { console.error(e) }
    finally { setSaving((s) => ({ ...s, [sectionKey]: false })) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" size={28} /></div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Settings</h1>

      {/* Site Identity */}
      <Section title="Site Identity" onSave={() => saveKeys(['site_name', 'site_tagline'], 'identity')} saving={saving.identity}>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Site Name</label>
          <input
            value={get('site_name', 'ZivaStatic')}
            onChange={(e) => set('site_name', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Site Tagline</label>
          <input
            value={get('site_tagline', 'Dedicated Static IPs Worldwide')}
            onChange={(e) => set('site_tagline', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </Section>

      {/* Promo Banner */}
      <Section title="Promo Banner" onSave={() => saveKeys(['promo_text', 'promo_enabled'], 'promo')} saving={saving.promo}>
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">Show promo banner</label>
          <ToggleSwitch
            checked={get('promo_enabled', 'false') === 'true'}
            onChange={(v) => set('promo_enabled', String(v))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Banner Text</label>
          <input
            value={get('promo_text', '')}
            onChange={(e) => set('promo_text', e.target.value)}
            placeholder="e.g. Limited time: First month 50% off!"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </Section>

      {/* Payment Methods */}
      <Section title="Payment Methods" onSave={() => saveKeys(['stripe_enabled'], 'payment')} saving={saving.payment}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-200">Stripe Payments</p>
            <p className="text-xs text-gray-500 mt-0.5">Enable or disable Stripe checkout for new orders</p>
          </div>
          <ToggleSwitch
            checked={get('stripe_enabled', 'true') === 'true'}
            onChange={(v) => set('stripe_enabled', String(v))}
          />
        </div>
      </Section>
    </div>
  )
}
