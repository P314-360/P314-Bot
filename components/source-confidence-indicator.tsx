"use client"

import type React from "react"
import type { SourceConfidenceData } from "@/lib/types"
import { useLanguage } from "@/hooks/use-language"
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface SourceConfidenceIndicatorProps {
  data: SourceConfidenceData
}

export const SourceConfidenceIndicator: React.FC<SourceConfidenceIndicatorProps> = ({ data }) => {
  const { t } = useLanguage()

  const getIndicatorStyle = (score: number) => {
    if (score === 0) {
      return {
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
        textColor: "text-red-900",
        barColor: "bg-red-500",
        icon: <XCircle size={16} className="text-red-600" />,
      }
    }
    if (score < 50) {
      return {
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
        textColor: "text-orange-900",
        barColor: "bg-orange-500",
        icon: <AlertTriangle size={16} className="text-orange-600" />,
      }
    }
    return {
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-900",
      barColor: "bg-green-500",
      icon: <CheckCircle size={16} className="text-green-600" />,
    }
  }

  const style = getIndicatorStyle(data.score)

  const getConfidenceLabel = (score: number) => {
    if (score === 0) return t.noOfficialSource || "Not Officially Verified"
    if (score < 30) return t.veryLowConfidence || "Very Low Confidence"
    if (score < 50) return t.lowConfidence || "Low Confidence"
    if (score < 70) return t.mediumConfidence || "Medium Confidence"
    if (score < 90) return t.highConfidence || "High Confidence"
    return t.officiallyVerified || "Officially Verified"
  }

  return (
    <div className={`mt-3 p-4 rounded-lg border-2 ${style.bgColor} ${style.borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <Shield size={18} className="text-blue-600" />
        <span className="text-sm font-bold text-blue-900">
          {t.officialSourceConfidence || "Official Source Confidence Score"}
        </span>
      </div>

      {/* Confidence score display */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {style.icon}
            <span className={`text-sm font-semibold ${style.textColor}`}>{getConfidenceLabel(data.score)}</span>
          </div>
          <span className={`text-2xl font-bold ${style.textColor}`}>{data.score}%</span>
        </div>

        {/* Progress bar */}
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-700 ${style.barColor}`} style={{ width: `${data.score}%` }} />
        </div>
      </div>

      {data.confidence_score_justification && (
        <div className="mb-3 p-2 bg-white bg-opacity-60 rounded border border-gray-300">
          <div className="text-xs font-semibold text-gray-800 mb-1">{t.analysis || "Analysis"}:</div>
          <div className="text-xs text-gray-700 italic">{data.confidence_score_justification}</div>
        </div>
      )}

      {/* Explanation */}
      <div className="text-xs text-gray-700 leading-relaxed mb-2">{data.explanation}</div>

      {/* Rumor warning */}
      {data.isRumor && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
          <AlertTriangle size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-red-800">
            <span className="font-bold">{t.rumorWarning || "Rumor Alert"}:</span>{" "}
            {t.rumorWarningText ||
              "This topic is commonly associated with unverified rumors. Always verify information from official Pi Network sources."}
          </div>
        </div>
      )}

      {/* Official statement if available */}
      {data.officialStatement && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-semibold text-blue-900 mb-1">{t.officialStatement || "Official Statement"}:</div>
          <div className="text-xs text-blue-800 italic">{data.officialStatement}</div>
        </div>
      )}

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-300">
          <div className="text-[10px] text-gray-600 font-semibold mb-1">{t.sources || "Sources"}:</div>
          <ul className="text-[10px] text-gray-600 list-disc list-inside space-y-0.5">
            {data.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
