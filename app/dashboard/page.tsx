"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useOffers } from "@/lib/offers-context"
import { useExchanges } from "@/lib/exchanges-context"
import {
  Package,
  TrendingUp,
  Eye,
  Heart,
  Plus,
  MessageSquare,
  Star,
  Award,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Repeat,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { getUserOffers } = useOffers()
  const { getIncomingProposals, getPendingConfirmations } = useExchanges()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const userOffers = getUserOffers(user.id)
  const publishedOffers = userOffers.filter((o) => o.status === "published")
  const draftOffers = userOffers.filter((o) => o.status === "draft")
  const completedOffers = userOffers.filter((o) => o.status === "completed")

  const incomingProposals = getIncomingProposals(user.id)
  const pendingConfirmations = getPendingConfirmations(user.id)
  const totalPendingExchanges = incomingProposals.length + pendingConfirmations.length

  const totalViews = userOffers.reduce((sum, offer) => sum + offer.views, 0)
  const totalFavorites = userOffers.reduce((sum, offer) => sum + offer.favorites, 0)

  const stats = [
    {
      title: "Ofertas Activas",
      value: publishedOffers.length,
      icon: Package,
      change: "+2 esta semana",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Vistas Totales",
      value: totalViews,
      icon: Eye,
      change: "+45 esta semana",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Favoritos",
      value: totalFavorites,
      icon: Heart,
      change: "+8 esta semana",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Intercambios",
      value: completedOffers.length,
      icon: TrendingUp,
      change: "+1 este mes",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "view",
      message: "Tu oferta 'MacBook Pro 2021' recibió 12 nuevas vistas",
      time: "Hace 2 horas",
      icon: Eye,
    },
    {
      id: "2",
      type: "favorite",
      message: "3 usuarios agregaron tu oferta a favoritos",
      time: "Hace 5 horas",
      icon: Heart,
    },
    {
      id: "3",
      type: "message",
      message: "Nuevo mensaje de Ana García sobre tu bicicleta",
      time: "Hace 1 día",
      icon: MessageSquare,
    },
    {
      id: "4",
      type: "completed",
      message: "Intercambio completado con Carlos Mendoza",
      time: "Hace 2 días",
      icon: CheckCircle2,
    },
  ]

  const achievements = [
    { title: "Primera Oferta", description: "Publicaste tu primera oferta", completed: true },
    { title: "Popular", description: "Alcanza 100 vistas totales", completed: totalViews >= 100, progress: totalViews },
    {
      title: "Favorito",
      description: "Recibe 20 favoritos",
      completed: totalFavorites >= 20,
      progress: totalFavorites,
    },
    {
      title: "Intercambiador",
      description: "Completa 5 intercambios",
      completed: false,
      progress: completedOffers.length,
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">Hola, {user.name}!</h1>
              <p className="text-muted-foreground">Bienvenido a tu panel de control</p>
            </div>
            <Button asChild size="lg">
              <Link href="/crear-oferta">
                <Plus className="mr-2 h-5 w-5" />
                Nueva Oferta
              </Link>
            </Button>
          </div>

          {/* User Stats Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reputación</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{user.reputation.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(user.reputation) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Award className="mr-1 h-3 w-3" />
                  Usuario Verificado
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {totalPendingExchanges > 0 && (
          <Card className="mb-8 border-orange-500/50 bg-orange-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Tienes {totalPendingExchanges} acción(es) pendiente(s)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {incomingProposals.length > 0 &&
                      `${incomingProposals.length} propuesta(s) de intercambio recibida(s). `}
                    {pendingConfirmations.length > 0 && `${pendingConfirmations.length} confirmación(es) pendiente(s).`}
                  </p>
                  <Button asChild>
                    <Link href="/intercambios">
                      <Repeat className="mr-2 h-4 w-4" />
                      Ver Intercambios
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs text-green-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Mantente al día con las últimas actualizaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Ver Toda la Actividad
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions & Achievements */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/crear-oferta">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Oferta
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/mis-ofertas">
                    <Package className="mr-2 h-4 w-4" />
                    Mis Ofertas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/intercambios">
                    <Repeat className="mr-2 h-4 w-4" />
                    Intercambios
                    {totalPendingExchanges > 0 && (
                      <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalPendingExchanges}
                      </Badge>
                    )}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/explorar">
                    <Eye className="mr-2 h-4 w-4" />
                    Explorar
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/perfil">
                    <Star className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Logros</CardTitle>
                <CardDescription>Tu progreso en la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {achievement.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{achievement.title}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{achievement.description}</p>
                    {!achievement.completed && achievement.progress !== undefined && (
                      <Progress value={(achievement.progress / 20) * 100} className="ml-6" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Offers */}
        {publishedOffers.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tus Ofertas Recientes</CardTitle>
                  <CardDescription>Ofertas publicadas recientemente</CardDescription>
                </div>
                <Button variant="outline" asChild className="bg-transparent">
                  <Link href="/mis-ofertas">Ver Todas</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {publishedOffers.slice(0, 3).map((offer) => (
                  <Link
                    key={offer.id}
                    href={`/oferta/${offer.id}`}
                    className="group relative rounded-lg overflow-hidden border border-border"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={offer.images[0] || "/placeholder.svg"}
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-sm line-clamp-1 mb-2">{offer.title}</h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {offer.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {offer.favorites}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
