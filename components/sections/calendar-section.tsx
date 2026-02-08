"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { GlassCalendar } from "@/components/ui/glass-calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Plus, Check, Clock, Trash2 } from "lucide-react"
import type { Reminder } from "@/lib/store"
import { mockReminders } from "@/lib/store"

export function CalendarSection() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: "", // sujet
    description: "",
    withWho: "", // appel avec qui
    date: "",
    time: "09:00",
    duration: "30", // durée en minutes
  })

  function openReminderDialog(date?: Date) {
    if (date) {
      setNewReminder((p) => ({ ...p, date: format(date, "yyyy-MM-dd") }))
    } else {
      setNewReminder((p) => ({ ...p, date: format(selectedDate ?? new Date(), "yyyy-MM-dd") }))
    }
    setDialogOpen(true)
  }

  function handleAdd() {
    if (!newReminder.title || !newReminder.date) return
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      date: newReminder.date,
      time: newReminder.time,
      done: false,
      withWho: newReminder.withWho || undefined,
      duration: newReminder.duration ? Number.parseInt(newReminder.duration, 10) : undefined,
    }
    setReminders((prev) => [reminder, ...prev])
    setNewReminder({ title: "", description: "", withWho: "", date: "", time: "09:00", duration: "30" })
    setDialogOpen(false)
  }

  function toggleDone(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    )
  }

  function handleRemove(id: string) {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const active = reminders.filter((r) => !r.done)
  const completed = reminders.filter((r) => r.done)
  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
  const remindersForSelectedDate = active.filter((r) => r.date === selectedDateStr)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Calendrier & Rappels</h2>
          <p className="text-sm text-white/80">Planifiez votre business</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Planifier un appel
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dialog border-led text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">Planifier un appel</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>Sujet / Objet</Label>
                <Input
                  placeholder="Ex: Suivi commercial, Demo produit..."
                  value={newReminder.title}
                  onChange={(e) => setNewReminder((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Appel avec qui</Label>
                <Input
                  placeholder="Nom de la personne ou entreprise"
                  value={newReminder.withWho}
                  onChange={(e) => setNewReminder((p) => ({ ...p, withWho: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Heure</Label>
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder((p) => ({ ...p, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Duree (minutes)</Label>
                <Input
                  type="number"
                  min={5}
                  max={480}
                  placeholder="30"
                  value={newReminder.duration}
                  onChange={(e) => setNewReminder((p) => ({ ...p, duration: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Notes (optionnel)</Label>
                <Textarea
                  placeholder="Details supplementaires..."
                  value={newReminder.description}
                  onChange={(e) => setNewReminder((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Creer l{"'"}appel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr] lg:gap-6">
        {/* Calendar widget - Glass style */}
        <div
          className="min-h-[320px] overflow-hidden rounded-2xl bg-cover bg-center sm:min-h-[360px] lg:min-h-[400px] lg:rounded-3xl"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1557683316-973673baf926?w=600&auto=format&fit=crop&q=80)",
          }}
        >
          <div className="flex min-h-[320px] items-center justify-center p-4 sm:min-h-[360px] sm:p-6 lg:min-h-[400px]">
            <GlassCalendar
              selectedDate={selectedDate}
              onDateSelect={(date) => setSelectedDate(date)}
              onNewEvent={() => openReminderDialog(selectedDate ?? new Date())}
              onAddNote={() => openReminderDialog(selectedDate ?? new Date())}
              events={reminders.filter((r) => !r.done).map((r) => ({ date: r.date }))}
              className="transform transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* J'ai quoi ce jour-là - liste filtrée par date sélectionnée */}
        <div className="flex flex-col gap-4">
          <Card3D className="border-led" tiltMax={6}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                J{"'"}ai quoi
                {selectedDateStr && (
                  <span className="font-normal text-muted-foreground">
                    &nbsp;le {format(selectedDate!, "d MMMM yyyy", { locale: fr })}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {remindersForSelectedDate.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {selectedDateStr ? "Rien de prevu ce jour-la" : "Cliquez sur une date pour voir vos appels"}
                </p>
              )}
              {remindersForSelectedDate.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 transition-all duration-300 hover:border-led-glow hover:-translate-x-1"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => toggleDone(r.id)}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-muted-foreground/30 transition-colors hover:border-primary hover:bg-primary/5"
                      aria-label="Marquer comme fait"
                    >
                      <span className="sr-only">Fait</span>
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.withWho && <span> avec {r.withWho}</span>}
                        {r.duration && <span> &middot; {r.duration} min</span>}
                        {r.description && !r.withWho && !r.duration && r.description}
                        {r.description && (r.withWho || r.duration) && ` &middot; ${r.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary">{r.date}</p>
                      <p className="text-xs text-muted-foreground">{r.time}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(r.id)}
                      className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card3D>

          {completed.length > 0 && (
            <Card3D className="border-led" tiltMax={6}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  Termines ({completed.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {completed.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDone(r.id)}
                        className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-emerald-400 bg-emerald-50"
                        aria-label="Reactiver"
                      >
                        <Check className="h-3 w-3 text-emerald-600" />
                      </button>
                      <p className="text-sm text-muted-foreground line-through">{r.title}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card3D>
          )}
        </div>
      </div>
    </div>
  )
}
