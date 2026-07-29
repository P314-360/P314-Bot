"use client"

import { Button } from "@/components/ui/button"
import { Globe, Check } from "lucide-react"
import { useState } from "react"
import { type SupportedLanguage, languageNames } from "@/lib/translations"

interface LanguageSwitcherProps {
  language: SupportedLanguage
  onChange: (lang: SupportedLanguage) => void
  primaryColor?: string
}

export function LanguageSwitcher({ language, onChange, primaryColor = "#674198" }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages: SupportedLanguage[] = ["en", "ar", "es", "fr", "de", "zh", "ja", "ko", "pt", "ru", "hi", "it"]

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
        title={languageNames[language]}
      >
        <Globe size={18} className="sm:w-5 sm:h-5" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute top-full mt-2 right-0 bg-pi-purple rounded-lg shadow-2xl z-50 w-48 max-h-80 overflow-y-auto border-2 border-pi-purple-800">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onChange(lang)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-white font-medium flex items-center justify-between transition-all duration-200 border-b border-pi-purple-800 last:border-b-0 ${
                  language === lang ? "bg-pi-purple-700 font-bold" : "hover:bg-pi-purple-800"
                }`}
              >
                <span>{languageNames[lang]}</span>
                {language === lang && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
