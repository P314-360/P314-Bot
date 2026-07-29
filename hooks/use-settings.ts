"use client"

import { useState, useEffect } from "react"
import type { UserSettings } from "@/lib/types"

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  securityAlerts: true,
  language: "en",
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("p314_settings")
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.error("[P314] Failed to load settings:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    try {
      localStorage.setItem("p314_settings", JSON.stringify(updated))
    } catch (error) {
      console.error("[P314] Failed to save settings:", error)
    }
  }

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.toggle("dark", settings.theme === "dark")
    }
  }, [settings.theme, isLoaded])

  return {
    settings,
    updateSettings,
    isLoaded,
  }
}
