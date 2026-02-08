"use client"

import { Mic, SendHorizontal, Upload } from "lucide-react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface RuixenQueryBoxProps {
  placeholder?: string
  onSend?: (message: string) => void
  onFileUpload?: (files: FileList) => void
  className?: string
  disabled?: boolean
}

export default function RuixenQueryBox({
  placeholder = "Posez votre question...",
  onSend,
  onFileUpload,
  className,
  disabled = false,
}: RuixenQueryBoxProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 220,
  })

  const [inputValue, setInputValue] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSend?.(inputValue.trim())
    setInputValue("")
    adjustHeight(true)
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return
    onFileUpload?.(files)
  }

  return (
    <div className={cn("w-full px-4 py-3", className)}>
      <div
        className={cn(
          "relative max-w-2xl mx-auto rounded-2xl border border-border shadow-sm overflow-hidden",
          "bg-card"
        )}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Textarea
          id="ai-textarea"
          ref={textareaRef}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full resize-none border-none bg-transparent",
            "text-base text-white placeholder:text-gray-300",
            "px-5 py-4 pr-24 rounded-2xl leading-[1.4]",
            "transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
          )}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            adjustHeight()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Micro"
          >
            <Mic className="h-4 w-4" />
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Téléverser un fichier"
              >
                <Upload className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4" align="end">
              <p className="text-sm mb-2 font-medium text-foreground">Téléverser des fichiers :</p>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                Choisir des fichiers
              </Button>
            </PopoverContent>
          </Popover>

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled}
            className={cn(
              "p-2 rounded-full transition-colors",
              inputValue.trim() && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            )}
            aria-label="Envoyer"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
