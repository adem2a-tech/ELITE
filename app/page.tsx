"use client"

import { useState, useEffect } from "react"
import { AppStoreProvider } from "@/lib/app-store"
import { WelcomeScreen } from "@/components/welcome-screen"
import { TopTabs } from "@/components/top-tabs"
import { HomeDashboard } from "@/components/sections/home-dashboard"
import { ProspectsSection } from "@/components/sections/prospects-section"
import { CalendarSection } from "@/components/sections/calendar-section"
import { FinancesSection } from "@/components/sections/finances-section"
import { SubscriptionsSection } from "@/components/sections/subscriptions-section"
import { AIAssistant } from "@/components/ai-assistant"

const STORAGE_KEY = "elite-connected"

export default function Page() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    setIsConnected(typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true")
  }, [])

  function handleConnect() {
    setIsConnected(true)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true")
    }
  }

  function handleLogout() {
    setIsConnected(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (isConnected === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/50 border-t-white" />
      </div>
    )
  }

  if (!isConnected) {
    return <WelcomeScreen onConnect={handleConnect} />
  }

  return (
    <AppStoreProvider>
    <div className="flex min-h-screen flex-col">
      <TopTabs activeSection={activeSection} onNavigate={setActiveSection} onLogout={handleLogout} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {activeSection === "home" && (
            <div
              key="home"
              className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]"
            >
              <HomeDashboard onNavigate={setActiveSection} />
            </div>
          )}
          {activeSection === "prospects" && (
            <div
              key="prospects"
              className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]"
            >
              <ProspectsSection />
            </div>
          )}
          {activeSection === "calendar" && (
            <div
              key="calendar"
              className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]"
            >
              <CalendarSection />
            </div>
          )}
          {activeSection === "finances" && (
            <div
              key="finances"
              className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]"
            >
              <FinancesSection />
            </div>
          )}
          {activeSection === "subscriptions" && (
            <div
              key="subscriptions"
              className="animate-entrance-3d opacity-0 [animation-fill-mode:forwards]"
            >
              <SubscriptionsSection />
            </div>
          )}
        </div>
      </main>

      <AIAssistant />
    </div>
    </AppStoreProvider>
  )
}
