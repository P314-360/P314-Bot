"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps {
  children: ReactNode
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
  }
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
}: ResponsiveGridProps) {
  const gapMap = {
    sm: "gap-2 sm:gap-3",
    md: "gap-3 sm:gap-4 md:gap-6",
    lg: "gap-4 sm:gap-6 md:gap-8",
  }

  const colsClass = cn(
    "grid",
    {
      "grid-cols-1": cols.mobile === 1,
      "grid-cols-2": cols.mobile === 2,
      "grid-cols-3": cols.mobile === 3,
      "sm:grid-cols-1": cols.tablet === 1,
      "sm:grid-cols-2": cols.tablet === 2,
      "sm:grid-cols-3": cols.tablet === 3,
      "md:grid-cols-1": cols.desktop === 1,
      "md:grid-cols-2": cols.desktop === 2,
      "md:grid-cols-3": cols.desktop === 3,
      "lg:grid-cols-4": cols.desktop === 4,
    },
    gapMap[gap],
    className
  )

  return <div className={colsClass}>{children}</div>
}
