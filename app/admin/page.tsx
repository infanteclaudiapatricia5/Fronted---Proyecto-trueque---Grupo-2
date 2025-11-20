"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useOffers } from "@/lib/offers-context"
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Activity,
} from "lucide-react"
import Image from "next/image"

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { offers } = useOffers()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
    // In a real app, check if user has admin role
  }, [user, router])

  if (!user) {
    return null
  }

  // Mock data for admin panel
  const mockUsers = [
    {
      id: "1",
      name: "Carlos Mendoza",
      email: "carlos@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
      reputation: 4.8,
      offers: 5,
      exchanges: 12,
      status: "active",
      joinedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Ana García",
      email: "ana@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      reputation: 4.9,
      offers: 8,
      exchanges: 15,
      status: "active",
      joinedDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Luis Rodríguez",
      email: "luis@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=luis",
      reputation: 5.0,
      offers: 3,
      exchanges: 8,
      status: "active",
      joinedDate: "2024-03-10",
    },
    {
      id: "4",
      name: "María López",
      email: "maria@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      reputation: 4.7,
      offers: 6,
      exchanges: 10,
      status: "suspended",
      joinedDate: "2024-01-25",
    },
  ]

  const platformStats = [
    {
      title: "Total Usuarios",
      value: "1,234",
      change: "+12% este mes",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Ofertas Activas",
      value: offers.filter((o) => o.status === "published").length,
      change: "+8% esta semana",
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Intercambios Totales",
      value: "456",
      change: "+15% este mes",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Reportes Pendientes",
      value: "8",
      change: "-3 desde ayer",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ]

  const recentReports = [
    {
      id: "1",
      type: "offer",
      title: "Contenido inapropiado en oferta",
      reporter: "Juan Pérez",
      reported: "Oferta #1234",
      date: "Hace 2 horas",
      status: "pending",
    },
    {
      id: "2",
      type: "user",
      title: "Usuario sospechoso de fraude",
      reporter: "María González",
      reported: "Usuario #5678",
      date: "Hace 5 horas",
      status: "pending",
    },
    {
      id: "3",
      type: "offer",
      title: "Producto no coincide con descripción",
      reporter: "Pedro Martínez",
      reported: "Oferta #9012",
      date: "Hace 1 día",
      status: "resolved",
    },
  ]

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground">Gestiona usuarios, ofertas y modera la plataforma</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-xs text-green-500">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="offers">Ofertas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administra y modera usuarios de la plataforma</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Reputación</TableHead>
                        <TableHead>Ofertas</TableHead>
                        <TableHead>Intercambios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha Registro</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{user.reputation.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.offers}</TableCell>
                          <TableCell>{user.exchanges}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.status === "active"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-red-500/10 text-red-500"
                              }
                            >
                              {user.status === "active" ? "Activo" : "Suspendido"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.joinedDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verificar Usuario
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Suspender
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Gestión de Ofertas</CardTitle>
                    <CardDescription>Modera y administra las ofertas publicadas</CardDescription>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar ofertas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOffers.slice(0, 6).map((offer) => (
                    <Card key={offer.id} className="overflow-hidden group hover:shadow-lg transition-all">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <Image
                          src={offer.images[0] || "/placeholder.svg"}
                          alt={offer.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge className="absolute top-3 left-3 bg-primary/90">{offer.category}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-2">{offer.title}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={offer.userAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{offer.userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{offer.userName}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {offer.views}
                          </span>
                          <Badge
                            className={
                              offer.status === "published"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {offer.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Aprobar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Rechazar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Moderación</CardTitle>
                <CardDescription>Revisa y gestiona los reportes de usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{report.type === "offer" ? "Oferta" : "Usuario"}</Badge>
                          <Badge
                            className={
                              report.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-green-500/10 text-green-500"
                            }
                          >
                            {report.status === "pending" ? "Pendiente" : "Resuelto"}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-1">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Reportado por: {report.reporter} • {report.reported}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Resolver
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
