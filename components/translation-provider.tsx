"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useLanguage } from "@/hooks/use-language"
import type { Translation, SupportedLanguage } from "@/lib/translations"

interface TranslationContextType {
  t: Translation
  language: SupportedLanguage
  changeLanguage: (lang: SupportedLanguage) => Promise<void>
  isRTL: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const languageHook = useLanguage()

  useEffect(() => {
    const handleLanguageChange = () => {
      // Force update by setting a state or triggering re-render
      window.location.reload() // Simple approach - reload page to apply language everywhere
    }

    window.addEventListener("languageChange", handleLanguageChange)
    return () => window.removeEventListener("languageChange", handleLanguageChange)
  }, [])

  return <TranslationContext.Provider value={languageHook}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }
  return context
}
