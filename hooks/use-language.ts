"use client"

import { useState, useEffect } from "react"
import { type SupportedLanguage, getTranslation, isRTL } from "@/lib/translations"

export const useLanguage = () => {
  const [language, setLanguage] = useState<SupportedLanguage>("en")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // First check localStorage
        const savedLanguage = localStorage.getItem("p314-language") as SupportedLanguage

        if (savedLanguage) {
          setLanguage(savedLanguage)
          document.documentElement.dir = isRTL(savedLanguage) ? "rtl" : "ltr"
          document.documentElement.lang = savedLanguage
        }

        // TODO: Sync with database language_preference when user is authenticated
        // const userLanguage = await fetchUserLanguagePreference()
        // if (userLanguage && userLanguage !== savedLanguage) {
        //   setLanguage(userLanguage)
        //   localStorage.setItem("p314-language", userLanguage)
        //   document.documentElement.dir = isRTL(userLanguage) ? "rtl" : "ltr"
        //   document.documentElement.lang = userLanguage
        // }
      } catch (error) {
        console.error("[v0] Language initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  const changeLanguage = async (lang: SupportedLanguage) => {
    setLanguage(lang)
    localStorage.setItem("p314-language", lang)
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr"
    document.documentElement.lang = lang

    try {
      const response = await fetch("/api/user/update-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to update language preference in database")
      }
    } catch (error) {
      console.error("[v0] Language update error:", error)
    }

    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: lang } }))
  }

  const t = getTranslation(language)

  return {
    language,
    changeLanguage,
    t,
    isRTL: isRTL(language),
    isLoading,
  }
}
