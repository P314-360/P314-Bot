import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import Link from "next/link"

export default function TermsPage() {
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
              <FileText size={24} />
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using {APP_CONFIG.NAME}, you agree to be bound by these Terms of Service and all
                applicable laws and regulations. If you do not agree with any part of these terms, you may not use our
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {APP_CONFIG.NAME} is an AI-powered support assistant for the Pi Network community. We provide automated
                assistance for common issues related to KYC, Mainnet migration, account access, and other Pi Network
                features. Our service is unofficial and operates independently from the core Pi Network team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>You must be a legitimate Pi Network user with valid credentials</li>
                <li>You must not share sensitive information (passphrases, passwords, bank details)</li>
                <li>You must not attempt to exploit, hack, or misuse the service</li>
                <li>You must not use the service for illegal or unauthorized purposes</li>
                <li>You must not impersonate others or provide false information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Security Guidelines</h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                For your protection, {APP_CONFIG.NAME} enforces strict security policies:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>NEVER share your passphrase or security phrase with the bot</li>
                <li>NEVER provide passwords, PINs, or private keys</li>
                <li>NEVER share banking or payment card information</li>
                <li>Our system will automatically block messages containing sensitive data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-2">You may not:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Request financial or investment advice</li>
                <li>Promote non-official Pi Network tokens or projects</li>
                <li>Spread misinformation about Pi Network</li>
                <li>Attempt to manipulate or deceive the AI system</li>
                <li>Use the service to spam or harass others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitations of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                {APP_CONFIG.NAME} provides information based on official Pi Network documentation and help resources.
                While we strive for accuracy, we cannot guarantee that all information is current or complete. For
                critical issues, always consult official Pi Network support channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
                access, error-free operation, or that the service will meet your specific requirements. Use at your own
                risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                {APP_CONFIG.NAME} and its operators shall not be liable for any damages arising from your use or
                inability to use the service, including but not limited to account access issues, lost Pi, or decisions
                made based on information provided by the AI.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, trademarks, and intellectual property related to {APP_CONFIG.NAME} are owned by the service
                operators. Pi Network trademarks and content are property of the Pi Core Team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your access to the service at any time for violations of
                these terms or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may modify these Terms of Service at any time. Continued use of the service after changes constitutes
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms shall be governed by and construed in accordance with applicable international laws and
                regulations governing digital services and data protection.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, please contact us through official Pi Network community
                channels.
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
