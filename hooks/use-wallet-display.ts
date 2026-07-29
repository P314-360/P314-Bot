"use client"

import { useState, useEffect } from "react"

interface WalletInfo {
  address: string | null
  balance: number | null
  isLoading: boolean
}

export function useWalletDisplay(piAccessToken: string | null, isEnabled: boolean) {
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: null,
    balance: null,
    isLoading: false,
  })

  useEffect(() => {
    if (!piAccessToken || !isEnabled) {
      setWalletInfo({ address: null, balance: null, isLoading: false })
      return
    }

    const fetchWalletInfo = async () => {
      setWalletInfo((prev) => ({ ...prev, isLoading: true }))

      try {
        // This would normally call Pi Network's wallet API
        // For now, we'll use a placeholder
        // In production, you would integrate with Pi's payment/wallet API
        const response = await fetch("/api/wallet/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            piAccessToken,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setWalletInfo({
            address: data.walletAddress || null,
            balance: data.balance || null,
            isLoading: false,
          })
        } else {
          setWalletInfo({ address: null, balance: null, isLoading: false })
        }
      } catch (error) {
        console.error("Failed to fetch wallet info:", error)
        setWalletInfo({ address: null, balance: null, isLoading: false })
      }
    }

    fetchWalletInfo()
  }, [piAccessToken, isEnabled])

  return walletInfo
}
