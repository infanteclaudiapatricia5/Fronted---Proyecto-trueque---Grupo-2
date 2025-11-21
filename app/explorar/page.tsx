"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { AISearch } from "@/components/ai-search"
import { OfferCard } from "@/components/offer-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, SlidersHorizontal, Loader2 } from "lucide-react"
import { useOffers } from "@/lib/offers-context"

const conditions = [
  { id: "all", name: "Todas" },
  { id: "Nuevo", name: "Nuevo" },
  { id: "Excelente", name: "Excelente" },
  { id: "Bueno", name: "Bueno" },
  { id: "Regular", name: "Regular" },
]

export default function ExplorarPage() {
  const { offers, categories, isLoading, getPublishedOffers } = useOffers()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"])
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [showFilters, setShowFilters] = useState(true)

  const publishedOffers = getPublishedOffers()

  const categoriesWithCounts = useMemo(() => {
    const counts = new Map<string, number>()
    publishedOffers.forEach((offer) => {
      const catId = offer.categoryId || "unknown"
      counts.set(catId, (counts.get(catId) || 0) + 1)
    })
    
    return [
      { id: "all", name: "Todas", count: publishedOffers.length },
      ...categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: counts.get(cat.id) || 0,
      })),
    ]
  }, [categories, publishedOffers])

  const filteredOffers = useMemo(() => {
    let filtered = publishedOffers

    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((offer) => 
        offer.categoryId && selectedCategories.includes(offer.categoryId)
      )
    }

    if (selectedCondition !== "all") {
      filtered = filtered.filter((offer) => offer.condition === selectedCondition)
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter((offer) => 
        offer.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    return filtered
  }, [publishedOffers, selectedCategories, selectedCondition, selectedLocation])

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const created = new Date(dateString)
    const diffMs = now.getTime() - created.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    return 'Hace poco'
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
                  {categoriesWithCounts.map((category) => (
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
                <p className="text-muted-foreground">{filteredOffers.length} productos encontrados</p>
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

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No se encontraron ofertas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
                  >
                    <OfferCard
                      id={offer.id}
                      title={offer.title}
                      category={offer.category}
                      image={offer.images[0] || "/placeholder.svg"}
                      location={offer.location}
                      timeAgo={formatTimeAgo(offer.createdAt)}
                      userName={offer.userName}
                      userAvatar={offer.userAvatar}
                      userRating={offer.userRating}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
