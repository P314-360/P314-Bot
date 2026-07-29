"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormGroupProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormGroup({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}
