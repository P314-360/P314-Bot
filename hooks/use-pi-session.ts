"use client"

import { useState, useEffect } from "react"

const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const SESSION_KEY = "p314_session"
const LAST_ACTIVITY_KEY = "p314_last_activity"

interface SessionData {
  piAccessToken: string
  username: string
  userId: string
  createdAt: number
}

export function usePiSession() {
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false)
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [needsAuth, setNeedsAuth] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
  const [authMessage, setAuthMessage] = useState<string>("")

  const isSessionExpired = (lastActivity: number): boolean => {
    const now = Date.now()
    return now - lastActivity > SESSION_DURATION
  }

  const updateActivity = () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())
  }

  useEffect(() => {
    const checkExistingSession = () => {
      const storedSession = localStorage.getItem(SESSION_KEY)
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)

      if (storedSession && lastActivity) {
        const session: SessionData = JSON.parse(storedSession)
        const lastActivityTime = Number.parseInt(lastActivity, 10)

        if (!isSessionExpired(lastActivityTime)) {
          // Session is valid
          setSessionData(session)
          setIsSessionValid(true)
          updateActivity()
        } else {
          // Session expired, clear storage
          localStorage.removeItem(SESSION_KEY)
          localStorage.removeItem(LAST_ACTIVITY_KEY)
          setNeedsAuth(true)
        }
      } else {
        // No session exists, needs authentication
        setNeedsAuth(true)
      }

      setIsCheckingSession(false)
    }

    checkExistingSession()
  }, [])

  useEffect(() => {
    if (isSessionValid) {
      const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"]

      const handleActivity = () => {
        updateActivity()
      }

      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity)
      })

      return () => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleActivity)
        })
      }
    }
  }, [isSessionValid])

  const startAuthentication = async () => {
    setIsAuthenticating(true)
    setAuthMessage("Loading Pi Network SDK...")

    try {
      // Dynamically load Pi SDK
      const loadPiSDK = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector('script[src*="pi-sdk"]')) {
            resolve()
            return
          }

          const script = document.createElement("script")
          script.src = "https://sdk.minepi.com/pi-sdk.js"
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => reject(new Error("Failed to load Pi SDK"))
          document.head.appendChild(script)
        })
      }

      await loadPiSDK()

      if (typeof window.Pi === "undefined") {
        throw new Error("Pi SDK not available")
      }

      setAuthMessage("Initializing Pi Network...")
      await window.Pi.init({ version: "2.0", sandbox: false })

      setAuthMessage("Authenticating with Pi Network...")
      const piAuthResult = await window.Pi.authenticate(["username", "roles"])

      setAuthMessage("Logging in to backend...")
      const loginRes = await fetch("https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pi_auth_token: piAuthResult.accessToken }),
      })

      if (!loginRes.ok) {
        throw new Error(`Backend login failed with status: ${loginRes.status}`)
      }

      const loginData = await loginRes.json()

      // Create new session
      const newSession: SessionData = {
        piAccessToken: piAuthResult.accessToken,
        username: piAuthResult.user.username || "Pioneer",
        userId: piAuthResult.user.uid,
        createdAt: Date.now(),
      }

      // Store session
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())

      setSessionData(newSession)
      setIsSessionValid(true)
      setNeedsAuth(false)
      setAuthMessage("")
    } catch (error) {
      console.error("Authentication failed:", error)
      setAuthMessage("Authentication failed. Please try again.")
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    setSessionData(null)
    setIsSessionValid(false)
    setNeedsAuth(true)
  }

  return {
    isSessionValid,
    isCheckingSession,
    sessionData,
    needsAuth,
    isAuthenticating,
    authMessage,
    logout,
    startAuthentication,
  }
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<{
        accessToken: string
        user: { uid: string; username: string }
      }>
    }
  }
}
