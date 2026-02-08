"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Flame, Snowflake, Clock, Search, Trash2 } from "lucide-react"
import type { Prospect } from "@/lib/store"
import { mockProspects } from "@/lib/store"

const statusConfig = {
  hot: { label: "Chaud", icon: Flame, bg: "bg-orange-50", text: "text-orange-600" },
  cold: { label: "Froid", icon: Snowflake, bg: "bg-blue-50", text: "text-blue-600" },
  "in-progress": { label: "En cours", icon: Clock, bg: "bg-primary/10", text: "text-primary" },
}

export function ProspectsSection() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects)
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newProspect, setNewProspect] = useState({
    name: "",
    source: "",
    phone: "",
    status: "hot" as Prospect["status"],
  })

  const filtered = prospects
    .filter((p) => filter === "all" || p.status === filter)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.source.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone && p.phone.includes(search))
    )

  const hotCount = prospects.filter((p) => p.status === "hot").length
  const coldCount = prospects.filter((p) => p.status === "cold").length
  const progressCount = prospects.filter((p) => p.status === "in-progress").length

  function handleAdd() {
    if (!newProspect.name) return
    const prospect: Prospect = {
      id: Date.now().toString(),
      name: newProspect.name,
      date: new Date().toISOString().split("T")[0],
      status: newProspect.status,
      source: newProspect.source || "Direct",
      phone: newProspect.phone || undefined,
    }
    setProspects((prev) => [prospect, ...prev])
    setNewProspect({ name: "", source: "", phone: "", status: "hot" })
    setDialogOpen(false)
  }

  function handleRemove(id: string) {
    setProspects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Prospects</h2>
        <p className="text-sm text-white/80">Gerez vos contacts business</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dialog border-led text-foreground">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">Nouveau prospect</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Nom</Label>
                <Input
                  placeholder="Nom complet"
                  value={newProspect.name}
                  onChange={(e) => setNewProspect((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Source</Label>
                <Input
                  placeholder="Instagram, LinkedIn, etc."
                  value={newProspect.source}
                  onChange={(e) => setNewProspect((p) => ({ ...p, source: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Telephone</Label>
                <Input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={newProspect.phone}
                  onChange={(e) => setNewProspect((p) => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Statut</Label>
                <Select
                  value={newProspect.status}
                  onValueChange={(v) => setNewProspect((p) => ({ ...p, status: v as Prospect["status"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Chaud</SelectItem>
                    <SelectItem value="cold">Froid</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Ajouter le prospect
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{hotCount}</p>
              <p className="text-xs text-muted-foreground">Chauds</p>
            </div>
          </CardContent>
        </Card3D>
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{progressCount}</p>
              <p className="text-xs text-muted-foreground">En cours</p>
            </div>
          </CardContent>
        </Card3D>
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <Snowflake className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{coldCount}</p>
              <p className="text-xs text-muted-foreground">Froids</p>
            </div>
          </CardContent>
        </Card3D>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: "Tous" },
            { id: "hot", label: "Chauds" },
            { id: "in-progress", label: "En cours" },
            { id: "cold", label: "Froids" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                filter === f.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {filtered.map((prospect) => {
          const config = statusConfig[prospect.status]
          const StatusIcon = config.icon
          return (
            <Card3D key={prospect.id} tiltMax={4} className="border-led transition-all hover:-translate-y-1 hover:border-led-glow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {prospect.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{prospect.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {prospect.phone && <span>{prospect.phone} &middot; </span>}
                      {prospect.source} &middot; {prospect.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                  <button
                    onClick={() => handleRemove(prospect.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Supprimer ${prospect.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card3D>
          )
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm text-muted-foreground">Aucun prospect trouve</p>
          </div>
        )}
      </div>
    </div>
  )
}
