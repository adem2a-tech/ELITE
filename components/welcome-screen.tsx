"use client"

import { Button3D } from "@/components/ui/3d-button"
import { currentUser } from "@/lib/store"

interface WelcomeScreenProps {
  onConnect: () => void
}

export function WelcomeScreen({ onConnect }: WelcomeScreenProps) {
  const progressPercent = Math.min(100, (currentUser.currentSavings / currentUser.savingsGoal) * 100)
  const remainingAmount = currentUser.savingsGoal - currentUser.currentSavings

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div
          className="w-full max-w-lg animate-entrance-3d opacity-0 [animation-fill-mode:forwards] rounded-2xl glass-card border-led p-8"
          style={{ animation: "entrance-3d 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        >
        <h1 className="font-display text-3xl font-bold text-white">
          Salut {currentUser.name}, tu es le meilleur !
        </h1>
        <p className="mt-3 text-white/85">
          Reconnecte-toi pour voir si tu as becé aujourd&apos;hui.
        </p>
        <div className="mt-6">
          <Button3D onConnect={onConnect} />
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">
              {currentUser.currentSavings.toLocaleString("fr-FR")} € /{" "}
              {currentUser.savingsGoal.toLocaleString("fr-FR")} €
            </span>
            <span className="text-white/70">
              Objectif : {currentUser.goalName} ({progressPercent.toFixed(1)} %)
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-white/75">
            Plus que{" "}
            <span className="font-semibold text-white">
              {remainingAmount.toLocaleString("fr-FR")} €
            </span>{" "}
            pour ta {currentUser.goalName} !
          </p>
        </div>
      </div>
    </div>
  )
}
