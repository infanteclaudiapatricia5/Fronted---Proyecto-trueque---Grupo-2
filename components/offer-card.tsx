"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface OfferCardProps {
  id: string
  title: string
  category: string
  image: string
  location: string
  timeAgo: string
  userName: string
  userAvatar?: string
  userRating: number
  isFavorite?: boolean
  className?: string
}

export function OfferCard({
  id,
  title,
  category,
  image,
  location,
  timeAgo,
  userName,
  userAvatar,
  userRating,
  isFavorite = false,
  className,
}: OfferCardProps) {
  const [favorite, setFavorite] = React.useState(isFavorite)
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/oferta/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className={cn("object-cover transition-transform duration-500", isHovered && "scale-110")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="secondary"
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full shadow-lg transition-all duration-300 z-10",
              favorite ? "bg-destructive text-destructive-foreground" : "bg-background/80 backdrop-blur-sm",
            )}
            onClick={(e) => {
              e.preventDefault()
              setFavorite(!favorite)
            }}
          >
            <Heart className={cn("h-4 w-4 transition-all", favorite && "fill-current")} />
          </Button>

          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm">{category}</Badge>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2 text-balance group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarImage src={userAvatar || "/placeholder.svg"} />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{userRating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full transition-all hover:scale-105 active:scale-95">
          <Link href={`/oferta/${id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
