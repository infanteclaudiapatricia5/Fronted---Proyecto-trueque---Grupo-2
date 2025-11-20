import type { Metadata } from "next"
import { Users, MessageCircle, Award, TrendingUp } from "lucide-react"

export const metadata: Metadata = {
  title: "Comunidad | TruequeHub",
  description: "Únete a la comunidad de TruequeHub",
}

export default function ComunidadPage() {
  const stats = [
    { icon: Users, label: "Usuarios Activos", value: "15,000+" },
    { icon: MessageCircle, label: "Intercambios Diarios", value: "500+" },
    { icon: Award, label: "Calificación Promedio", value: "4.8/5" },
    { icon: TrendingUp, label: "Crecimiento Mensual", value: "+25%" },
  ]

  const testimonials = [
    {
      name: "María González",
      avatar: "MG",
      rating: 5,
      text: "Increíble plataforma! Intercambié mi laptop vieja por una bicicleta nueva. El proceso fue súper fácil y seguro.",
    },
    {
      name: "Carlos Rodríguez",
      avatar: "CR",
      rating: 5,
      text: "La comunidad es muy amable y confiable. He hecho más de 10 intercambios exitosos.",
    },
    {
      name: "Ana López",
      avatar: "AL",
      rating: 5,
      text: "Me encanta poder darle una segunda vida a las cosas que ya no uso. TruequeHub hace que sea muy sencillo.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nuestra Comunidad
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a miles de personas que están transformando la forma de intercambiar productos
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 text-center animate-fade-in hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros usuarios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 animate-fade-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para unirte?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Forma parte de una comunidad que valora la sostenibilidad y el intercambio justo
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Únete Ahora
          </a>
        </div>
      </div>
    </div>
  )
}
