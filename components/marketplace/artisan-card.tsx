import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users } from "lucide-react"
import type { Artisan } from "@/lib/types"
import Link from "next/link"

interface ArtisanCardProps {
  artisan: Artisan
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const initials = `${artisan.firstName[0]}${artisan.lastName[0]}`

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={artisan.profileImage || "/placeholder.svg"}
              alt={`${artisan.firstName} ${artisan.lastName}`}
            />
            <AvatarFallback className="bg-unilorin-purple text-white text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {artisan.firstName} {artisan.lastName}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{artisan.businessName}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{artisan.rating}</span>
              <span className="text-sm text-muted-foreground">({artisan.totalReviews} reviews)</span>
            </div>
          </div>
          {artisan.verified && (
            <Badge {...({ variant: "secondary" } as any)} className="bg-green-100 text-green-800">
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {artisan.specialization.slice(0, 3).map((skill, index) => (
            <Badge key={index} {...({ variant: "outline" } as any)} className="text-xs">
              {skill}
            </Badge>
          ))}
          {artisan.specialization.length > 3 && (
            <Badge {...({ variant: "outline" } as any)} className="text-xs">
              +{artisan.specialization.length - 3} more
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{artisan.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{artisan.experience} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{artisan.skills.length} skills offered</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <div className="flex space-x-2 w-full">
          <Button {...({ variant: "outline", size: "sm" } as any)} className="flex-1 bg-transparent" asChild>
            <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
          </Button>
          <Button {...({ size: "sm" } as any)} className="flex-1" asChild>
            <Link href={`/artisans/${artisan.id}/skills`}>View Skills</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
