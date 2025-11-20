"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type OfferStatus = "draft" | "published" | "paused" | "completed"

export interface Offer {
  id: string
  title: string
  description: string
  category: string
  images: string[]
  condition: string
  location: string
  userId: string
  userName: string
  userAvatar?: string
  userRating: number
  status: OfferStatus
  createdAt: string
  updatedAt: string
  views: number
  favorites: number
}

interface OffersContextType {
  offers: Offer[]
  createOffer: (offer: Omit<Offer, "id" | "createdAt" | "updatedAt" | "views" | "favorites">) => Promise<string>
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>
  deleteOffer: (id: string) => Promise<void>
  getOfferById: (id: string) => Offer | undefined
  getUserOffers: (userId: string) => Offer[]
  getPublishedOffers: () => Offer[]
}

const OffersContext = createContext<OffersContextType | undefined>(undefined)

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    // Load offers from localStorage
    const storedOffers = localStorage.getItem("truequehub_offers")
    if (storedOffers) {
      setOffers(JSON.parse(storedOffers))
    } else {
      // Initialize with some mock offers
      const mockOffers: Offer[] = [
        {
          id: "1",
          title: "MacBook Pro 2021 M1 - Excelente estado para diseño",
          description:
            "MacBook Pro en perfecto estado, ideal para diseño gráfico y edición de video. Incluye cargador original.",
          category: "Tecnología",
          images: ["/macbook-pro-laptop.png"],
          condition: "Excelente",
          location: "Ciudad de México",
          userId: "user1",
          userName: "Carlos Mendoza",
          userRating: 4.8,
          status: "published",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          views: 245,
          favorites: 18,
        },
        {
          id: "2",
          title: "Bicicleta de montaña Trek - Perfecta para principiantes",
          description: "Bicicleta Trek en buen estado, perfecta para comenzar en el ciclismo de montaña.",
          category: "Deportes",
          images: ["/mountain-bike-bicycle.jpg"],
          condition: "Bueno",
          location: "Guadalajara",
          userId: "user2",
          userName: "Ana García",
          userRating: 4.9,
          status: "published",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          views: 189,
          favorites: 12,
        },
      ]
      setOffers(mockOffers)
      localStorage.setItem("truequehub_offers", JSON.stringify(mockOffers))
    }
  }, [])

  const saveOffers = (updatedOffers: Offer[]) => {
    setOffers(updatedOffers)
    localStorage.setItem("truequehub_offers", JSON.stringify(updatedOffers))
  }

  const createOffer = async (
    offerData: Omit<Offer, "id" | "createdAt" | "updatedAt" | "views" | "favorites">,
  ): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newOffer: Offer = {
      ...offerData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      favorites: 0,
    }

    const updatedOffers = [...offers, newOffer]
    saveOffers(updatedOffers)
    return newOffer.id
  }

  const updateOffer = async (id: string, updates: Partial<Offer>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedOffers = offers.map((offer) =>
      offer.id === id ? { ...offer, ...updates, updatedAt: new Date().toISOString() } : offer,
    )
    saveOffers(updatedOffers)
  }

  const deleteOffer = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedOffers = offers.filter((offer) => offer.id !== id)
    saveOffers(updatedOffers)
  }

  const getOfferById = (id: string) => {
    return offers.find((offer) => offer.id === id)
  }

  const getUserOffers = (userId: string) => {
    return offers.filter((offer) => offer.userId === userId)
  }

  const getPublishedOffers = () => {
    return offers.filter((offer) => offer.status === "published")
  }

  return (
    <OffersContext.Provider
      value={{
        offers,
        createOffer,
        updateOffer,
        deleteOffer,
        getOfferById,
        getUserOffers,
        getPublishedOffers,
      }}
    >
      {children}
    </OffersContext.Provider>
  )
}

export function useOffers() {
  const context = useContext(OffersContext)
  if (context === undefined) {
    throw new Error("useOffers must be used within an OffersProvider")
  }
  return context
}
