"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  CalendarDays,
  Wallet,
  CreditCard,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "prospects", label: "Prospects", icon: Users },
  { id: "calendar", label: "Calendrier", icon: CalendarDays },
  { id: "finances", label: "Finances", icon: Wallet },
  { id: "subscriptions", label: "Abonnements", icon: CreditCard },
]

interface EliteSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  collapsed: boolean
  onToggle: () => void
}

export function EliteSidebar({ activeSection, onNavigate, collapsed, onToggle }: EliteSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card shadow-sm transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo area */}
      <div className="flex h-[72px] items-center border-b border-border px-5">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <img
              src="/images/elite-logo.png"
              alt="ELITE Logo"
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-xl font-bold tracking-wider text-foreground">
              ELITE
            </span>
          </div>
        ) : (
          <img
            src="/images/elite-logo.png"
            alt="ELITE Logo"
            className="mx-auto h-9 w-9 object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* AI Assistant link */}
      <div className="border-t border-border px-3 py-3">
        <button
          onClick={() => onNavigate("ai")}
          className={cn(
            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            activeSection === "ai"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          title={collapsed ? "Assistant IA" : undefined}
        >
          <Bot className={cn(
            "h-[18px] w-[18px] shrink-0",
            activeSection === "ai" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )} />
          {!collapsed && <span>Assistant IA</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-xl py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label={collapsed ? "Agrandir la barre" : "Reduire la barre"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}
