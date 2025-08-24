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
              <span className="text-sm font-medium">{artisan.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({artisan.totalReviews} reviews)</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {artisan.verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            {/* Available for Learning badge */}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              Available for Learning
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {artisan.specialization.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {artisan.specialization.length > 3 && (
            <Badge variant="outline" className="text-xs">
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

      <CardFooter className="pt-4 space-y-3">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/artisans/${artisan.id}/skills`}>View Skills</Link>
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
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        )}
      </CardFooter>
    </Card>
  )
}
