import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package2, Search, Handshake, CheckCircle2, Users, MessageCircle, Star } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-40 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-40 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 zoom-in-50 duration-700">
            Intercambia lo que tienes por lo que necesitas
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 text-pretty animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
          >
            Únete a la comunidad de intercambio más grande. Encuentra productos, conecta con personas y realiza trueques
            de forma segura y sencilla.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "300ms", animationFillMode: "backwards" }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link href="/explorar">
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link href="#como-funciona">Cómo Funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15,000+", label: "Usuarios Activos" },
              { value: "50,000+", label: "Productos Disponibles" },
              { value: "25,000+", label: "Intercambios Exitosos" },
              { value: "4.8/5", label: "Calificación Promedio" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo funciona TruequeHub?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Intercambiar nunca fue tan fácil. Sigue estos simples pasos y comienza a hacer trueques hoy mismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Package2,
                title: "Publica tu producto",
                description: "Sube fotos y describe lo que quieres intercambiar",
              },
              {
                icon: Search,
                title: "Busca lo que necesitas",
                description: "Usa nuestra búsqueda inteligente para encontrar coincidencias",
              },
              {
                icon: Handshake,
                title: "Conecta y negocia",
                description: "Chatea con otros usuarios y acuerda los detalles",
              },
              {
                icon: CheckCircle2,
                title: "Confirma el intercambio",
                description: "Ambas partes confirman y completan el trueque",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex p-6 rounded-2xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:-translate-y-2 transition-all duration-300">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm text-pretty">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Únete a nuestra comunidad</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Miles de usuarios ya están intercambiando productos y construyendo una economía más sostenible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Comunidad activa",
                description: "Más de 15,000 usuarios intercambiando productos cada día",
                color: "text-blue-500",
              },
              {
                icon: MessageCircle,
                title: "Chat en tiempo real",
                description: "Comunícate directamente con otros usuarios de forma segura",
                color: "text-green-500",
              },
              {
                icon: Star,
                title: "Sistema de reputación",
                description: "Calificaciones y reseñas para intercambios confiables",
                color: "text-yellow-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
              >
                <div className="inline-flex p-4 rounded-xl bg-muted mb-4" style={{ color: feature.color }}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">¿Listo para comenzar a intercambiar?</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Únete a miles de usuarios que ya están intercambiando productos de forma sostenible y económica.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="text-lg px-8 transition-all hover:scale-105 active:scale-95">
                <Link href="/signup">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TruequeHub</span>
              </div>
              <p className="text-sm text-muted-foreground text-pretty">
                La plataforma de intercambio más confiable y fácil de usar. Conectamos personas para hacer trueques de
                forma segura.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/explorar" className="hover:text-primary transition-colors">
                    Explorar
                  </Link>
                </li>
                <li>
                  <Link href="#como-funciona" className="hover:text-primary transition-colors">
                    Cómo Funciona
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Seguridad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Reportar Problema
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Accesibilidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 TruequeHub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
