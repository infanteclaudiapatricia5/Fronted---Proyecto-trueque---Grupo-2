"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useExchanges, type Exchange } from "@/lib/exchanges-context"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeftRight, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Package, Repeat } from "lucide-react"

export default function ExchangesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const {
    getIncomingProposals,
    getOutgoingProposals,
    getPendingConfirmations,
    getCompletedExchanges,
    acceptProposal,
    rejectProposal,
    confirmExchange,
  } = useExchanges()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("incoming")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const incomingProposals: Exchange[] = getIncomingProposals(user.id)
  const outgoingProposals: Exchange[] = getOutgoingProposals(user.id)
  const pendingConfirmations: Exchange[] = getPendingConfirmations(user.id)
  const completedExchanges: Exchange[] = getCompletedExchanges(user.id)

  const handleAccept = async (exchangeId: string) => {
    try {
      await acceptProposal(exchangeId)
      toast({
        title: "Propuesta aceptada",
        description: "Ahora ambas partes deben confirmar el intercambio",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aceptar la propuesta",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (exchangeId: string) => {
    try {
      await rejectProposal(exchangeId)
      toast({
        title: "Propuesta rechazada",
        description: "La propuesta ha sido rechazada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la propuesta",
        variant: "destructive",
      })
    }
  }

  const handleConfirm = async (exchangeId: string) => {
    try {
      await confirmExchange(exchangeId)
      toast({
        title: "Intercambio confirmado",
        description: "Has confirmado el intercambio exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar el intercambio",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Intercambios</h1>
          <p className="text-muted-foreground">Gestiona tus propuestas de intercambio y confirmaciones bilaterales</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incoming" className="relative">
              Recibidas
              {incomingProposals.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {incomingProposals.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="outgoing">Enviadas</TabsTrigger>
            <TabsTrigger value="confirmations" className="relative">
              Confirmaciones
              {pendingConfirmations.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500">
                  {pendingConfirmations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
          </TabsList>

          {/* Incoming Proposals */}
          <TabsContent value="incoming" className="space-y-4">
            {incomingProposals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay propuestas recibidas</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Cuando alguien proponga un intercambio por tus ofertas, aparecerán aquí
                  </p>
                  <Button asChild>
                    <Link href="/explorar">Explorar Ofertas</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              incomingProposals.map((exchange) => (
                <Card key={exchange.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Nueva Propuesta de Intercambio</CardTitle>
                      <Badge variant="outline" className="bg-background">
                        <Clock className="mr-1 h-3 w-3" />
                        Pendiente
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(exchange.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                      {/* Offer A (Their offer) */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">Ofrecen:</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{exchange.userAName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{exchange.userAName}</p>
                            <p className="text-xs text-muted-foreground">Propone intercambio</p>
                          </div>
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerAImage || "/placeholder.svg"}
                            alt={exchange.offerATitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerATitle}</p>
                      </div>

                      {/* Exchange Icon */}
                      <div className="flex justify-center">
                        <div className="p-3 rounded-full bg-primary/10">
                          <ArrowLeftRight className="h-6 w-6 text-primary" />
                        </div>
                      </div>

                      {/* Offer B (Your offer) */}
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">Por tu oferta:</p>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Tu oferta</p>
                          </div>
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerBImage || "/placeholder.svg"}
                            alt={exchange.offerBTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerBTitle}</p>
                      </div>
                    </div>

                    {exchange.message && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Mensaje:</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{exchange.message}</p>
                        </div>
                      </>
                    )}

                    <Separator className="my-6" />

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => handleAccept(exchange.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Aceptar Propuesta
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleReject(exchange.id)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Outgoing Proposals */}
          <TabsContent value="outgoing" className="space-y-4">
            {outgoingProposals.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Repeat className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No has enviado propuestas</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Explora ofertas y propón intercambios con otros usuarios
                  </p>
                  <Button asChild>
                    <Link href="/explorar">Explorar Ofertas</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              outgoingProposals.map((exchange) => (
                <Card key={exchange.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Propuesta Enviada</CardTitle>
                      <Badge variant="outline">
                        <Clock className="mr-1 h-3 w-3" />
                        Esperando respuesta
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">Tu oferta:</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerAImage || "/placeholder.svg"}
                            alt={exchange.offerATitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerATitle}</p>
                      </div>

                      <div className="flex justify-center">
                        <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground font-medium">Solicitaste:</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerBImage || "/placeholder.svg"}
                            alt={exchange.offerBTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerBTitle}</p>
                        <p className="text-xs text-muted-foreground">De {exchange.userBName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Pending Confirmations */}
          <TabsContent value="confirmations" className="space-y-4">
            {pendingConfirmations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay confirmaciones pendientes</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Cuando aceptes una propuesta, deberás confirmar el intercambio aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingConfirmations.map((exchange) => {
                const isUserA = exchange.userAId === user.id
                const userConfirmed = isUserA ? exchange.userAConfirmed : exchange.userBConfirmed
                const otherConfirmed = isUserA ? exchange.userBConfirmed : exchange.userAConfirmed

                return (
                  <Card key={exchange.id} className="border-orange-500/50 bg-orange-500/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Confirmación Bilateral Requerida</CardTitle>
                        <Badge className="bg-orange-500">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Acción Requerida
                        </Badge>
                      </div>
                      <CardDescription>Ambas partes deben confirmar para completar el intercambio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={exchange.offerAImage || "/placeholder.svg"}
                              alt={exchange.offerATitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium text-sm">{exchange.offerATitle}</p>
                          <div className="flex items-center gap-2">
                            {exchange.userAConfirmed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-orange-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {exchange.userAConfirmed ? "Confirmado" : "Pendiente"} - {exchange.userAName}
                            </span>
                          </div>
                        </div>

                        <ArrowLeftRight className="h-6 w-6 text-primary" />

                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={exchange.offerBImage || "/placeholder.svg"}
                              alt={exchange.offerBTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium text-sm">{exchange.offerBTitle}</p>
                          <div className="flex items-center gap-2">
                            {exchange.userBConfirmed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-orange-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {exchange.userBConfirmed ? "Confirmado" : "Pendiente"} - {exchange.userBName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!userConfirmed && (
                        <>
                          <Separator />
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                            <p className="text-sm font-medium mb-3">
                              Confirma que has completado tu parte del intercambio
                            </p>
                            <Button className="w-full" onClick={() => handleConfirm(exchange.id)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Confirmar Intercambio
                            </Button>
                          </div>
                        </>
                      )}

                      {userConfirmed && !otherConfirmed && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                          <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Has confirmado el intercambio</p>
                          <p className="text-xs text-muted-foreground mt-1">Esperando confirmación de la otra parte</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>

          {/* Completed Exchanges */}
          <TabsContent value="completed" className="space-y-4">
            {completedExchanges.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay intercambios completados</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Tus intercambios completados aparecerán aquí
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedExchanges.map((exchange) => (
                <Card key={exchange.id} className="border-green-500/50 bg-green-500/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Intercambio Completado</CardTitle>
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completado
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Completado el{" "}
                      {new Date(exchange.completedAt!).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                      <div className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerAImage || "/placeholder.svg"}
                            alt={exchange.offerATitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerATitle}</p>
                        <p className="text-xs text-muted-foreground">{exchange.userAName}</p>
                      </div>

                      <div className="flex justify-center">
                        <div className="p-3 rounded-full bg-green-500/20">
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={exchange.offerBImage || "/placeholder.svg"}
                            alt={exchange.offerBTitle}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{exchange.offerBTitle}</p>
                        <p className="text-xs text-muted-foreground">{exchange.userBName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
