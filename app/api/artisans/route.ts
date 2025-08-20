import { type NextRequest, NextResponse } from "next/server"
import { getAllArtisans } from "@/lib/database"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const verified = searchParams.get("verified")

    const artisansData = await getAllArtisans()
    let artisans = artisansData || []

    if (search) {
      artisans = artisans.filter(
        (artisan: any) =>
          artisan.name?.toLowerCase().includes(search.toLowerCase()) ||
          artisan.business_name?.toLowerCase().includes(search.toLowerCase()) ||
          (artisan.skills &&
            artisan.skills.some((skill: string) => skill.toLowerCase().includes(search.toLowerCase()))),
      )
    }

    if (location && location !== "All locations") {
      artisans = artisans.filter((artisan: any) => artisan.location?.toLowerCase().includes(location.toLowerCase()))
    }

    if (verified === "true") {
      artisans = artisans.filter((artisan: any) => artisan.is_verified)
    }

    return NextResponse.json({ artisans })
  } catch (error) {
    console.error("Artisans API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
