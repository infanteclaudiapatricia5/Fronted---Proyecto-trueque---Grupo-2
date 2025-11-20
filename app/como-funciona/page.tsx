import type { Metadata } from "next"
import { Search, MessageSquare, Handshake, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Cómo Funciona | TruequeHub",
  description: "Aprende cómo funciona TruequeHub y comienza a intercambiar hoy",
}

export default function ComoFuncionaPage() {
  const steps = [
    {
      icon: Search,
      title: "Busca lo que necesitas",
      description:
        "Usa nuestra búsqueda inteligente con IA para encontrar productos que te interesen o publica lo que tienes para ofrecer.",
    },
    {
      icon: MessageSquare,
      title: "Conecta con otros usuarios",
      description: "Envía mensajes, negocia los términos del intercambio y conoce a la comunidad de TruequeHub.",
    },
    {
      icon: Handshake,
      title: "Realiza el intercambio",
      description: "Acuerda un lugar seguro para el intercambio y confirma la transacción en la plataforma.",
    },
    {
      icon: Star,
      title: "Califica la experiencia",
      description: "Deja una reseña y ayuda a construir una comunidad confiable y transparente.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ¿Cómo funciona TruequeHub?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intercambiar nunca fue tan fácil. Sigue estos simples pasos y comienza a hacer trueques hoy mismo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="bg-card border border-border rounded-xl p-6 h-full transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="mb-4 mt-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están intercambiando productos de forma segura y sencilla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Crear Cuenta Gratis
            </a>
            <a
              href="/explorar"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explorar Productos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
