"use client"

import { useState, useEffect } from "react"
import {
  getPiEnvironmentConfig,
  getCurrentEnvironment,
  validateEnvironmentConfig,
  logEnvironmentConfig,
  type PiEnvironment,
} from "@/lib/pi-environment-config"

interface PiAuthResult {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

interface PiAuthState {
  environment: PiEnvironment
  isAuthenticated: boolean
  authMessage: string
  piAccessToken: string | null
  error: string | null
  isLoading: boolean
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<PiAuthResult>
    }
  }
}

/**
 * Hook for environment-aware Pi Network authentication
 * Automatically detects and uses correct SDK based on NEXT_PUBLIC_PI_ENV
 */
export const usePiEnvironmentAuth = () => {
  const [state, setState] = useState<PiAuthState>({
    environment: getCurrentEnvironment(),
    isAuthenticated: false,
    authMessage: "Initializing Pi Network...",
    piAccessToken: null,
    error: null,
    isLoading: true,
  })

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Log environment configuration
        logEnvironmentConfig()

        // Validate configuration
        const validation = validateEnvironmentConfig()
        if (!validation.valid) {
          throw new Error(`Configuration error: ${validation.errors.join(", ")}`)
        }

        setState((prev) => ({
          ...prev,
          authMessage: "Checking authentication status...",
          isLoading: false,
        }))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error during initialization"
        console.error("[Pi Auth Error]", errorMessage)
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          authMessage: "Failed to initialize Pi Network. Please refresh and try again.",
          isLoading: false,
        }))
      }
    }

    initAuth()
  }, [])

  const loadPiSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const config = getPiEnvironmentConfig()

        if (document.querySelector(`script[src="${config.sdkUrl}"]`)) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = config.sdkUrl
        script.async = true

        script.onload = () => {
          console.log("[v0] Pi SDK script loaded successfully from:", config.sdkUrl)
          resolve()
        }

        script.onerror = () => {
          const error = `Failed to load Pi SDK from ${config.sdkUrl}`
          console.error("[v0]", error)
          reject(new Error(error))
        }

        document.head.appendChild(script)
      } catch (err) {
        reject(err)
      }
    })
  }

  const authenticateWithPi = async (): Promise<void> => {
    const config = getPiEnvironmentConfig()

    setState((prev) => ({
      ...prev,
      authMessage: `Authenticating with Pi Network (${config.description})...`,
    }))

    const piAuthResult = await window.Pi.authenticate(["username", "roles"])

    setState((prev) => ({
      ...prev,
      authMessage: "Logging in to backend...",
    }))

    try {
      const loginRes = await fetch(`${config.backendUrl}/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pi_auth_token: piAuthResult.accessToken }),
      })

      if (!loginRes.ok) {
        throw new Error(`Backend login failed with status: ${loginRes.status}`)
      }

      await loginRes.json()
      console.log("[v0] Backend login successful")

      if (piAuthResult?.accessToken) {
        setState((prev) => ({
          ...prev,
          piAccessToken: piAuthResult.accessToken,
        }))
      }
    } catch (err) {
      console.error("[v0] Backend login error:", err)
      throw err
    }
  }

  const initializePiAndAuthenticate = async (): Promise<void> => {
    try {
      const config = getPiEnvironmentConfig()

      // Step 1: Load Pi SDK script
      setState((prev) => ({
        ...prev,
        authMessage: "Loading Pi Network SDK...",
      }))
      await loadPiSDK()

      // Step 2: Verify Pi object is available
      if (typeof window.Pi === "undefined") {
        throw new Error("Pi object not available after script load")
      }

      // Step 3: Initialize Pi Network with correct environment
      setState((prev) => ({
        ...prev,
        authMessage: `Initializing Pi Network (${config.description})...`,
      }))
      await window.Pi.init({
        version: "2.0",
        sandbox: config.sandbox,
      })

      // Step 4: Authenticate and login
      await authenticateWithPi()

      // Step 5: Success
      setState((prev) => ({
        ...prev,
        isAuthenticated: true,
        error: null,
        authMessage: "",
      }))

      console.log("[v0] Pi Network authentication successful")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("[v0] Pi Network initialization failed:", errorMessage)

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        authMessage: "Failed to authenticate with Pi Network. Please refresh and try again.",
        isAuthenticated: false,
      }))

      throw err
    }
  }

  const getEnvironmentInfo = () => {
    const config = getPiEnvironmentConfig()
    return {
      environment: config.env,
      description: config.description,
      isSandbox: config.sandbox,
      sdkUrl: config.sdkUrl,
      backendUrl: config.backendUrl,
    }
  }

  return {
    ...state,
    initializePiAndAuthenticate,
    getEnvironmentInfo,
  }
}
