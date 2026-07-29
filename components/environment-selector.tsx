"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PiEnvironment } from "@/lib/pi-environment-config"

interface EnvironmentSelectorProps {
  onEnvironmentSelect: (env: PiEnvironment) => void
  isLoading?: boolean
}

export function EnvironmentSelector({ onEnvironmentSelect, isLoading = false }: EnvironmentSelectorProps) {
  const [selectedEnv, setSelectedEnv] = useState<PiEnvironment | null>(null)

  const handleSelect = (env: PiEnvironment) => {
    setSelectedEnv(env)
    onEnvironmentSelect(env)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Pi Network Environment</CardTitle>
          <CardDescription>اختر البيئة / Select your environment</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            اختر بين بيئة الاختبار أو البيئة الحقيقية للشبكة
            <br />
            Choose between testnet (testing) or mainnet (production)
          </p>

          <div className="grid grid-cols-1 gap-3 pt-4">
            {/* Testnet Option */}
            <button
              onClick={() => handleSelect("sandbox")}
              disabled={isLoading || selectedEnv !== null}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                selectedEnv === "sandbox"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                  : "border-yellow-200 dark:border-yellow-800 hover:border-yellow-400"
              } ${isLoading || selectedEnv !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1 rounded-full bg-yellow-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">Testnet (Sandbox)</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    للاختبار والتطوير / For testing and development
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    جميع العمليات تجريبية / All transactions are test only
                  </p>
                </div>
              </div>
            </button>

            {/* Mainnet Option */}
            <button
              onClick={() => handleSelect("mainnet")}
              disabled={isLoading || selectedEnv !== null}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                selectedEnv === "mainnet"
                  ? "border-red-500 bg-red-50 dark:bg-red-950"
                  : "border-red-200 dark:border-red-800 hover:border-red-400"
              } ${isLoading || selectedEnv !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1 rounded-full bg-red-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-red-900 dark:text-red-100">Mainnet (Production)</p>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    الشبكة الحقيقية / Production network
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    عمليات حقيقية بـ Pi / Real Pi transactions
                  </p>
                </div>
              </div>
            </button>
          </div>

          {selectedEnv && (
            <div className="pt-4 text-center">
              <p className={`text-sm font-medium ${selectedEnv === "sandbox" ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"}`}>
                {selectedEnv === "sandbox"
                  ? "جاري الاتصال بـ Testnet / Connecting to Testnet..."
                  : "جاري الاتصال بـ Mainnet / Connecting to Mainnet..."}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2">
            يمكنك تغيير البيئة من إعدادات التطبيق لاحقاً
            <br />
            You can change the environment later in settings
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
