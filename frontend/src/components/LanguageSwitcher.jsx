import { Languages } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

export default function LanguageSwitcher() {
  const { t, toggleLang } = useLang()
  return (
    <button
      onClick={toggleLang}
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700 px-3 py-2 rounded-lg transition-colors"
      aria-label="Change language"
    >
      <Languages size={15} />
      {t.switchTo}
    </button>
  )
}
