"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { AISearch } from "@/components/ai-search"
import { OfferCard } from "@/components/offer-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, SlidersHorizontal } from "lucide-react"

const categories = [
  { id: "all", name: "Todas", count: 2543 },
  { id: "electronics", name: "Electrónica", count: 456 },
  { id: "home", name: "Hogar y Jardín", count: 789 },
  { id: "sports", name: "Deportes", count: 234 },
  { id: "books", name: "Libros", count: 567 },
  { id: "clothing", name: "Ropa y Accesorios", count: 345 },
  { id: "toys", name: "Juguetes", count: 152 },
]

const conditions = [
  { id: "all", name: "Todas" },
  { id: "new", name: "Nuevo" },
  { id: "like-new", name: "Como Nuevo" },
  { id: "good", name: "Buen Estado" },
  { id: "used", name: "Usado" },
]

const allOffers = [
  {
    id: "1",
    title: "Laptop Gaming MSI",
    description:
      "Laptop gaming de alto rendimiento, RTX 3060, 16GB RAM, perfecto estado. Busco cambiar por MacBook Pro.",
    category: "Electrónica",
    image: "/macbook-pro-laptop.png",
    location: "Bogotá",
    timeAgo: "Hace 2 horas",
    userName: "Juan Martínez",
    userRating: 4.8,
    condition: "new",
    badge: "NUEVO",
  },
  {
    id: "2",
    title: "Bicicleta de Montaña Trek",
    description: "Bicicleta Trek X-Caliber 8, rodada 29, suspensión delantera. Poco uso, excelente para trails.",
    category: "Deportes",
    image: "/mountain-bike-bicycle.jpg",
    location: "Medellín",
    timeAgo: "Hace 5 horas",
    userName: "Ana López",
    userRating: 4.9,
    condition: "like-new",
    badge: "POPULAR",
  },
  {
    id: "3",
    title: "Cámara Canon EOS R6",
    description: "Cámara mirrorless profesional con lente 24-105mm. Poco uso.",
    category: "Fotografía",
    image: "/canon-camera-professional.jpg",
    location: "Cali",
    timeAgo: "Hace 1 día",
    userName: "Luis Rodríguez",
    userRating: 5.0,
    condition: "new",
    badge: "NUEVO",
  },
  {
    id: "4",
    title: "Guitarra Eléctrica Fender",
    description: "Fender Stratocaster American Standard, color sunburst.",
    category: "Música",
    image: "/fender-stratocaster-guitar.jpg",
    location: "Barranquilla",
    timeAgo: "Hace 3 horas",
    userName: "María López",
    userRating: 4.7,
    condition: "good",
  },
]

export default function ExplorarPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [showFilters, setShowFilters] = useState(true)

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"])
    } else {
      const newCategories = selectedCategories.filter((c) => c !== "all")
      if (selectedCategories.includes(categoryId)) {
        const filtered = newCategories.filter((c) => c !== categoryId)
        setSelectedCategories(filtered.length === 0 ? ["all"] : filtered)
      } else {
        setSelectedCategories([...newCategories, categoryId])
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* AI Search Section */}
      <section className="relative overflow-visible bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 py-12 pb-24 z-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="container mx-auto px-4">
          <AISearch />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${showFilters ? "w-64" : "w-0"} flex-shrink-0 transition-all duration-300 overflow-hidden`}
          >
            <div className="sticky top-4 space-y-6">
              {/* Categories */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Categorías</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label
                          htmlFor={category.id}
                          className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Condición</h3>
                <RadioGroup value={selectedCondition} onValueChange={setSelectedCondition}>
                  <div className="space-y-3">
                    {conditions.map((condition) => (
                      <div key={condition.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={condition.id} id={`condition-${condition.id}`} />
                        <Label
                          htmlFor={`condition-${condition.id}`}
                          className="text-sm font-normal cursor-pointer hover:text-primary transition-colors"
                        >
                          {condition.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </h3>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    <SelectItem value="bogota">Bogotá</SelectItem>
                    <SelectItem value="medellin">Medellín</SelectItem>
                    <SelectItem value="cali">Cali</SelectItem>
                    <SelectItem value="barranquilla">Barranquilla</SelectItem>
                    <SelectItem value="cartagena">Cartagena</SelectItem>
                    <SelectItem value="bucaramanga">Bucaramanga</SelectItem>
                    <SelectItem value="pereira">Pereira</SelectItem>
                    <SelectItem value="manizales">Manizales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>

          {/* Offers Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Productos Disponibles</h2>
                <p className="text-muted-foreground">{allOffers.length} productos encontrados</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? "Ocultar" : "Mostrar"} Filtros
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOffers.map((offer, index) => (
                <div
                  key={offer.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                >
                  <OfferCard {...offer} />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
