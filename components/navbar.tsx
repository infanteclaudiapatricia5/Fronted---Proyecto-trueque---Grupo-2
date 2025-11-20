"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Package, User, Bell, LogOut, Settings, Heart, Repeat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useExchanges } from "@/lib/exchanges-context"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { user, logout } = useAuth()
  const { getIncomingProposals, getPendingConfirmations } = useExchanges()
  const router = useRouter()

  const incomingCount = user ? getIncomingProposals(user.id).length : 0
  const confirmationsCount = user ? getPendingConfirmations(user.id).length : 0
  const totalPending = incomingCount + confirmationsCount

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Package className="h-8 w-8 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TruequeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 ml-8">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Inicio
              </Link>
              <Link href="/explorar" className="text-sm font-medium transition-colors hover:text-primary">
                Explorar
              </Link>
              <Link href="/como-funciona" className="text-sm font-medium transition-colors hover:text-primary">
                Cómo Funciona
              </Link>
              <Link href="/comunidad" className="text-sm font-medium transition-colors hover:text-primary">
                Comunidad
              </Link>
              {user && (
                <>
                  <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <Link href="/mis-ofertas" className="text-sm font-medium transition-colors hover:text-primary">
                    Mis Ofertas
                  </Link>
                  <Link
                    href="/intercambios"
                    className="text-sm font-medium transition-colors hover:text-primary relative"
                  >
                    Intercambios
                    {totalPending > 0 && (
                      <Badge className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalPending}
                      </Badge>
                    )}
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {totalPending > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {totalPending}
                    </Badge>
                  )}
                </Button>
                <ThemeToggle />
                <Button asChild className="hidden md:flex">
                  <Link href="/crear-oferta">Publicar Oferta</Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/intercambios" className="cursor-pointer">
                        <Repeat className="mr-2 h-4 w-4" />
                        Intercambios
                        {totalPending > 0 && (
                          <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {totalPending}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favoritos" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Favoritos
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/configuracion" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" asChild className="hidden md:flex">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="hidden md:flex">
                  <Link href="/signup">Registrarse</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                    Inicio
                  </Link>
                  <Link href="/explorar" className="text-lg font-medium transition-colors hover:text-primary">
                    Explorar
                  </Link>
                  <Link href="/como-funciona" className="text-lg font-medium transition-colors hover:text-primary">
                    Cómo Funciona
                  </Link>
                  <Link href="/comunidad" className="text-lg font-medium transition-colors hover:text-primary">
                    Comunidad
                  </Link>
                  {user ? (
                    <>
                      <Link href="/dashboard" className="text-lg font-medium transition-colors hover:text-primary">
                        Dashboard
                      </Link>
                      <Link href="/mis-ofertas" className="text-lg font-medium transition-colors hover:text-primary">
                        Mis Ofertas
                      </Link>
                      <Link
                        href="/intercambios"
                        className="text-lg font-medium transition-colors hover:text-primary flex items-center justify-between"
                      >
                        Intercambios
                        {totalPending > 0 && (
                          <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">{totalPending}</Badge>
                        )}
                      </Link>
                      <Link href="/perfil" className="text-lg font-medium transition-colors hover:text-primary">
                        Mi Perfil
                      </Link>
                      <Button asChild className="w-full mt-4">
                        <Link href="/crear-oferta">Publicar Oferta</Link>
                      </Button>
                      <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full mt-4">
                        <Link href="/login">Iniciar Sesión</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href="/signup">Registrarse</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
