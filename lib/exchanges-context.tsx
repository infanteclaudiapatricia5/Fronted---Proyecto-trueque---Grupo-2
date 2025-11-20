"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Offer } from "./offers-context"

export type ExchangeStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled"

export interface Exchange {
  id: string
  // Offer A (proposer)
  offerAId: string
  offerATitle: string
  offerAImage: string
  userAId: string
  userAName: string
  userAConfirmed: boolean
  // Offer B (receiver)
  offerBId: string
  offerBTitle: string
  offerBImage: string
  userBId: string
  userBName: string
  userBConfirmed: boolean
  // Exchange details
  status: ExchangeStatus
  message?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

interface ExchangesContextType {
  exchanges: Exchange[]
  proposeExchange: (offerAId: string, offerBId: string, message?: string) => Promise<string>
  acceptProposal: (exchangeId: string) => Promise<void>
  rejectProposal: (exchangeId: string) => Promise<void>
  confirmExchange: (exchangeId: string, userId: string) => Promise<void>
  cancelExchange: (exchangeId: string) => Promise<void>
  getUserExchanges: (userId: string) => Exchange[]
  getIncomingProposals: (userId: string) => Exchange[]
  getOutgoingProposals: (userId: string) => Exchange[]
  getCompletedExchanges: (userId: string) => Exchange[]
  getPendingConfirmations: (userId: string) => Exchange[]
}

const ExchangesContext = createContext<ExchangesContextType | undefined>(undefined)

export function ExchangesProvider({ children }: { children: ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>([])

  useEffect(() => {
    // Load exchanges from localStorage
    const storedExchanges = localStorage.getItem("truequehub_exchanges")
    if (storedExchanges) {
      setExchanges(JSON.parse(storedExchanges))
    }
  }, [])

  const saveExchanges = (updatedExchanges: Exchange[]) => {
    setExchanges(updatedExchanges)
    localStorage.setItem("truequehub_exchanges", JSON.stringify(updatedExchanges))
  }

  const proposeExchange = async (offerAId: string, offerBId: string, message?: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Get offer details from localStorage
    const offersData = localStorage.getItem("truequehub_offers")
    const offers = offersData ? JSON.parse(offersData) : []

    const offerA = offers.find((o: Offer) => o.id === offerAId)
    const offerB = offers.find((o: Offer) => o.id === offerBId)

    if (!offerA || !offerB) {
      throw new Error("Ofertas no encontradas")
    }

    const newExchange: Exchange = {
      id: Math.random().toString(36).substr(2, 9),
      offerAId,
      offerATitle: offerA.title,
      offerAImage: offerA.images[0] || "/placeholder.svg",
      userAId: offerA.userId,
      userAName: offerA.userName,
      userAConfirmed: false,
      offerBId,
      offerBTitle: offerB.title,
      offerBImage: offerB.images[0] || "/placeholder.svg",
      userBId: offerB.userId,
      userBName: offerB.userName,
      userBConfirmed: false,
      status: "pending",
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedExchanges = [...exchanges, newExchange]
    saveExchanges(updatedExchanges)
    return newExchange.id
  }

  const acceptProposal = async (exchangeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedExchanges = exchanges.map((exchange) =>
      exchange.id === exchangeId
        ? { ...exchange, status: "accepted" as ExchangeStatus, updatedAt: new Date().toISOString() }
        : exchange,
    )
    saveExchanges(updatedExchanges)
  }

  const rejectProposal = async (exchangeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedExchanges = exchanges.map((exchange) =>
      exchange.id === exchangeId
        ? { ...exchange, status: "rejected" as ExchangeStatus, updatedAt: new Date().toISOString() }
        : exchange,
    )
    saveExchanges(updatedExchanges)
  }

  const confirmExchange = async (exchangeId: string, userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedExchanges = exchanges.map((exchange) => {
      if (exchange.id !== exchangeId) return exchange

      const isUserA = exchange.userAId === userId
      const isUserB = exchange.userBId === userId

      if (!isUserA && !isUserB) return exchange

      const updatedExchange = {
        ...exchange,
        userAConfirmed: isUserA ? true : exchange.userAConfirmed,
        userBConfirmed: isUserB ? true : exchange.userBConfirmed,
        updatedAt: new Date().toISOString(),
      }

      // If both users confirmed, mark as completed
      if (updatedExchange.userAConfirmed && updatedExchange.userBConfirmed) {
        updatedExchange.status = "completed"
        updatedExchange.completedAt = new Date().toISOString()
      }

      return updatedExchange
    })

    saveExchanges(updatedExchanges)
  }

  const cancelExchange = async (exchangeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedExchanges = exchanges.map((exchange) =>
      exchange.id === exchangeId
        ? { ...exchange, status: "cancelled" as ExchangeStatus, updatedAt: new Date().toISOString() }
        : exchange,
    )
    saveExchanges(updatedExchanges)
  }

  const getUserExchanges = (userId: string) => {
    return exchanges.filter((exchange) => exchange.userAId === userId || exchange.userBId === userId)
  }

  const getIncomingProposals = (userId: string) => {
    return exchanges.filter((exchange) => exchange.userBId === userId && exchange.status === "pending")
  }

  const getOutgoingProposals = (userId: string) => {
    return exchanges.filter((exchange) => exchange.userAId === userId && exchange.status === "pending")
  }

  const getCompletedExchanges = (userId: string) => {
    return exchanges.filter(
      (exchange) => (exchange.userAId === userId || exchange.userBId === userId) && exchange.status === "completed",
    )
  }

  const getPendingConfirmations = (userId: string) => {
    return exchanges.filter((exchange) => {
      if (exchange.status !== "accepted") return false
      const isUserA = exchange.userAId === userId
      const isUserB = exchange.userBId === userId
      if (!isUserA && !isUserB) return false

      // Show if user hasn't confirmed yet
      if (isUserA && !exchange.userAConfirmed) return true
      if (isUserB && !exchange.userBConfirmed) return true

      return false
    })
  }

  return (
    <ExchangesContext.Provider
      value={{
        exchanges,
        proposeExchange,
        acceptProposal,
        rejectProposal,
        confirmExchange,
        cancelExchange,
        getUserExchanges,
        getIncomingProposals,
        getOutgoingProposals,
        getCompletedExchanges,
        getPendingConfirmations,
      }}
    >
      {children}
    </ExchangesContext.Provider>
  )
}

export function useExchanges() {
  const context = useContext(ExchangesContext)
  if (context === undefined) {
    throw new Error("useExchanges must be used within an ExchangesProvider")
  }
  return context
}
