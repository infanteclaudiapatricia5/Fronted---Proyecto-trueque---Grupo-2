"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useOffers } from "@/lib/offers-context"
import { useExchanges } from "@/lib/exchanges-context"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  Flag,
  ArrowLeft,
  Star,
  Package,
  CheckCircle2,
  MessageSquare,
  Repeat,
} from "lucide-react"

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getOfferById, getUserOffers } = useOffers()
  const { proposeExchange } = useExchanges()
  const { toast } = useToast()
  const [selectedOfferId, setSelectedOfferId] = useState<string>("")
  const [message, setMessage] = useState("")
  const [isProposing, setIsProposing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const offerId = params.id as string
  const offer = getOfferById(offerId)

  useEffect(() => {
    if (!offer) {
      router.push("/explorar")
    }
  }, [offer, router])

  if (!offer) {
    return null
  }

  const isOwner = user?.id === offer.userId
  const userOffers = user ? getUserOffers(user.id).filter((o) => o.status === "published" && o.id !== offerId) : []

  const handleProposeExchange = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para proponer un intercambio",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!selectedOfferId) {
      toast({
        title: "Selecciona una oferta",
        description: "Debes seleccionar una de tus ofertas para intercambiar",
        variant: "destructive",
      })
      return
    }

    setIsProposing(true)
    try {
      await proposeExchange(selectedOfferId, offerId, message)
      toast({
        title: "Propuesta enviada",
        description: "Tu propuesta de intercambio ha sido enviada exitosamente",
      })
      setDialogOpen(false)
      setSelectedOfferId("")
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la propuesta. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProposing(false)
    }
  }

  const formattedDate = new Date(offer.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/explorar">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Explorar
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/10] bg-muted">
                <Image
                  src={offer.images[0] || "/placeholder.svg"}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-4 right-4 bg-green-500 text-white border-0">{offer.condition}</Badge>
              </div>
            </Card>

            {/* Offer Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{offer.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {offer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary">
                    {offer.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">{offer.description}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vistas</p>
                      <p className="font-semibold">{offer.views}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Favoritos</p>
                      <p className="font-semibold">{offer.favorites}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Heart className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            <Card>
              <CardHeader>
                <CardTitle>Publicado por</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={offer.userAvatar || "/placeholder.svg"} alt={offer.userName} />
                    <AvatarFallback>{offer.userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{offer.userName}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{offer.userRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ofertas activas</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Intercambios</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Miembro desde</span>
                    <span className="font-medium">2024</span>
                  </div>
                </div>

                {!isOwner && (
                  <>
                    <Separator />
                    <Button className="w-full bg-transparent" variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Enviar Mensaje
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Exchange Action */}
            {!isOwner && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-primary" />
                    Proponer Intercambio
                  </CardTitle>
                  <CardDescription>Ofrece uno de tus productos a cambio de este</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <Repeat className="mr-2 h-5 w-5" />
                        Iniciar Intercambio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Proponer Intercambio</DialogTitle>
                        <DialogDescription>
                          Selecciona una de tus ofertas para intercambiar por "{offer.title}"
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {userOffers.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-4">
                              No tienes ofertas publicadas para intercambiar
                            </p>
                            <Button asChild>
                              <Link href="/crear-oferta">Crear Oferta</Link>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="offer-select">Tu oferta</Label>
                              <Select value={selectedOfferId} onValueChange={setSelectedOfferId}>
                                <SelectTrigger id="offer-select">
                                  <SelectValue placeholder="Selecciona una oferta" />
                                </SelectTrigger>
                                <SelectContent>
                                  {userOffers.map((userOffer) => (
                                    <SelectItem key={userOffer.id} value={userOffer.id}>
                                      {userOffer.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="message">Mensaje (opcional)</Label>
                              <Textarea
                                id="message"
                                placeholder="Escribe un mensaje para el propietario..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                              />
                            </div>

                            <Button
                              className="w-full"
                              onClick={handleProposeExchange}
                              disabled={isProposing || !selectedOfferId}
                            >
                              {isProposing ? "Enviando..." : "Enviar Propuesta"}
                            </Button>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {isOwner && (
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-1">Esta es tu oferta</p>
                      <p className="text-xs text-muted-foreground">Puedes editarla o pausarla desde tu panel</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
