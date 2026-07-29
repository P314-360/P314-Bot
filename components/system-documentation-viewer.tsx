"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, MapIcon, Network, DollarSign, Download } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { SYSTEM_DOCUMENTATION } from "@/lib/system-documentation"

export function SystemDocumentationViewer() {
  const { language } = useLanguage()
  const [activeSection, setActiveSection] = useState("overview")

  const doc = (SYSTEM_DOCUMENTATION as Record<string, typeof SYSTEM_DOCUMENTATION["en"]>)[language] ?? SYSTEM_DOCUMENTATION.en

  const exportDocumentation = () => {
    const content = JSON.stringify(doc, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `p314-documentation-${language}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-pi-purple bg-gradient-to-r from-pi-purple/10 to-pi-purple-dark/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-pi-purple">
                <BookOpen className="h-6 w-6" />
                {doc.overview.title}
              </CardTitle>
              <CardDescription className="text-base mt-2">{doc.overview.description}</CardDescription>
            </div>
            <Button onClick={exportDocumentation} variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <BookOpen className="h-4 w-4" />
            {language === "ar" ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-2">
            <MapIcon className="h-4 w-4" />
            {language === "ar" ? "خارطة الطريق" : "Roadmap"}
          </TabsTrigger>
          <TabsTrigger value="modules" className="gap-2">
            <Network className="h-4 w-4" />
            {language === "ar" ? "الوحدات" : "Modules"}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {doc.overview.sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {index + 1}. {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{section.content}</pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{doc.roadmap.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {doc.roadmap.phases.map((phase: { phase: string; status: string; items: string[] }, index: number) => (
                <div key={index} className="border-l-4 border-pi-purple pl-4">
                  <h3 className="text-lg font-bold mb-3">{phase.phase}</h3>
                  <ul className="space-y-2">
                    {phase.items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{doc.modules.title}</CardTitle>
              <CardDescription>{doc.modules.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  {doc.modules.diagram}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Financial Flow Summary */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <DollarSign className="h-5 w-5" />
            {language === "ar" ? "ملخص التدفق المالي" : "Financial Flow Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="font-medium">{language === "ar" ? "إيرادات الإدارة:" : "Admin Revenue:"}</div>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li>✓ {language === "ar" ? "عمولة المحققين: 10%" : "Validator Commission: 10%"}</li>
            <li>✓ {language === "ar" ? "رسوم السحب: 5%" : "Withdrawal Fees: 5%"}</li>
            <li>✓ {language === "ar" ? "الخدمات المميزة: 100%" : "Premium Services: 100%"}</li>
          </ul>
          <div className="font-medium mt-4">{language === "ar" ? "مدفوعات المستخدمين:" : "User Payments:"}</div>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li>
              ✓ {language === "ar" ? "مكافآت المحققين: 90% بعد العمولة" : "Validator Rewards: 90% after commission"}
            </li>
            <li>
              ✓ {language === "ar" ? "عمولات الإحالة: 5% مكافأة إضافية" : "Referral Commissions: 5% platform bonus"}
            </li>
            <li>✓ {language === "ar" ? "مكافآت الثغرات: 10 باي + 50 سمعة" : "Bug Bounties: 10 Pi + 50 reputation"}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
