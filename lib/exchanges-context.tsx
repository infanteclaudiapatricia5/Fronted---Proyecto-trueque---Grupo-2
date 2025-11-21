"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { useOffers, type Offer } from "@/lib/offers-context"

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
  isLoading: boolean
  refreshExchanges: () => Promise<void>
  proposeExchange: (offerAId: string, offerBId: string, message?: string) => Promise<string>
  acceptProposal: (exchangeId: string) => Promise<void>
  rejectProposal: (exchangeId: string) => Promise<void>
  confirmExchange: (exchangeId: string) => Promise<void>
  cancelExchange: (exchangeId: string) => Promise<void>
  getUserExchanges: (userId: string) => Exchange[]
  getIncomingProposals: (userId: string) => Exchange[]
  getOutgoingProposals: (userId: string) => Exchange[]
  getCompletedExchanges: (userId: string) => Exchange[]
  getPendingConfirmations: (userId: string) => Exchange[]
}

const ExchangesContext = createContext<ExchangesContextType | undefined>(undefined)

type BackendTrade = {
  _id?: string
  id?: string
  proposerId: string
  responderId: string
  proposerOfferJson: any
  responderOfferJson: any
  proposerConfirmed?: boolean
  responderConfirmed?: boolean
  status: string
  message?: string
  createdAt?: string
  updatedAt?: string
  closedAt?: string
}

const backendStatusMap: Record<string, ExchangeStatus> = {
  PENDING: "pending",
  CONFIRMED: "completed",
  CANCELLED: "cancelled",
}

const parseOfferSnapshot = (raw: any) => {
  if (!raw) return {}
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw)
    } catch (error) {
      return {}
    }
  }
  return raw
}

const pickSnapshotFallback = (snapshot: any, fallback?: Offer) => {
  const firstImage = snapshot?.image || snapshot?.images?.[0] || fallback?.images?.[0] || "/placeholder.svg"
  return {
    id: snapshot?.offerId || snapshot?.id || fallback?.id || "",
    title: snapshot?.title || fallback?.title || "Oferta",
    image: firstImage,
    userId: snapshot?.userId || fallback?.userId || "",
    userName: snapshot?.userName || fallback?.userName || "Usuario",
  }
}

const mapTradeToExchange = (trade: BackendTrade, offerLookup: Map<string, Offer>): Exchange => {
  const proposerSnapshot = parseOfferSnapshot(trade.proposerOfferJson)
  const responderSnapshot = parseOfferSnapshot(trade.responderOfferJson)

  const proposerOffer = offerLookup.get(proposerSnapshot.offerId) || offerLookup.get(proposerSnapshot.id || "")
  const responderOffer = offerLookup.get(responderSnapshot.offerId) || offerLookup.get(responderSnapshot.id || "")

  const proposer = pickSnapshotFallback(proposerSnapshot, proposerOffer)
  const responder = pickSnapshotFallback(responderSnapshot, responderOffer)

  let status = backendStatusMap[trade.status] || "pending"
  if (trade.status === "PENDING" && (trade.proposerConfirmed || trade.responderConfirmed)) {
    status = "accepted"
  }

  const exchange: Exchange = {
    id: (trade._id || trade.id || "").toString(),
    offerAId: proposer.id,
    offerATitle: proposer.title,
    offerAImage: proposerOffer?.images?.[0] || proposer.image,
    userAId: trade.proposerId,
    userAName: proposer.userName,
    userAConfirmed: Boolean(trade.proposerConfirmed),
    offerBId: responder.id,
    offerBTitle: responder.title,
    offerBImage: responderOffer?.images?.[0] || responder.image,
    userBId: trade.responderId,
    userBName: responder.userName,
    userBConfirmed: Boolean(trade.responderConfirmed),
    status,
    message: trade.message || proposerSnapshot?.message || responderSnapshot?.message,
    createdAt: trade.createdAt || new Date().toISOString(),
    updatedAt: trade.updatedAt || trade.createdAt || new Date().toISOString(),
    completedAt: trade.closedAt,
  }

  if (trade.status === "CANCELLED" && !trade.proposerConfirmed && !trade.responderConfirmed) {
    exchange.status = "rejected"
  }

  return exchange
}

export function ExchangesProvider({ children }: { children: ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token, user } = useAuth()
  const offersContext = useOffers()

  const offerLookup = useMemo(() => {
    return new Map(offersContext.offers.map((offer: Offer) => [offer.id, offer]))
  }, [offersContext.offers])

  const refreshExchanges = useCallback(async () => {
    if (!token || !user) {
      setExchanges([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await apiFetch<BackendTrade[]>("/trades/me", {
        token,
      })
      const normalized = data.map((trade) => mapTradeToExchange(trade, offerLookup))
      setExchanges(normalized)
    } catch (error) {
      console.error("Error fetching trades", error)
    } finally {
      setIsLoading(false)
    }
  }, [token, user, offerLookup])

  useEffect(() => {
    if (!token || !user) {
      setExchanges([])
      setIsLoading(false)
      return
    }

    void refreshExchanges()
  }, [token, user, refreshExchanges])

  const persistTrade = useCallback(
    (trade: BackendTrade) => {
      setExchanges((current: Exchange[]) => {
        const normalized = mapTradeToExchange(trade, offerLookup)
        const exists = current.some((exchange: Exchange) => exchange.id === normalized.id)
        if (exists) {
          return current.map((exchange: Exchange) => (exchange.id === normalized.id ? normalized : exchange))
        }
        return [normalized, ...current]
      })
    },
    [offerLookup],
  )

  const proposeExchange = useCallback(
    async (offerAId: string, offerBId: string, message?: string) => {
      if (!token || !user) {
        throw new Error("Debes iniciar sesión para proponer un trueque")
      }

      await offersContext.ensureOfferLoaded(offerAId)
      await offersContext.ensureOfferLoaded(offerBId)

      const offerA = offersContext.getOfferById(offerAId)
      const offerB = offersContext.getOfferById(offerBId)

      if (!offerA || !offerB) {
        throw new Error("Ofertas no encontradas")
      }

      const payload = {
        proposerId: offerA.userId,
        responderId: offerB.userId,
        proposerOfferJson: JSON.stringify({
          offerId: offerA.id,
          title: offerA.title,
          image: offerA.images[0],
          userId: offerA.userId,
          userName: offerA.userName,
          message,
        }),
        responderOfferJson: JSON.stringify({
          offerId: offerB.id,
          title: offerB.title,
          image: offerB.images[0],
          userId: offerB.userId,
          userName: offerB.userName,
        }),
      }

      const created = await apiFetch<BackendTrade>("/trades", {
        method: "POST",
        body: payload,
        token,
      })

      persistTrade(created)
      return (created._id || created.id || "").toString()
    },
    [token, user, offersContext, persistTrade],
  )

  const mutateTradeDecision = useCallback(
    async (exchangeId: string, accept: boolean) => {
      if (!token || !user) {
        throw new Error("Debes iniciar sesión para gestionar trueques")
      }

      const updated = await apiFetch<BackendTrade>(`/trades/${exchangeId}/confirm`, {
        method: "POST",
        token,
        body: { userId: user.id, accept },
      })

      persistTrade(updated)
    },
    [token, user, persistTrade],
  )

  const acceptProposal = useCallback(
    async (exchangeId: string) => {
      await mutateTradeDecision(exchangeId, true)
    },
    [mutateTradeDecision],
  )

  const rejectProposal = useCallback(
    async (exchangeId: string) => {
      await mutateTradeDecision(exchangeId, false)
    },
    [mutateTradeDecision],
  )

  const confirmExchange = useCallback(
    async (exchangeId: string) => {
      await mutateTradeDecision(exchangeId, true)
    },
    [mutateTradeDecision],
  )

  const cancelExchange = useCallback(
    async (exchangeId: string) => {
      await mutateTradeDecision(exchangeId, false)
    },
    [mutateTradeDecision],
  )

  const getUserExchanges = useCallback(
    (userId: string) => exchanges.filter((exchange: Exchange) => exchange.userAId === userId || exchange.userBId === userId),
    [exchanges],
  )

  const getIncomingProposals = useCallback(
    (userId: string) =>
      exchanges.filter((exchange: Exchange) => exchange.userBId === userId && exchange.status === "pending"),
    [exchanges],
  )

  const getOutgoingProposals = useCallback(
    (userId: string) =>
      exchanges.filter((exchange: Exchange) => exchange.userAId === userId && exchange.status === "pending"),
    [exchanges],
  )

  const getCompletedExchanges = useCallback(
    (userId: string) =>
      exchanges.filter(
        (exchange: Exchange) => (exchange.userAId === userId || exchange.userBId === userId) && exchange.status === "completed",
      ),
    [exchanges],
  )

  const getPendingConfirmations = useCallback(
    (userId: string) =>
      exchanges.filter((exchange: Exchange) => {
        if (exchange.status !== "accepted") return false
        const isUserA = exchange.userAId === userId
        const isUserB = exchange.userBId === userId
        if (!isUserA && !isUserB) return false
        if (isUserA && !exchange.userAConfirmed) return true
        if (isUserB && !exchange.userBConfirmed) return true
        return false
      }),
    [exchanges],
  )

  return (
    <ExchangesContext.Provider
      value={{
        exchanges,
        isLoading,
        refreshExchanges,
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
