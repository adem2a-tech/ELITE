"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { currentUser } from "./store"
import type { Expense } from "./store"

export interface Income {
  id: string
  label: string
  amount: number
  date: string
  source?: string
}

interface AppStoreState {
  currentSavings: number
  expenses: Expense[]
  incomes: Income[]
  addExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  addIncome: (income: Income) => void
  removeIncome: (id: string) => void
  addToSavings: (amount: number) => void
}

const STORAGE_KEY = "elite-app-store"

function loadState(): { currentSavings: number; expenses: Expense[]; incomes: Income[] } {
  if (typeof window === "undefined") {
    return { currentSavings: currentUser.currentSavings, expenses: [], incomes: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        currentSavings: parsed.currentSavings ?? 0,
        expenses: parsed.expenses ?? [],
        incomes: parsed.incomes ?? [],
      }
    }
  } catch {
    // ignore
  }
  return { currentSavings: currentUser.currentSavings, expenses: [], incomes: [] }
}

function saveState(state: { currentSavings: number; expenses: Expense[]; incomes: Income[] }) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const AppStoreContext = createContext<AppStoreState | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentSavings, setCurrentSavings] = useState(currentUser.currentSavings)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])

  useEffect(() => {
    const loaded = loadState()
    setCurrentSavings(loaded.currentSavings)
    setExpenses(loaded.expenses)
    setIncomes(loaded.incomes)
  }, [])

  useEffect(() => {
    saveState({ currentSavings, expenses, incomes })
  }, [currentSavings, expenses, incomes])

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => [expense, ...prev])
  }, [])

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const addIncome = useCallback((income: Income) => {
    setIncomes((prev) => [income, ...prev])
  }, [])

  const removeIncome = useCallback((id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const addToSavings = useCallback((amount: number) => {
    setCurrentSavings((prev) => Math.max(0, prev + amount))
  }, [])

  const value = useMemo(
    () => ({
      currentSavings,
      expenses,
      incomes,
      addExpense,
      removeExpense,
      addIncome,
      removeIncome,
      addToSavings,
    }),
    [currentSavings, expenses, incomes, addExpense, removeExpense, addIncome, removeIncome, addToSavings]
  )

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
