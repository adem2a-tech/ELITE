"use client"

import { useState, useMemo } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, TrendingDown, TrendingUp, CreditCard, PiggyBank, Trash2, Globe } from "lucide-react"
import type { Expense } from "@/lib/store"
import { mockSubscriptions } from "@/lib/store"
import { useAppStore } from "@/lib/app-store"
import type { Income } from "@/lib/app-store"
import { format } from "date-fns"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function FinancesSection() {
  const { expenses, addExpense, removeExpense, incomes, addIncome, removeIncome, addToSavings } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [newExpense, setNewExpense] = useState({
    label: "",
    amount: "",
    category: "",
  })
  const [newIncome, setNewIncome] = useState({
    label: "",
    amount: "",
    source: "",
    addToSavings: false,
  })

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
  const subsOnly = mockSubscriptions.filter((s) => s.type === "subscription")
  const domainsOnly = mockSubscriptions.filter((s) => s.type === "domain")
  const totalSubs = subsOnly.reduce((sum, s) => sum + s.amount, 0)
  const totalDomains = domainsOnly.reduce((sum, d) => sum + d.amount, 0)
  const estimatedSavings = totalIncome - totalExpenses - totalSubs

  function handleAdd() {
    if (!newExpense.label || !newExpense.amount) return
    const expense: Expense = {
      id: Date.now().toString(),
      label: newExpense.label,
      amount: Number.parseFloat(newExpense.amount),
      date: new Date().toISOString().split("T")[0],
      category: newExpense.category || "Autre",
    }
    addExpense(expense)
    setNewExpense({ label: "", amount: "", category: "" })
    setDialogOpen(false)
  }

  function handleRemoveExpense(id: string) {
    removeExpense(id)
  }

  function handleAddIncome() {
    if (!newIncome.label || !newIncome.amount) return
    const income: Income = {
      id: Date.now().toString(),
      label: newIncome.label,
      amount: Number.parseFloat(newIncome.amount),
      date: new Date().toISOString().split("T")[0],
      source: newIncome.source || undefined,
    }
    addIncome(income)
    if (newIncome.addToSavings) {
      addToSavings(Number.parseFloat(newIncome.amount))
    }
    setNewIncome({ label: "", amount: "", source: "", addToSavings: false })
    setIncomeDialogOpen(false)
  }

  function handleRemoveIncome(id: string) {
    removeIncome(id)
  }

  const monthlyExpenseData = useMemo(() => {
    const months = [
      { month: "Sep", key: "Sep", amount: 0 },
      { month: "Oct", key: "Oct", amount: 0 },
      { month: "Nov", key: "Nov", amount: 0 },
      { month: "Dec", key: "Dec", amount: 0 },
      { month: "Jan", key: "Jan", amount: 0 },
      { month: "Feb", key: "Feb", amount: 0 },
    ]
    expenses.forEach((e) => {
      const d = new Date(e.date)
      const monthKey = format(d, "MMM")
      const idx = months.findIndex((m) => m.month === monthKey)
      if (idx >= 0) months[idx].amount += e.amount
    })
    return months
  }, [expenses])

  const statCards = [
    {
      label: "Revenus totaux",
      value: `${totalIncome} EUR`,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Depenses totales",
      value: `${totalExpenses} EUR`,
      icon: TrendingDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Abonnements/mois",
      value: `${totalSubs} EUR`,
      icon: CreditCard,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Domaines / an",
      value: `${totalDomains} EUR`,
      icon: Globe,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      label: "Economies estimees",
      value: `${estimatedSavings > 0 ? estimatedSavings : 0} EUR`,
      icon: PiggyBank,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Finances Business</h2>
          <p className="text-sm text-white/80">Vue d{"'"}ensemble de vos depenses</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-50">
                <TrendingUp className="mr-2 h-4 w-4" />
                Revenu
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dialog border-led text-foreground">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">Ajouter un revenu</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Libelle</Label>
                  <Input
                    placeholder="Ex: Vente, Prestation..."
                    value={newIncome.label}
                    onChange={(e) => setNewIncome((p) => ({ ...p, label: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Montant (EUR)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome((p) => ({ ...p, amount: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Source (optionnel)</Label>
                  <Input
                    placeholder="Ex: Client X, Plateforme Y"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome((p) => ({ ...p, source: e.target.value }))}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newIncome.addToSavings}
                    onChange={(e) => setNewIncome((p) => ({ ...p, addToSavings: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span>Ajouter aux economies (Hurácan)</span>
                </label>
                <Button onClick={handleAddIncome} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Depense
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-dialog border-led text-foreground">
              <DialogHeader>
                <DialogTitle className="font-display text-foreground">Nouvelle depense</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Label>Libelle</Label>
                  <Input
                    placeholder="Ex: Hosting, Ads, etc."
                    value={newExpense.label}
                    onChange={(e) => setNewExpense((p) => ({ ...p, label: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Montant (EUR)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense((p) => ({ ...p, amount: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Categorie</Label>
                  <Input
                    placeholder="Tech, Marketing, etc."
                    value={newExpense.category}
                    onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card3D key={stat.label} tiltMax={6} className="border-led">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card3D>
          )
        })}
      </div>

      {/* Chart */}
      <Card3D className="border-led" tiltMax={4}>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Depenses mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpenseData}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215, 90%, 45%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(215, 90%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(215, 15%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 50%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(215, 20%, 90%)",
                    borderRadius: "12px",
                    color: "hsl(215, 25%, 15%)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(215, 90%, 45%)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card3D>

      {/* Income List */}
      <Card3D className="border-led" tiltMax={4}>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Historique des revenus</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {incomes.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun revenu. Cliquez sur &quot;Revenu&quot; pour ajouter.
            </p>
          )}
          {incomes.map((inc) => (
            <div
              key={inc.id}
              className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 transition-all duration-300 hover:border-led-glow hover:-translate-x-1"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{inc.label}</p>
                <p className="text-xs text-muted-foreground">
                  {inc.source || "Revenu"} &middot; {inc.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-emerald-600">+{inc.amount} EUR</span>
                <button
                  onClick={() => handleRemoveIncome(inc.id)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Supprimer ${inc.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card3D>

      {/* Expense List */}
      <Card3D className="border-led" tiltMax={4}>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Historique des depenses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {expenses.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune depense. Cliquez sur &quot;Ajouter depense&quot; pour commencer.
            </p>
          )}
          {expenses.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between rounded-xl glass border-led px-4 py-3 transition-all duration-300 hover:border-led-glow hover:-translate-x-1"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{exp.label}</p>
                <p className="text-xs text-muted-foreground">
                  {exp.category} &middot; {exp.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-red-500">-{exp.amount} EUR</span>
                <button
                  onClick={() => handleRemoveExpense(exp.id)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Supprimer ${exp.label}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card3D>
    </div>
  )
}
