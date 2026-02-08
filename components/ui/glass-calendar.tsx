"use client"

import * as React from "react"
import { Settings, Plus, Edit2, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, isSameDay, isToday, getDate, getDaysInMonth, startOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Day {
  date: Date
  isToday: boolean
  isSelected: boolean
  eventCount: number
}

interface CalendarEvent {
  date: string // yyyy-MM-dd
}

interface GlassCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onNewEvent?: () => void
  onAddNote?: () => void
  events?: CalendarEvent[]
  className?: string
}

const ScrollbarHide = () => (
  <style>{`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
)

export const GlassCalendar = React.forwardRef<HTMLDivElement, GlassCalendarProps>(
  (
    {
      className,
      selectedDate: propSelectedDate,
      onDateSelect,
      onNewEvent,
      onAddNote,
      events = [],
      ...props
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(propSelectedDate || new Date())
    const [selectedDate, setSelectedDate] = React.useState(propSelectedDate || new Date())
    const [viewMode, setViewMode] = React.useState<"weekly" | "monthly">("weekly")

    React.useEffect(() => {
      if (propSelectedDate) {
        setSelectedDate(propSelectedDate)
        setCurrentMonth(propSelectedDate)
      }
    }, [propSelectedDate])

    const eventCountByDate = React.useMemo(() => {
      const map = new Map<string, number>()
      events.forEach((e) => {
        map.set(e.date, (map.get(e.date) ?? 0) + 1)
      })
      return map
    }, [events])

    const monthDays = React.useMemo(() => {
      const start = startOfMonth(currentMonth)
      const totalDays = getDaysInMonth(currentMonth)
      const days: Day[] = []
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(start.getFullYear(), start.getMonth(), i + 1)
        const dateStr = format(date, "yyyy-MM-dd")
        days.push({
          date,
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
          eventCount: eventCountByDate.get(dateStr) ?? 0,
        })
      }
      return days
    }, [currentMonth, selectedDate, eventCountByDate])

    const handleDateClick = (date: Date) => {
      setSelectedDate(date)
      onDateSelect?.(date)
    }

    const handlePrevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1))
    }

    const handleNextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1))
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-[320px] rounded-2xl p-4 shadow-2xl overflow-hidden sm:max-w-[360px] sm:rounded-3xl sm:p-5",
          "bg-black/20 backdrop-blur-xl border border-white/10",
          "text-white font-sans",
          className
        )}
        {...props}
      >
        <ScrollbarHide />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 rounded-lg bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setViewMode("weekly")}
              className={cn(
                "rounded-md px-4 py-1 text-xs font-semibold transition-colors",
                viewMode === "weekly"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Hebdo
            </button>
            <button
              type="button"
              onClick={() => setViewMode("monthly")}
              className={cn(
                "rounded-md px-4 py-1 text-xs font-semibold transition-colors",
                viewMode === "monthly"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              )}
            >
              Mensuel
            </button>
          </div>
          <button
            type="button"
            className="p-2 text-white/70 transition-colors hover:bg-black/20 rounded-full"
            aria-label="Paramètres"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="my-6 flex items-center justify-between">
          <motion.p
            key={format(currentMonth, "MMMM")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold tracking-tight capitalize"
          >
            {format(currentMonth, "MMMM", { locale: fr })}
          </motion.p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-full text-white/70 transition-colors hover:bg-black/20"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-full text-white/70 transition-colors hover:bg-black/20"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
          <div className="flex space-x-4">
            {monthDays.map((day) => (
              <div
                key={format(day.date, "yyyy-MM-dd")}
                className="flex flex-col items-center space-y-2 flex-shrink-0"
              >
                <span className="text-xs font-bold text-white/50">
                  {format(day.date, "EEE", { locale: fr }).charAt(0)}
                </span>
                <button
                  type="button"
                  onClick={() => handleDateClick(day.date)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 relative",
                    {
                      "bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg":
                        day.isSelected,
                      "hover:bg-white/20": !day.isSelected,
                      "text-white": !day.isSelected,
                    }
                  )}
                >
                  {day.isToday && !day.isSelected && day.eventCount === 0 && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-pink-400" />
                  )}
                  {day.eventCount > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                        day.isSelected
                          ? "bg-white text-orange-500"
                          : "bg-red-500 text-white shadow-md"
                      )}
                    >
                      {day.eventCount > 9 ? "9+" : day.eventCount}
                    </span>
                  )}
                  {getDate(day.date)}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 h-px bg-white/20" />

        <div className="mt-4 flex items-center justify-between space-x-4">
          <button
            type="button"
            onClick={onAddNote}
            className="flex items-center space-x-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
            <span>Ajouter une note...</span>
          </button>
          <button
            type="button"
            onClick={onNewEvent}
            className="flex items-center space-x-2 rounded-lg bg-black/20 px-3 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-black/30"
          >
            <Plus className="h-4 w-4" />
            <span>Planifier un appel</span>
          </button>
        </div>
      </div>
    )
  }
)

GlassCalendar.displayName = "GlassCalendar"
