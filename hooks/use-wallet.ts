"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface WalletData {
  address: string | null
  isConnected: boolean
  balance: number
}

export function useWallet(userId: string | null) {
  const [walletData, setWalletData] = useState<WalletData>({
    address: null,
    isConnected: false,
    balance: 0,
  })
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (userId) {
      fetchWalletData()
    }
  }, [userId])

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`/api/wallet/info?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setWalletData({
          address: data.walletAddress,
          isConnected: !!data.walletAddress,
          balance: data.balance || 0,
        })
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error)
    }
  }

  const authenticateWallet = async () => {
    if (!window.Pi) {
      toast({
        title: "Error",
        description: "Pi SDK not available. Please open in Pi Browser.",
        variant: "destructive",
      })
      return
    }

    setIsAuthenticating(true)

    try {
      // SECURITY: Use Pi SDK authenticate() - returns ONLY public wallet address
      // This method NEVER requests or handles the user's 24-word passphrase
      const scopes = ["username", "payments"]
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound)

      // Extract ONLY the public wallet address from authentication
      const publicWalletAddress = authResult.user.uid // Pi user identifier (public)

      // Save ONLY public wallet address to database (never private keys or passphrase)
      const response = await fetch("/api/wallet/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          walletAddress: publicWalletAddress,
        }),
      })

      if (response.ok) {
        await fetchWalletData()
        toast({
          title: "Success",
          description: "Wallet authenticated securely!",
        })
      }
    } catch (error) {
      console.error("Wallet authentication error:", error)
      toast({
        title: "Authentication Failed",
        description: "Could not authenticate wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Handle incomplete payments (required by Pi SDK)
  const onIncompletePaymentFound = (payment: any) => {
    console.log("Incomplete payment found:", payment.identifier)
    // Handle incomplete payment if needed
  }

  const disconnectWallet = async () => {
    try {
      const response = await fetch("/api/wallet/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        setWalletData({ address: null, isConnected: false, balance: 0 })
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected successfully.",
        })
      }
    } catch (error) {
      console.error("Disconnect error:", error)
    }
  }

  return {
    walletData,
    isAuthenticating,
    authenticateWallet,
    disconnectWallet,
    refresh: fetchWalletData,
  }
}
