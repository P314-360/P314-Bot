"use client"

import { useState, useCallback } from "react"

interface UseAdminAPIOptions {
  username: string
}

export function useAdminAPI({ username }: UseAdminAPIOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            "x-pi-username": username,
            "Content-Type": "application/json",
          },
        })

        if (response.status === 403) {
          throw new Error("Unauthorized: Admin access required")
        }

        if (!response.ok) {
          throw new Error(`Request failed: ${response.statusText}`)
        }

        const data = await response.json()
        return data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error"
        setError(errorMessage)
        console.error("[Admin API Error]", errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [username],
  )

  return { fetchWithAuth, loading, error }
}
