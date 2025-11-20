"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useOffers, type OfferStatus } from "@/lib/offers-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, MoreVertical, Edit, Trash2, Eye, Pause, Play, Package } from "lucide-react"
import Image from "next/image"

export default function MyOffersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getUserOffers, updateOffer, deleteOffer } = useOffers()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<OfferStatus | "all">("all")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const userOffers = getUserOffers(user.id)
  const filteredOffers = activeTab === "all" ? userOffers : userOffers.filter((offer) => offer.status === activeTab)

  const handleStatusChange = async (offerId: string, newStatus: OfferStatus) => {
    try {
      await updateOffer(offerId, { status: newStatus })
      toast({
        title: "Estado actualizado",
        description: `La oferta ha sido ${newStatus === "paused" ? "pausada" : "activada"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (offerId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta oferta?")) {
      try {
        await deleteOffer(offerId)
        toast({
          title: "Oferta eliminada",
          description: "La oferta ha sido eliminada exitosamente.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la oferta.",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: OfferStatus) => {
    const variants = {
      draft: { label: "Borrador", className: "bg-muted text-muted-foreground" },
      published: { label: "Publicada", className: "bg-green-500/10 text-green-500" },
      paused: { label: "Pausada", className: "bg-yellow-500/10 text-yellow-500" },
      completed: { label: "Completada", className: "bg-blue-500/10 text-blue-500" },
    }
    const variant = variants[status]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Ofertas</h1>
            <p className="text-muted-foreground">Gestiona tus productos y servicios para intercambiar</p>
          </div>
          <Button asChild>
            <Link href="/crear-oferta">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Oferta
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OfferStatus | "all")} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">Todas ({userOffers.length})</TabsTrigger>
            <TabsTrigger value="published">
              Publicadas ({userOffers.filter((o) => o.status === "published").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Borradores ({userOffers.filter((o) => o.status === "draft").length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Pausadas ({userOffers.filter((o) => o.status === "paused").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({userOffers.filter((o) => o.status === "completed").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredOffers.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No tienes ofertas {activeTab !== "all" && activeTab}</h3>
              <p className="text-muted-foreground">Crea tu primera oferta para comenzar a intercambiar</p>
              <Button asChild>
                <Link href="/crear-oferta">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Oferta
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={offer.images[0] || "/placeholder.svg"}
                    alt={offer.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">{getStatusBadge(offer.status)}</div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {offer.status === "published" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(offer.id, "paused")}>
                            <Pause className="mr-2 h-4 w-4" />
                            Pausar
                          </DropdownMenuItem>
                        )}
                        {offer.status === "paused" && (
                          <DropdownMenuItem onClick={() => handleStatusChange(offer.id, "published")}>
                            <Play className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                    <span>{offer.views} vistas</span>
                    <span>{offer.favorites} favoritos</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
