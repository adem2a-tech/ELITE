"use client"

import dynamic from "next/dynamic"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import {
  Users,
  Bell,
  Receipt,
  CreditCard,
  Globe,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"
import { mockProspects, mockReminders, mockSubscriptions } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"

import { Hero3D } from "@/components/hero-3d"

interface HomeDashboardProps {
  onNavigate: (section: string) => void
}

export function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  const { expenses } = useAppStore()
  const todayReminders = mockReminders.filter((r) => !r.done)
  const hotProspects = mockProspects.filter((p) => p.status === "hot")
  const currentMonth = new Date().toISOString().slice(0, 7)
  const todayExpenses = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0)
  const totalSubs = mockSubscriptions.reduce((sum, s) => sum + s.amount, 0)

  const quickActions = [
    { label: "Ajouter prospect", icon: Users, section: "prospects", color: "bg-blue-500/30 text-blue-200" },
    { label: "Ajouter rappel", icon: Bell, section: "calendar", color: "bg-amber-500/30 text-amber-200" },
    { label: "Ajouter depense", icon: Receipt, section: "finances", color: "bg-emerald-500/30 text-emerald-200" },
    { label: "Abonnement", icon: CreditCard, section: "subscriptions", color: "bg-rose-500/30 text-rose-200" },
    { label: "Domaine", icon: Globe, section: "subscriptions", color: "bg-cyan-500/30 text-cyan-200" },
  ]

  const stats = [
    {
      label: "Prospects chauds",
      value: hotProspects.length,
      sub: `sur ${mockProspects.length} au total`,
      icon: Users,
      iconBg: "bg-blue-500/30",
      iconColor: "text-blue-200",
    },
    {
      label: "Rappels actifs",
      value: todayReminders.length,
      sub: "en attente",
      icon: Clock,
      iconBg: "bg-amber-500/30",
      iconColor: "text-amber-200",
    },
    {
      label: "Depenses du mois",
      value: `${todayExpenses} EUR`,
      sub: "ce mois-ci",
      icon: DollarSign,
      iconBg: "bg-emerald-500/30",
      iconColor: "text-emerald-200",
    },
    {
      label: "Abonnements",
      value: `${totalSubs} EUR/mois`,
      sub: `${mockSubscriptions.length} actifs`,
      icon: CreditCard,
      iconBg: "bg-rose-500/30",
      iconColor: "text-rose-200",
    },
  ]

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* 3D Hero */}
      <div className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]">
        <Hero3D />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <button
              key={action.section}
              onClick={() => onNavigate(action.section)}
              className="group flex flex-col items-center gap-2 rounded-xl glass-card border-led p-3 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-led-glow hover:shadow-[0_0_24px_rgba(100,200,255,0.2)] sm:gap-3 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-2"
              style={{
                animationDelay: `${(i + 1) * 80}ms`,
                animation: "entrance-3d 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                opacity: 0,
              }}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:h-11 sm:w-11 sm:rounded-xl ${action.color}`}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-[10px] font-medium text-white sm:text-xs">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card3D
              key={stat.label}
              tiltMax={8}
              className="border-led hover:border-led-glow"
              style={{
                animationDelay: `${(i + 1) * 60}ms`,
                animation: "entrance-3d 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                opacity: 0,
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">{stat.label}</CardTitle>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 hover:scale-110 ${stat.iconBg}`}>
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white sm:text-2xl">{stat.value}</div>
                <p className="text-xs text-white/75">{stat.sub}</p>
              </CardContent>
            </Card3D>
          )
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Reminders */}
        <Card3D className="border-led" tiltMax={6}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/30">
                <AlertCircle className="h-4 w-4 text-amber-200" />
              </div>
              Rappels a venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {todayReminders.length === 0 && (
                <p className="py-6 text-center text-sm text-white/70">Aucun rappel a venir</p>
              )}
              {todayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 transition-all duration-300 hover:border-led-glow hover:-translate-x-1"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{reminder.title}</p>
                    <p className="text-xs text-white/75">{reminder.description}</p>
                  </div>
                  <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{reminder.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card3D>

        {/* Hot Prospects */}
        <Card3D className="border-led" tiltMax={6}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/30">
                <TrendingUp className="h-4 w-4 text-blue-200" />
              </div>
              Prospects chauds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {hotProspects.length === 0 && (
                <p className="py-6 text-center text-sm text-white/70">Aucun prospect chaud</p>
              )}
              {hotProspects.map((prospect) => (
                <div
                  key={prospect.id}
                  className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 transition-all duration-300 hover:border-led-glow hover:-translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {prospect.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{prospect.name}</p>
                      <p className="text-xs text-white/75">{prospect.source}</p>
                    </div>
                  </div>
                  <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                    Chaud
                  </span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-1 border-white/40 bg-transparent text-white/90 hover:bg-white/20 hover:text-white"
                onClick={() => onNavigate("prospects")}
              >
                Voir tous les prospects
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card3D>
      </div>
    </div>
  )
}
