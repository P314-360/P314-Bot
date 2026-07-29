import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft size={16} className="mr-2" />
            Back to Chat
          </Button>
        </Link>

        <Card>
          <CardHeader style={{ backgroundColor: COLORS.PRIMARY }}>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Shield size={24} />
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                {APP_CONFIG.NAME} is committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our
                support assistant service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                We collect the following information to provide you with support services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Pi Network authentication data (username, user ID, roles)</li>
                <li>Chat messages and support inquiries</li>
                <li>Usage data and interaction patterns</li>
                <li>Device information and browser type</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>To provide AI-powered support and resolve your issues</li>
                <li>To authenticate your identity via Pi Network</li>
                <li>To improve our service quality and response accuracy</li>
                <li>To maintain chat history for your convenience</li>
                <li>To comply with Pi Network policies and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your data. All communications are encrypted,
                and we never store sensitive information such as passphrases, passwords, or banking details. Our system
                actively blocks attempts to share such sensitive information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                Chat history is stored locally on your device and can be cleared at any time through the settings panel.
                Server-side data is retained only as long as necessary to provide support services and comply with legal
                obligations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                We integrate with Pi Network for authentication purposes. Please refer to Pi Network's privacy policy
                for information about how they handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-2">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of data collection (by discontinuing service use)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. GDPR & CCPA Compliance</h2>
              <p className="text-gray-700 leading-relaxed">
                We comply with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act)
                requirements. If you are a resident of the EU or California, you have additional rights regarding your
                personal data. Contact us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by
                posting the new policy on this page with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us through the
                Pi Network community channels or our official support system.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
