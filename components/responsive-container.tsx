"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
  padding?: "sm" | "md" | "lg"
}

export function ResponsiveContainer({
  children,
  className,
  maxWidth = "2xl",
  padding = "md",
}: ResponsiveContainerProps) {
  const maxWidthMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }

  const paddingMap = {
    sm: "px-2 sm:px-3 md:px-4",
    md: "px-3 sm:px-4 md:px-6 lg:px-8",
    lg: "px-4 sm:px-6 md:px-8 lg:px-12",
  }

  return (
    <div
      className={cn(
        "w-full mx-auto",
        maxWidthMap[maxWidth],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  )
}
