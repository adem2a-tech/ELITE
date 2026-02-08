"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

const EXPECTED_PASSWORD = "banizette"

interface Button3DProps {
  className?: string
  onConnect?: () => void
}

export function Button3D({ className, onConnect }: Button3DProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleButtonClick() {
    setShowDialog(true)
    setPassword("")
    setError("")
  }

  function handleConnect() {
    if (password === EXPECTED_PASSWORD) {
      setShowDialog(false)
      setPassword("")
      setError("")
      onConnect?.()
    } else {
      setError("Mot de passe incorrect")
    }
  }

  const label = "Reconnecte-toi"

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-center gap-4 p-4 transition-transform duration-300 hover:scale-105",
          className
        )}
        style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      >
        <button
          type="button"
          onClick={handleButtonClick}
          className={cn(
            "button-3d-tilt relative overflow-hidden cursor-pointer rounded-full border-0 outline-none",
            "w-full max-w-sm min-h-[64px] px-10 py-4",
            "flex items-center justify-center gap-3",
            "transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          )}
          style={{
            transform: "rotateX(8deg) rotateY(-5deg) rotateZ(2deg)",
            boxShadow:
              "0 25px 50px -12px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)",
          }}
          aria-label="Se reconnecter"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(180deg, #e9d5ff 0%, #a78bfa 40%, #7c3aed 100%)",
              boxShadow: "inset 0 2px 20px rgba(255,255,255,0.3)",
            }}
          />
          <div className="relative z-10 flex items-center justify-center gap-3 text-white">
            <span className="text-xl font-bold tracking-wide drop-shadow-sm">{label}</span>
            <LogIn className="h-5 w-5 shrink-0" />
          </div>
        </button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="border-border bg-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">Reconnecte-toi</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                className={error ? "border-destructive" : ""}
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <Button onClick={handleConnect} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Se connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
