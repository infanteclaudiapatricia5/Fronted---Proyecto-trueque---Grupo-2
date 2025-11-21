"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { apiFetch } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"

export type OfferStatus = "draft" | "published" | "paused" | "completed"

export interface Offer {
  id: string
  title: string
  description: string
  category: string
  categoryId?: string
  images: string[]
  condition: string
  location: string
  lat?: number
  lng?: number
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

export interface Category {
  id: string
  name: string
}

export interface CreateOfferInput {
  title: string
  description: string
  condition: string
  categoryId: string
  locationLabel: string
  latitude: number
  longitude: number
  images: { base64: string; nombre?: string }[]
  publish?: boolean
}

interface OffersContextType {
  offers: Offer[]
  categories: Category[]
  isLoading: boolean
  createOffer: (offer: CreateOfferInput) => Promise<string>
  updateOffer: (id: string, updates: Partial<Offer>) => Promise<void>
  deleteOffer: (id: string) => Promise<void>
  refreshPublicOffers: () => Promise<void>
  refreshUserOffers: () => Promise<void>
  ensureOfferLoaded: (id: string) => Promise<void>
  getOfferById: (id: string) => Offer | undefined
  getUserOffers: (userId: string) => Offer[]
  getPublishedOffers: () => Offer[]
}

const OffersContext = createContext<OffersContextType | undefined>(undefined)

const statusMap: Record<string, OfferStatus> = {
  BORRADOR: "draft",
  PUBLICADA: "published",
  PAUSADA: "paused",
  COMPLETADA: "completed",
}

const defaultAvatar = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`

function mapOfertaToOffer(raw: any, categories: Record<string, string>): Offer {
  const id = raw._id || raw.id
  const categoryName = categories[raw.categoriaId] || raw.categoriaNombre || "Sin categoría"
  const normalizedStatus = statusMap[raw.status] || "draft"
  const images = Array.isArray(raw.imagenes)
    ? raw.imagenes.map((img: any) => img.url || img.base64 || "/placeholder.svg")
    : ["/placeholder.svg"]

  return {
    id,
    title: raw.titulo || raw.title || "Oferta",
    description: raw.comentarioObligatorio || raw.condicionTrueque || "Sin descripción",
    category: categoryName,
    categoryId: raw.categoriaId,
    images,
    condition: raw.condicionTrueque || "Excelente",
    location:
      raw.locationLabel ||
      (raw.latitud && raw.longitud ? `${raw.latitud.toFixed(3)}, ${raw.longitud.toFixed(3)}` : "Ubicación no disponible"),
    lat: raw.latitud,
    lng: raw.longitud,
    userId: raw.userId || "desconocido",
    userName: raw.ownerName || raw.userName || "Usuario anónimo",
    userAvatar: raw.ownerAvatar || defaultAvatar(raw.userId || raw._id || "anon"),
    userRating: raw.userRating || 4.5,
    status: normalizedStatus,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    views: raw.views || 0,
    favorites: raw.favorites || 0,
  }
}

export function OffersProvider({ children }: { children: ReactNode }) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token, user } = useAuth()

  const categoriesMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc: Record<string, string>, category: Category) => {
      acc[category.id] = category.name
      return acc
    }, {})
  }, [categories])

  const upsertOffers = useCallback((incoming: Offer[]) => {
    setOffers((current: Offer[]) => {
      const map = new Map(current.map((offer: Offer) => [offer.id, offer]))
      incoming.forEach((offer: Offer) => map.set(offer.id, offer))
      return Array.from(map.values())
    })
  }, [])

  const fetchCategories = useCallback(async () => {
    const data = await apiFetch<any[]>("/categorias")
    const parsed: Category[] = data.map((cat) => ({ id: cat._id || cat.id, name: cat.nombre }))
    setCategories(parsed)
  }, [])

  const refreshPublicOffers = useCallback(async () => {
    const response = await apiFetch<{ data: any[] }>("/ofertas/public")
    const normalized = response.data.map((item) => mapOfertaToOffer(item, categoriesMap))
    upsertOffers(normalized)
  }, [categoriesMap, upsertOffers])

  const refreshUserOffers = useCallback(async () => {
    if (!token) return
    const response = await apiFetch<{ data: any[] }>("/ofertas/my-offers", {
      token,
    })
    const normalized = response.data.map((item) => mapOfertaToOffer(item, categoriesMap))
    upsertOffers(normalized)
  }, [token, categoriesMap, upsertOffers])

  const ensureOfferLoaded = useCallback(
    async (id: string) => {
  const existing = offers.find((offer: Offer) => offer.id === id)
      if (existing) return

      try {
        const endpoint = token ? `/ofertas/${id}` : `/ofertas/public/${id}`
        const data = await apiFetch<any>(endpoint, { token: token || undefined })
        const normalized = mapOfertaToOffer(data, categoriesMap)
        upsertOffers([normalized])
      } catch (error) {
        console.error("Error loading offer", error)
      }
    },
    [offers, token, categoriesMap, upsertOffers],
  )

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await fetchCategories()
        await refreshPublicOffers()
        if (token) {
          await refreshUserOffers()
        }
      } catch (error) {
        console.error("Error inicializando ofertas", error)
      } finally {
        setIsLoading(false)
      }
    }

    void bootstrap()
  }, [token])

  const createOffer = useCallback(
    async (offerData: CreateOfferInput) => {
      if (!token || !user) {
        throw new Error("Debes iniciar sesión para crear ofertas")
      }

      const payload = {
        titulo: offerData.title,
        categoriaId: offerData.categoryId,
        condicionTrueque: offerData.condition,
        comentarioObligatorio: offerData.description,
        latitud: offerData.latitude,
        longitud: offerData.longitude,
        imagenes: offerData.images,
      }

      const created = await apiFetch<any>("/ofertas", {
        method: "POST",
        body: payload,
        token,
      })

      const createdId = created._id || created.id

      if (offerData.publish) {
        await apiFetch(`/ofertas/${createdId}/status/PUBLICADA`, {
          method: "PATCH",
          token,
        })
      }

      await refreshPublicOffers()
      await refreshUserOffers()

      return createdId
    },
    [token, user, refreshPublicOffers, refreshUserOffers],
  )

  const updateOffer = useCallback(
    async (id: string, updates: Partial<Offer>) => {
      if (!token) throw new Error("Autenticación requerida")

      const payload: Record<string, unknown> = {}

      if (updates.title) payload.titulo = updates.title
      if (updates.description) payload.comentarioObligatorio = updates.description
      if (updates.categoryId) payload.categoriaId = updates.categoryId
      if (updates.condition) payload.condicionTrueque = updates.condition

      if (Object.keys(payload).length > 0) {
        await apiFetch(`/ofertas/${id}`, {
          method: "PATCH",
          body: payload,
          token,
        })
      }

      if (updates.status) {
        const backendStatus = Object.entries(statusMap).find(([, value]) => value === updates.status)?.[0]
        if (backendStatus) {
          await apiFetch(`/ofertas/${id}/status/${backendStatus}`, {
            method: "PATCH",
            token,
          })
        }
      }

      await refreshPublicOffers()
      await refreshUserOffers()
    },
    [token, refreshPublicOffers, refreshUserOffers],
  )

  const deleteOffer = useCallback(
    async (id: string) => {
      if (!token) throw new Error("Autenticación requerida")
      await apiFetch(`/ofertas/${id}`, {
        method: "DELETE",
        token,
      })
      await refreshPublicOffers()
      await refreshUserOffers()
    },
    [token, refreshPublicOffers, refreshUserOffers],
  )

  const getOfferById = (id: string) => offers.find((offer: Offer) => offer.id === id)

  const getUserOffers = (userId: string) => offers.filter((offer: Offer) => offer.userId === userId)

  const getPublishedOffers = () => offers.filter((offer: Offer) => offer.status === "published")

  return (
    <OffersContext.Provider
      value={{
        offers,
        categories,
        isLoading,
        createOffer,
        updateOffer,
        deleteOffer,
        refreshPublicOffers,
        refreshUserOffers,
        ensureOfferLoaded,
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
