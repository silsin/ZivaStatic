import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { en, fa } from './translations'

const dictionaries = { en, fa }
const STORAGE_KEY = 'zs_lang'

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fa') return saved
  } catch {}
  // Primary audience is Persian-speaking; default to Persian unless the
  // browser clearly prefers another language.
  const nav = (navigator.language || 'fa').toLowerCase()
  return nav.startsWith('en') ? 'en' : 'fa'
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang)

  const value = useMemo(() => {
    const t = dictionaries[lang]
    const isFa = lang === 'fa'
    // Convert Latin digits (and the decimal point) to Persian ones in Persian mode.
    const num = (v) => {
      const s = String(v)
      if (!isFa) return s
      return s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]).replace(/\./g, '٫')
    }
    const place = (kind, name) => t.locations[kind]?.[name] || name
    return {
      lang,
      t,
      dir: isFa ? 'rtl' : 'ltr',
      isRtl: isFa,
      num,
      city: (n) => place('cities', n),
      country: (n) => place('countries', n),
      setLang: (l) => {
        setLangState(l)
        try { localStorage.setItem(STORAGE_KEY, l) } catch {}
      },
      toggleLang: () => {
        const next = lang === 'fa' ? 'en' : 'fa'
        setLangState(next)
        try { localStorage.setItem(STORAGE_KEY, next) } catch {}
      },
    }
  }, [lang])

  // Keep <html lang/dir>, the title and the meta description in sync.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = value.dir
    document.title = value.t.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', value.t.meta.description)
  }, [lang, value])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
