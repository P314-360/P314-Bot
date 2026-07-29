"use client"

import { useState, useEffect } from "react"

const ADMIN_USERNAME = "Axis2030"

export function useAdminCheck(piUsername: string | null) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (piUsername === ADMIN_USERNAME) {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [piUsername])

  return { isAdmin, adminUsername: ADMIN_USERNAME }
}
