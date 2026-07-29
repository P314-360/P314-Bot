"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useRef } from "react"
import { useLanguage } from "@/hooks/use-language"

interface ImageUploadButtonProps {
  onImageSelected: (imageData: string, question: string) => void
  isLoading: boolean
  primaryColor: string
}

export function ImageUploadButton({ onImageSelected, isLoading, primaryColor }: ImageUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert(t.imageUploadError || "Please select a valid image file")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Image = reader.result as string
      const question = prompt(t.imageUploadPrompt || "Describe the issue you're facing:")
      if (question) {
        onImageSelected(base64Image, question)
      }
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        variant="outline"
        size="icon"
        className="h-10 w-10"
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        <ImageIcon size={20} />
      </Button>
    </>
  )
}
