"use client"

import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  CalendarDays,
  Wallet,
  CreditCard,
  LogOut,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "prospects", label: "Prospects", icon: Users },
  { id: "calendar", label: "Calendrier", icon: CalendarDays },
  { id: "finances", label: "Finances", icon: Wallet },
  { id: "subscriptions", label: "Abonnements", icon: CreditCard },
]

interface TopTabsProps {
  activeSection: string
  onNavigate: (section: string) => void
  onLogout: () => void
}

export function TopTabs({ activeSection, onNavigate, onLogout }: TopTabsProps) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-led bg-[rgba(35,70,130,0.75)] px-3 shadow-lg backdrop-blur-xl sm:h-16 sm:gap-4 sm:px-6"
    >
      <div className="flex shrink-0 items-center gap-2 transition-transform duration-300 hover:scale-105 hover:-translate-y-0.5 sm:gap-3">
        <img
          src="/images/elite-logo.png"
          alt="ELITE Logo"
          className="h-6 w-6 object-contain drop-shadow-md sm:h-8 sm:w-8"
        />
        <span className="font-display text-base font-bold tracking-wider text-white sm:text-lg">
          ELITE
        </span>
      </div>

      <nav className="flex flex-1 items-center justify-center overflow-x-auto scrollbar-hide">
        <ul className="flex items-center gap-0.5 sm:gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <li key={item.id} className="transition-transform duration-300 hover:scale-105">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "group flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-300 ease-out sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm",
                    "transform-gpu hover:-translate-y-0.5 active:scale-95",
                    isActive
                      ? "bg-primary text-white shadow-lg scale-[1.02]"
                      : "text-white/85 hover:bg-white/20 hover:text-white hover:shadow-md"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-12",
                      isActive ? "text-white" : "text-white/80 group-hover:text-white"
                    )}
                  />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 text-white/90 transition-all hover:bg-white/15 hover:text-white sm:gap-2.5 sm:rounded-xl sm:px-3 sm:py-2"
            aria-label="Ouvrir le profil"
          >
            <Avatar className="h-8 w-8 border-2 border-white/30 sm:h-9 sm:w-9">
              <AvatarFallback className="bg-primary/60 text-sm font-bold text-white">
                A
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold leading-tight">Adem</p>
              <p className="text-[10px] text-white/70 leading-tight">Créateur de ELITE</p>
            </div>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass-card border-led text-white">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold">Adem</p>
              <p className="text-xs font-normal text-white/70">Créateur de ELITE</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-white focus:bg-white/15 focus:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
