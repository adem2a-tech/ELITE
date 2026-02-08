// ELITE - Local data store (prepared for future API integration)

export interface User {
  name: string
  savingsGoal: number // en euros
  currentSavings: number
  goalName: string
  monthlyGoal: number // objectif ce mois (ex: 1000)
}

export const currentUser: User = {
  name: "Adem",
  savingsGoal: 250_000,
  currentSavings: 0,
  goalName: "Hurácan",
  monthlyGoal: 1000,
}

export interface Prospect {
  id: string
  name: string
  date: string
  status: "hot" | "cold" | "in-progress"
  source: string
  phone?: string
  notes?: string
}

export interface Reminder {
  id: string
  title: string // sujet
  description: string
  date: string
  time: string
  done: boolean
  withWho?: string // appel avec qui
  duration?: number // durée en minutes
}

export interface Expense {
  id: string
  label: string
  amount: number
  date: string
  category: string
}

export interface Subscription {
  id: string
  name: string
  amount: number
  billingDate: string
  category: string
  type: "subscription" | "domain"
  // Domain-specific fields
  expirationDate?: string
  status?: "active" | "expired" | "renewal"
}

export interface AppProject {
  id: string
  name: string
  objective: string
  estimatedRevenue: number
}

// Mock data - tout à 0 (données vides)
export const mockProspects: Prospect[] = []
export const mockReminders: Reminder[] = []
export const mockExpenses: Expense[] = []
export const mockSubscriptions: Subscription[] = []
export const mockApps: AppProject[] = []
