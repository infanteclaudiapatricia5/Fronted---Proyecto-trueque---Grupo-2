"use client"

import * as React from "react"
import { Search, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const searchSuggestions = [
  "Laptop para diseño gráfico",
  "Bicicleta para principiantes",
  "Cámara profesional para fotografía",
  "Guitarra acústica en buen estado",
  "Libros de programación",
  "Consola de videojuegos",
]

export function AISearch() {
  const [query, setQuery] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSearch = () => {
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      setIsSearching(false)
      setShowSuggestions(false)
    }, 1500)
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative z-50">
      <div className="relative">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary animate-float">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold text-balance">Búsqueda Inteligente con IA</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Describe lo que buscas y nuestra IA te ayudará a encontrar los mejores productos para intercambiar
          </p>
        </div>

        {/* Search Box */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity animate-pulse-glow" />

          <div className="relative bg-card border-2 border-border rounded-2xl p-2 shadow-2xl transition-all duration-300 hover:shadow-primary/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center flex-1 gap-3 bg-background rounded-xl px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ej: Busco una laptop para edición de video o una bicicleta para ciudad..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSuggestions(query.length > 0)}
                  className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                disabled={isSearching}
                className="px-8 font-semibold text-base transition-all hover:scale-105 active:scale-95"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Buscando...
                  </span>
                ) : (
                  "Buscar"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Sugerencias de búsqueda
                </div>
              </div>
              <div className="p-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary",
                      "flex items-center gap-3 group",
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
