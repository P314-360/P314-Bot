"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import { LogIn, Shield, CheckCircle2, Loader2, Eye } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"

interface LoginPageProps {
  onStartAuth: () => void
  onContinueAsGuest?: () => void
  authMessage?: string
  isAuthenticating?: boolean
}

export function LoginPage({ onStartAuth, onContinueAsGuest, authMessage, isAuthenticating }: LoginPageProps) {
  const { language, changeLanguage, t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher language={language} onChange={changeLanguage} primaryColor={COLORS.PRIMARY} />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-4">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: COLORS.PRIMARY }}>
            {APP_CONFIG.NAME}
          </CardTitle>
          <CardDescription className="text-base text-gray-600 px-2">{APP_CONFIG.DESCRIPTION}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <LogIn className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: COLORS.PRIMARY }} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2" style={{ color: COLORS.PRIMARY }}>
                  {t.realUse || "Real Use"}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {t.realUseDescription ||
                    "Authenticate using your official Pi Network account to access all features securely."}
                </p>

                <div className="space-y-2 mb-4 bg-white/60 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-800">
                    {t.permissionsRequired || "Permissions Required:"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.PRIMARY }} />
                    <span>{t.piUsername || "Your Pi Account Username"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.PRIMARY }} />
                    <span>{t.piRoles || "Your Pi Community Roles"}</span>
                  </div>
                </div>

                {authMessage && (
                  <p className="text-sm text-gray-700 italic mb-3 flex items-center gap-2 bg-white/60 p-2 rounded">
                    {isAuthenticating && <Loader2 className="w-4 h-4 animate-spin" />}
                    {authMessage}
                  </p>
                )}

                <Button
                  onClick={onStartAuth}
                  disabled={isAuthenticating}
                  className="w-full text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  style={{ backgroundColor: COLORS.PRIMARY }}
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      {t.loginWithPi || "Login with Pi Network"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">
              {t.securityNotice ||
                "Your session will remain active for 24 hours. After this period, you'll need to re-authenticate for security."}
            </p>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-600 text-center mb-3">
              {t.browseAsGuest || "Want to explore first?"}
            </p>
            <Button
              onClick={onContinueAsGuest}
              variant="outline"
              className="w-full text-gray-700 hover:bg-gray-50 border-gray-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              {t.continueAsGuest || "Continue as Guest"}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {t.guestLimitations || "View channels and read messages (posting disabled)"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
