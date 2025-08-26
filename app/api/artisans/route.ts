import { type NextRequest, NextResponse } from "next/server"
import { getAllProviders } from "@/lib/database-operations"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const verified = searchParams.get("verified")

    // Get providers from database
    const providers = await getAllProviders()

    // Filter providers based on search parameters
    let filteredProviders = providers
    
    if (location && location !== "All locations") {
      filteredProviders = filteredProviders.filter(p => p.location.includes(location))
    }
    
    if (verified === "true") {
      filteredProviders = filteredProviders.filter(p => p.verified)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProviders = filteredProviders.filter(p => 
        p.businessName.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.specialization.some(spec => spec.toLowerCase().includes(searchLower))
      )
    }

    // Transform providers to match expected artisan format
    let artisans = filteredProviders.map((provider: any) => ({
      id: provider.id,
      name: provider.fullName || provider.businessName,
      business_name: provider.business_name,
      description: provider.description,
      location: provider.location,
      skills: provider.specialization,
      experience: provider.experience,
      rating: provider.rating,
      total_reviews: provider.total_reviews,
      is_verified: provider.verified,
      verification_status: provider.verification_status,
      whatsapp_number: provider.whatsapp_number,
      email: provider.user?.email,
      phone: provider.user?.phone,
      profile_image: provider.user?.profile_image,
      availability: {
        isAvailable: provider.availability_is_available,
        availableForWork: provider.availability_available_for_work,
        availableForLearning: provider.availability_available_for_learning,
        responseTime: provider.availability_response_time
      },
      pricing: {
        baseRate: provider.pricing_base_rate,
        learningRate: provider.pricing_learning_rate,
        currency: provider.pricing_currency
      }
    }))

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      artisans = artisans.filter((artisan: any) =>
        artisan.name?.toLowerCase().includes(searchLower) ||
        artisan.business_name?.toLowerCase().includes(searchLower) ||
        artisan.description?.toLowerCase().includes(searchLower) ||
        (artisan.skills && artisan.skills.some((skill: string) => 
          skill.toLowerCase().includes(searchLower)
        ))
      )
    }

    return NextResponse.json({ artisans })
  } catch (error) {
    console.error("Artisans API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
