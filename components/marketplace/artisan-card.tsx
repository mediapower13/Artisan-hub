import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Users, MessageCircle, CheckCircle } from "lucide-react"
import { WhatsAppCTACompact } from "@/components/providers/whatsapp-cta"
import { useAuth } from "@/contexts/auth-context"
import type { Artisan, Provider } from "@/lib/types"
import Link from "next/link"

interface ArtisanCardProps {
  artisan: Artisan | Provider
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { user } = useAuth()
  const initials = `${artisan.firstName[0]}${artisan.lastName[0]}`
  
  // Convert to Provider type for WhatsApp CTA (backward compatibility)
  const provider: Provider = {
    ...artisan,
    role: "artisan",
    fullName: `${artisan.firstName} ${artisan.lastName}`,
    availability: {
      isAvailable: true, // Default assumption for card display
      availableForWork: true, // Show all artisans as potentially available for work
      availableForLearning: true, // Show all artisans as potentially available for learning
      responseTime: "Usually responds within 24 hours"
    },
    pricing: {
      baseRate: undefined,
      learningRate: undefined,
      currency: "NGN"
    },
    whatsappNumber: "+234" + Math.random().toString().slice(2, 13), // Mock number for demo
    verificationStatus: artisan.verified ? "approved" : "pending",
    verificationEvidence: []
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
            <AvatarImage
              src={artisan.profileImage || "/placeholder.svg"}
              alt={`${artisan.firstName} ${artisan.lastName}`}
            />
            <AvatarFallback className="bg-unilorin-purple text-white text-sm sm:text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg truncate">
              {artisan.firstName} {artisan.lastName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{artisan.businessName}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">{artisan.rating.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">({artisan.totalReviews})</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            {artisan.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1 text-xs px-2 py-0.5">
                <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden sm:inline">Verified</span>
                <span className="sm:hidden">✓</span>
              </Badge>
            )}
            {/* Available for Learning badge */}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
              <span className="hidden sm:inline">Available for Learning</span>
              <span className="sm:hidden">Available</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {artisan.specialization.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
              {skill}
            </Badge>
          ))}
          {artisan.specialization.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{artisan.specialization.length - 3} more
            </Badge>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{artisan.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{artisan.experience} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{artisan.skills.length} skills offered</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9" asChild>
            <Link href={`/artisans/${artisan.id}`}>
              <span className="hidden sm:inline">View Profile</span>
              <span className="sm:hidden">Profile</span>
            </Link>
          </Button>
          <Button size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9" asChild>
            <Link href={`/artisans/${artisan.id}/skills`}>
              <span className="hidden sm:inline">View Skills</span>
              <span className="sm:hidden">Skills</span>
            </Link>
          </Button>
        </div>
        
        {/* WhatsApp CTA - only show if user is logged in as student */}
        {user && user.role === "student" && (
          <WhatsAppCTACompact
            provider={provider}
            student={{
              ...user,
              role: "student" as const,
              firstName: user.firstName || "Student",
              lastName: user.lastName || "User",
              phone: user.phone || "",
              studentId: user.studentId || "default-student-id",
              department: user.department || "Computer Science",
              level: String(user.level || "300"),
              enrolledSkills: [],
              password: "",
              createdAt: new Date(),
              updatedAt: new Date()
            }}
            serviceType="direct_service"
            className="bg-green-600 hover:bg-green-700 text-white h-8 sm:h-9 text-xs sm:text-sm"
          />
        )}
      </CardFooter>
    </Card>
  )
}
