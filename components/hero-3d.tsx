"use client"

import { format } from "date-fns"
import { currentUser } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import { Progress } from "@/components/ui/progress"

export function Hero3D() {
  const { currentSavings, expenses, incomes } = useAppStore()
  const now = new Date()
  const currentMonth = format(now, "yyyy-MM")

  const monthlyIncome = incomes
    .filter((i) => i.date.startsWith(currentMonth))
    .reduce((sum, i) => sum + i.amount, 0)
  const monthlyExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0)
  const monthlyNet = monthlyIncome - monthlyExpenses

  const hurracanProgress = Math.min(100, (currentSavings / currentUser.savingsGoal) * 100)
  const monthlyProgress = Math.max(0, (monthlyNet / currentUser.monthlyGoal) * 100)

  return (
    <div
      className="relative z-0 h-[260px] w-full overflow-hidden rounded-xl border-led-glow sm:h-[280px] md:h-[320px] lg:h-[340px]"
      style={{
        background: "linear-gradient(135deg, hsl(200, 70%, 22%) 0%, hsl(210, 75%, 28%) 25%, hsl(215, 70%, 32%) 50%, hsl(230, 65%, 28%) 75%, hsl(250, 60%, 22%) 100%)",
        boxShadow: "inset 0 0 80px rgba(0,0,0,0.2), 0 0 40px rgba(59, 130, 246, 0.2), 0 0 60px rgba(100, 200, 255, 0.1)",
      }}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <img
          src="/images/elite-logo.png"
          alt="ELITE Logo"
          className="mb-2 h-12 w-12 drop-shadow-xl sm:mb-3 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
          style={{ objectFit: "contain" }}
        />
        <h1 className="font-display text-lg font-bold tracking-tight text-white drop-shadow-lg sm:text-xl md:text-2xl lg:text-3xl">
          Salut boss, voici ton tableau de bord
        </h1>
        <p className="mt-1 text-xs text-white/90 drop-shadow-md sm:text-sm">
          Ton centre de commande business
        </p>
        <div className="mt-3 flex w-full max-w-xs flex-col gap-2 sm:mt-4 sm:max-w-sm">
          <div className="rounded-lg bg-black/20 px-3 py-2 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">{currentUser.goalName}</span>
              <span className="text-xs font-bold text-white">
                {currentSavings.toLocaleString("fr-FR")} € / {(currentUser.savingsGoal / 1000).toFixed(0)}k
              </span>
            </div>
            <Progress value={hurracanProgress} className="mt-1 h-1.5 bg-white/20 [&>*]:bg-white" />
          </div>
          <div className="rounded-lg bg-primary/30 px-3 py-2 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white">{currentUser.monthlyGoal} € ce mois</span>
              <span className="text-xs font-bold text-white">
                {monthlyNet >= 0 ? "+" : ""}
                {monthlyNet.toLocaleString("fr-FR")} €
              </span>
            </div>
            <Progress value={Math.min(100, monthlyProgress)} className="mt-1 h-1.5 bg-white/20 [&>*]:bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
