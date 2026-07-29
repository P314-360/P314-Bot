"use client"

import { useState, useRef, useEffect } from "react"
import type { VoiceSettings } from "@/lib/types"

export const useVoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    voice: "lia",
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const savedSettings = localStorage.getItem("p314_voice_settings")
    if (savedSettings) {
      setVoiceSettings(JSON.parse(savedSettings))
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("[P314] Failed to start recording:", error)
      alert("Failed to access microphone. Please check your permissions.")
    }
  }

  const stopRecording = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        resolve(null)
        return
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        const reader = new FileReader()
        reader.onloadend = () => {
          const base64Audio = reader.result as string
          resolve(base64Audio)
        }
        reader.readAsDataURL(audioBlob)

        setIsRecording(false)
      }

      mediaRecorderRef.current.stop()
    })
  }

  const playAudio = async (audioBase64: string) => {
    try {
      setIsPlaying(true)
      const audio = new Audio(audioBase64)
      audio.onended = () => setIsPlaying(false)
      await audio.play()
    } catch (error) {
      console.error("[P314] Failed to play audio:", error)
      setIsPlaying(false)
    }
  }

  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    const newSettings = { ...voiceSettings, ...settings }
    setVoiceSettings(newSettings)
    localStorage.setItem("p314_voice_settings", JSON.stringify(newSettings))
  }

  return {
    isRecording,
    isPlaying,
    voiceSettings,
    startRecording,
    stopRecording,
    playAudio,
    updateVoiceSettings,
  }
}
