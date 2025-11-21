"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useOffers } from "@/lib/offers-context"
import { useToast } from "@/hooks/use-toast"
import { validateFiles, formatFileSize, MAX_FILE_SIZE } from "@/lib/file-validation"
import { Loader2, Upload, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

const conditions = ["Nuevo", "Excelente", "Bueno", "Regular"]

export default function CreateOfferPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { createOffer, categories } = useOffers()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [condition, setCondition] = useState("")
  const [locationLabel, setLocationLabel] = useState("")
  const [latitude, setLatitude] = useState<number>(4.7110)
  const [longitude, setLongitude] = useState<number>(-74.0721)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.log("Geolocation error:", error)
        }
      )
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      const remainingSlots = 3 - imageFiles.length
      
      const validation = validateFiles(fileArray)
      
      if (validation.oversizedFiles.length > 0) {
        const fileNames = validation.oversizedFiles.map(f => f.name).join(", ")
        toast({
          title: "Archivos demasiado grandes",
          description: `Las siguientes imágenes superan los ${formatFileSize(MAX_FILE_SIZE)}: ${fileNames}`,
          variant: "destructive",
        })
      }
      
      if (validation.invalidTypeFiles.length > 0) {
        toast({
          title: "Tipo de archivo inválido",
          description: "Solo se permiten imágenes (JPG, PNG, GIF, WebP)",
          variant: "destructive",
        })
      }
      
      if (validation.hasErrors) {
        e.target.value = ""
        return
      }
      
      const filesToAdd = validation.validFiles.slice(0, remainingSlots)

      if (filesToAdd.length < validation.validFiles.length) {
        toast({
          title: "Límite de imágenes",
          description: "Solo puedes subir máximo 3 imágenes",
          variant: "destructive",
        })
      }

      setImageFiles([...imageFiles, ...filesToAdd])
      
      filesToAdd.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
      
      e.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear una oferta.",
        variant: "destructive",
      })
      return
    }

    if (!title || !description || !categoryId || !condition || !locationLabel) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    if (imageFiles.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const imagePromises = imageFiles.map((file) => {
        return new Promise<{ base64: string; nombre: string }>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              base64: reader.result as string,
              nombre: file.name,
            })
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })

      const images = await Promise.all(imagePromises)

      await createOffer({
        title,
        description,
        condition,
        categoryId,
        locationLabel,
        latitude,
        longitude,
        images,
        publish,
      })

      toast({
        title: publish ? "¡Oferta publicada!" : "Borrador guardado",
        description:
          publish
            ? "Tu oferta ha sido publicada exitosamente."
            : "Tu oferta ha sido guardada como borrador.",
      })

      router.push("/mis-ofertas")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la oferta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/mis-ofertas">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Mis Ofertas
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Crear Nueva Oferta</h1>
            <p className="text-muted-foreground">Completa los detalles de tu producto o servicio para intercambiar</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la Oferta</CardTitle>
              <CardDescription>Los campos marcados con * son obligatorios</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título *<span className="text-xs text-muted-foreground ml-2">(Máximo 100 caracteres)</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ej: MacBook Pro 2021 M1 - Excelente estado"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción *<span className="text-xs text-muted-foreground ml-2">(Máximo 500 caracteres)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu producto o servicio en detalle..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Estado *</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond} value={cond}>
                            {cond}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    placeholder="Ej: Ciudad de México"
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Coordenadas: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Imágenes</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Haz clic para subir imágenes o arrastra y suelta</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP • Máximo 5MB por imagen • Hasta 3 imágenes</p>
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar como Borrador"
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      "Publicar Oferta"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
