"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Card3D } from "@/components/ui/card-3d"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import {
  Plus,
  CreditCard,
  Trash2,
  CalendarDays,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Box,
} from "lucide-react"
import type { Subscription, AppProject } from "@/lib/store"
import { mockSubscriptions, mockApps } from "@/lib/store"

const domainStatusConfig = {
  active: { label: "Actif", icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-600" },
  expired: { label: "Expire", icon: XCircle, bg: "bg-red-50", text: "text-red-500" },
  renewal: { label: "A renouveler", icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-600" },
}

export function SubscriptionsSection() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [apps, setApps] = useState<AppProject[]>(mockApps)
  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [domainDialogOpen, setDomainDialogOpen] = useState(false)
  const [appDialogOpen, setAppDialogOpen] = useState(false)

  const [newSub, setNewSub] = useState({ name: "", amount: "", billingDate: "", category: "" })
  const [newDomain, setNewDomain] = useState({ name: "", amount: "", expirationDate: "" })
  const [newApp, setNewApp] = useState({ name: "", objective: "", estimatedRevenue: "" })

  const subs = subscriptions.filter((s) => s.type === "subscription")
  const domains = subscriptions.filter((s) => s.type === "domain")

  const totalMonthlySubs = subs.reduce((sum, s) => sum + s.amount, 0)
  const totalYearlySubs = totalMonthlySubs * 12
  const totalDomains = domains.reduce((sum, d) => sum + d.amount, 0)
  const grandTotal = totalYearlySubs + totalDomains

  function handleAddSub() {
    if (!newSub.name || !newSub.amount) return
    const sub: Subscription = {
      id: Date.now().toString(),
      name: newSub.name,
      amount: Number.parseFloat(newSub.amount),
      billingDate: newSub.billingDate || "1",
      category: newSub.category || "Autre",
      type: "subscription",
    }
    setSubscriptions((prev) => [...prev, sub])
    setNewSub({ name: "", amount: "", billingDate: "", category: "" })
    setSubDialogOpen(false)
  }

  function handleAddDomain() {
    if (!newDomain.name) return
    const domain: Subscription = {
      id: `d-${Date.now()}`,
      name: newDomain.name,
      amount: Number.parseFloat(newDomain.amount) || 12,
      billingDate: newDomain.expirationDate
        ? new Date(newDomain.expirationDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
        : "01 Jan",
      category: "Domaine",
      type: "domain",
      expirationDate: newDomain.expirationDate || "2027-01-01",
      status: "active",
    }
    setSubscriptions((prev) => [...prev, domain])
    setNewDomain({ name: "", amount: "", expirationDate: "" })
    setDomainDialogOpen(false)
  }

  function handleAddApp() {
    if (!newApp.name) return
    const app: AppProject = {
      id: Date.now().toString(),
      name: newApp.name,
      objective: newApp.objective,
      estimatedRevenue: Number.parseFloat(newApp.estimatedRevenue) || 0,
    }
    setApps((prev) => [app, ...prev])
    setNewApp({ name: "", objective: "", estimatedRevenue: "" })
    setAppDialogOpen(false)
  }

  function handleRemove(id: string) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }

  const categoryColors: Record<string, string> = {
    Hosting: "bg-blue-50 text-blue-600",
    Design: "bg-rose-50 text-rose-600",
    AI: "bg-indigo-50 text-indigo-600",
    Productivity: "bg-amber-50 text-amber-600",
    Domaine: "bg-teal-50 text-teal-600",
    Autre: "bg-muted text-muted-foreground",
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Abonnements & Domaines</h2>
        <p className="text-sm text-white/80">Gerez tous vos abonnements et noms de domaine</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalMonthlySubs} EUR</p>
              <p className="text-xs text-muted-foreground">Abonnements / mois</p>
            </div>
          </CardContent>
        </Card3D>
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
              <Globe className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalDomains} EUR</p>
              <p className="text-xs text-muted-foreground">Domaines / an</p>
            </div>
          </CardContent>
        </Card3D>
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalYearlySubs} EUR</p>
              <p className="text-xs text-muted-foreground">Abonnements / an</p>
            </div>
          </CardContent>
        </Card3D>
        <Card3D className="border-led" tiltMax={6}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
              <CalendarDays className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{grandTotal} EUR</p>
              <p className="text-xs text-muted-foreground">Total annuel estime</p>
            </div>
          </CardContent>
        </Card3D>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions">
        <TabsList className="bg-secondary">
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Abonnements ({subs.length})
          </TabsTrigger>
          <TabsTrigger value="domains" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Domaines ({domains.length})
          </TabsTrigger>
          <TabsTrigger value="apps" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Mes Apps ({apps.length})
          </TabsTrigger>
        </TabsList>

        {/* Subscriptions tab */}
        <TabsContent value="subscriptions" className="mt-4 flex flex-col gap-4">
          <div className="flex justify-end">
            <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter abonnement
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dialog border-led text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Nouvel abonnement</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="Ex: Netflix, Figma..."
                      value={newSub.name}
                      onChange={(e) => setNewSub((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Montant mensuel (EUR)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={newSub.amount}
                      onChange={(e) => setNewSub((p) => ({ ...p, amount: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Jour de prelevement</Label>
                    <Input
                      type="number"
                      placeholder="1-31"
                      min={1}
                      max={31}
                      value={newSub.billingDate}
                      onChange={(e) => setNewSub((p) => ({ ...p, billingDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Categorie</Label>
                    <Select value={newSub.category} onValueChange={(v) => setNewSub((p) => ({ ...p, category: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hosting">Hosting</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddSub} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3">
            {subs.length === 0 && (
              <div className="rounded-2xl border border-dashed border-led glass py-12 text-center">
                <CreditCard className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucun abonnement pour le moment</p>
              </div>
            )}
            {subs.map((sub) => {
              const catColor = categoryColors[sub.category] || categoryColors.Autre
              return (
                <Card3D key={sub.id} tiltMax={4} className="border-led transition-all hover:-translate-y-1 hover:border-led-glow">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium ${catColor}`}>
                            {sub.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Prelevement le {sub.billingDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-foreground">
                        {sub.amount} EUR<span className="text-xs font-normal text-muted-foreground">/mois</span>
                      </span>
                      <button
                        onClick={() => handleRemove(sub.id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Supprimer ${sub.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card3D>
              )
            })}
          </div>
        </TabsContent>

        {/* Domains tab */}
        <TabsContent value="domains" className="mt-4 flex flex-col gap-4">
          <div className="flex justify-end">
            <Dialog open={domainDialogOpen} onOpenChange={setDomainDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter domaine
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dialog border-led text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Nouveau nom de domaine</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label>Nom de domaine</Label>
                    <Input
                      placeholder="example.com"
                      value={newDomain.name}
                      onChange={(e) => setNewDomain((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Cout annuel (EUR)</Label>
                    <Input
                      type="number"
                      placeholder="12.00"
                      value={newDomain.amount}
                      onChange={(e) => setNewDomain((p) => ({ ...p, amount: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Date d{"'"}expiration</Label>
                    <Input
                      type="date"
                      value={newDomain.expirationDate}
                      onChange={(e) => setNewDomain((p) => ({ ...p, expirationDate: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddDomain} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-3">
            {domains.length === 0 && (
              <div className="rounded-2xl border border-dashed border-led glass py-12 text-center">
                <Globe className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucun domaine pour le moment</p>
              </div>
            )}
            {domains.map((domain) => {
              const statusConf = domain.status ? domainStatusConfig[domain.status] : domainStatusConfig.active
              const StatusIcon = statusConf.icon
              return (
                <Card3D key={domain.id} tiltMax={4} className="border-led transition-all hover:-translate-y-1 hover:border-led-glow">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                        <Globe className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold text-foreground">{domain.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusConf.bg} ${statusConf.text}`}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {statusConf.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Exp: {domain.expirationDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-foreground">
                        {domain.amount} EUR<span className="text-xs font-normal text-muted-foreground">/an</span>
                      </span>
                      <button
                        onClick={() => handleRemove(domain.id)}
                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Supprimer ${domain.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card3D>
              )
            })}
          </div>
        </TabsContent>

        {/* Apps tab */}
        <TabsContent value="apps" className="mt-4 flex flex-col gap-4">
          <div className="flex justify-end">
            <Dialog open={appDialogOpen} onOpenChange={setAppDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une app
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-dialog border-led text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-display text-foreground">Nouvelle app</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label>Nom de l{"'"}app</Label>
                    <Input
                      placeholder="Mon App"
                      value={newApp.name}
                      onChange={(e) => setNewApp((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Objectif</Label>
                    <Input
                      placeholder="E-commerce, SaaS, etc."
                      value={newApp.objective}
                      onChange={(e) => setNewApp((p) => ({ ...p, objective: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Revenus estimes (EUR/mois)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newApp.estimatedRevenue}
                      onChange={(e) => setNewApp((p) => ({ ...p, estimatedRevenue: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddApp} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {apps.length === 0 && (
              <div className="col-span-2 rounded-2xl border border-dashed border-led glass py-12 text-center">
                <Box className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Aucune app pour le moment</p>
              </div>
            )}
            {apps.map((app) => (
              <Card3D key={app.id} tiltMax={4} className="border-led transition-all hover:-translate-y-1 hover:border-led-glow">
                <CardContent className="flex flex-col gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                      <Box className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-foreground">{app.name}</p>
                      <p className="text-xs text-muted-foreground">{app.objective}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-secondary/80 px-4 py-3">
                    <p className="text-xs text-muted-foreground">Revenus estimes</p>
                    <p className="text-xl font-bold text-primary">
                      {app.estimatedRevenue} EUR<span className="text-xs font-normal text-muted-foreground">/mois</span>
                    </p>
                  </div>
                </CardContent>
              </Card3D>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
