"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { useVoiceChat } from "@/hooks/use-voice-chat"
import { useLanguage } from "@/hooks/use-language"

interface VoiceChatControlsProps {
  onVoiceMessage: (audioData: string) => void
  isLoading: boolean
  primaryColor: string
}

export function VoiceChatControls({ onVoiceMessage, isLoading, primaryColor }: VoiceChatControlsProps) {
  const { isRecording, isPlaying, voiceSettings, startRecording, stopRecording, updateVoiceSettings } = useVoiceChat()
  const { t, isRTL } = useLanguage()

  const handleRecordToggle = async () => {
    if (isRecording) {
      const audioData = await stopRecording()
      if (audioData) {
        onVoiceMessage(audioData)
      }
    } else {
      await startRecording()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <Button
          onClick={handleRecordToggle}
          disabled={isLoading || isPlaying}
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          className="h-10 w-10"
          style={!isRecording ? { borderColor: primaryColor, color: primaryColor } : {}}
        >
          {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
        </Button>

        {!isRecording && (
          <div
            className={`absolute bottom-12 ${isRTL ? "right-0" : "left-0"} bg-white border rounded-lg shadow-lg p-3 min-w-[160px] hidden group-hover:block z-20`}
          >
            <div className="text-xs font-semibold mb-2">{t.voiceSettings}</div>
            <div className="space-y-2">
              <button
                onClick={() => updateVoiceSettings({ voice: "lia" })}
                className={`w-full text-left text-xs p-2 rounded ${
                  voiceSettings.voice === "lia" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <Volume2 size={14} className="inline mr-1" />
                Lia ({t.femaleVoice})
              </button>
              <button
                onClick={() => updateVoiceSettings({ voice: "jaki" })}
                className={`w-full text-left text-xs p-2 rounded ${
                  voiceSettings.voice === "jaki" ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <Volume2 size={14} className="inline mr-1" />
                Jaki ({t.maleVoice})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
