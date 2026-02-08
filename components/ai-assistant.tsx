"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Bot, X, Minimize2, Maximize2, Sparkles } from "lucide-react"
import RuixenQueryBox from "@/components/ui/ruixen-query-box"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Bonjour ! Je suis votre assistant ELITE. Je peux vous aider a ajouter un prospect, creer un rappel, gerer vos abonnements ou vous resumer votre journee. Que puis-je faire pour vous ?",
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("prospect")) {
    return "J'ai note votre demande concernant un prospect. Rendez-vous dans la section Prospects pour l'ajouter, ou donnez-moi le nom et le statut et je m'en occupe ! (Fonctionnalite API a venir)"
  }
  if (lower.includes("rappel") || lower.includes("reminder")) {
    return "Pour creer un rappel, rendez-vous dans la section Calendrier ou dites-moi le titre, la date et l'heure. (Connexion API a venir)"
  }
  if (lower.includes("abonnement") || lower.includes("subscription")) {
    return "Vous pouvez gerer vos abonnements dans la section dediee. Dites-moi le nom et le montant pour en ajouter un ! (API en preparation)"
  }
  if (lower.includes("domaine") || lower.includes("domain")) {
    return "Pour ajouter un domaine, allez dans la section Domaines & Apps. Je pourrai bientot le faire directement pour vous."
  }
  if (lower.includes("resume") || lower.includes("journee") || lower.includes("today")) {
    return "Voici votre resume : 2 prospects chauds en attente, 3 rappels actifs, 197 EUR de depenses ce mois, 65 EUR/mois en abonnements. Restez focus !"
  }
  if (lower.includes("depense") || lower.includes("expense")) {
    return "Pour ajouter une depense, rendez-vous dans la section Finances. Donnez-moi le libelle et le montant pour une saisie rapide ! (API a venir)"
  }
  if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("hello") || lower.includes("hey")) {
    return "Salut ! Pret a conquerir la journee ? Dites-moi ce dont vous avez besoin."
  }

  return "Je comprends votre demande. Cette fonctionnalite sera bientot connectee a une API pour executer vos actions automatiquement. En attendant, utilisez les sections de l'app pour gerer vos donnees."
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSend(message: string) {
    if (!message.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
    }
    setMessages((prev) => [...prev, userMsg])

    setTimeout(() => {
      const response = generateResponse(userMsg.content)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 600)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-500 ease-out hover:scale-125 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
        style={{ transformStyle: "preserve-3d" }}
        aria-label="Ouvrir l'assistant IA"
      >
        <Sparkles className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-2xl glass-card border-led shadow-2xl transition-all duration-500 ease-out",
        "hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
        isMinimized ? "h-14 w-80" : "h-[520px] w-[400px]"
      )}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-primary px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/20">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground">Assistant ELITE</p>
            <p className="text-[10px] text-primary-foreground/70">En ligne</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            aria-label={isMinimized ? "Agrandir" : "Reduire"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md border border-border bg-secondary text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input - RuixenQueryBox */}
          <div className="shrink-0 border-t border-border bg-card">
            <RuixenQueryBox
              placeholder="Écrivez un message..."
              onSend={handleSend}
              onFileUpload={(files) => console.log("Fichiers uploadés:", files)}
              className="px-3 py-2"
            />
          </div>
        </>
      )}
    </div>
  )
}
