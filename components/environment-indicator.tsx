"use client"

import { useEffect, useState } from "react"
import { getPiEnvironmentConfig, getCurrentEnvironment } from "@/lib/pi-environment-config"
import { Badge } from "@/components/ui/badge"

export function EnvironmentIndicator() {
  const [config, setConfig] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentConfig = getPiEnvironmentConfig()
    setConfig(currentConfig)
  }, [])

  if (!mounted || !config) return null

  const isSandbox = config.sandbox
  const badgeColor = isSandbox ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  const badgeLabel = isSandbox ? "Testnet" : "Mainnet"

  return (
    <Badge className={`${badgeColor} text-xs font-medium`} title={config.description}>
      {badgeLabel}
    </Badge>
  )
}

export function EnvironmentDebugInfo() {
  const [showDebug, setShowDebug] = useState(false)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const currentConfig = getPiEnvironmentConfig()
    setConfig(currentConfig)

    // Toggle debug info with Ctrl+Shift+D
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setShowDebug((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  if (!showDebug || !config) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg text-xs font-mono max-w-xs z-50 border border-gray-700">
      <div className="font-bold mb-2">Pi Environment Debug</div>
      <div className="space-y-1">
        <div>Env: <span className="text-blue-400">{config.env}</span></div>
        <div>Sandbox: <span className="text-yellow-400">{config.sandbox ? "Yes" : "No"}</span></div>
        <div>SDK URL: <span className="text-green-400 break-all">{config.sdkUrl}</span></div>
        <div>Backend: <span className="text-pink-400 break-all">{config.backendUrl}</span></div>
        <div className="text-gray-500 mt-2">Press Ctrl+Shift+D to hide</div>
      </div>
    </div>
  )
}
