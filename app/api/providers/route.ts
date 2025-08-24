import { NextRequest, NextResponse } from "next/server"
import { createProvider, getAllProviders, getProviderById, updateProviderVerification } from "@/lib/database"
import { authUtils } from "@/lib/auth-utils"

// GET /api/providers - Get all providers with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const verificationStatus = searchParams.get('verification_status')
    const availability = searchParams.get('availability') === 'true'

    const filters = {
      ...(specialization && { specialization }),
      ...(verificationStatus && { verificationStatus }),
      ...(availability !== undefined && { availability })
    }

    const providers = await getAllProviders(Object.keys(filters).length > 0 ? filters : undefined)
    
    return NextResponse.json({
      success: true,
      data: providers
    })
  } catch (error) {
    console.error("[v0] Error fetching providers:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch providers" },
      { status: 500 }
    )
  }
}

// POST /api/providers - Create a new provider profile
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = await authUtils.verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      businessName,
      description,
      specialization,
      whatsappNumber,
      availability,
      pricing,
      verificationEvidence,
      experience
    } = body

    // Validate required fields
    if (!businessName || !description || !specialization || !Array.isArray(specialization)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create provider profile
    const result = await createProvider({
      userId: user.id,
      businessName,
      description,
      specialization,
      whatsappNumber,
      availability: availability || {
        isAvailable: true,
        availableForWork: true,
        availableForLearning: true,
        responseTime: "Usually responds within 24 hours"
      },
      pricing: pricing || {
        baseRate: undefined,
        learningRate: undefined,
        currency: "NGN"
      },
      verificationEvidence: verificationEvidence || [],
      experience: experience || 0
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Provider profile created successfully. Verification request submitted."
    })
  } catch (error) {
    console.error("[v0] Error creating provider:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create provider profile" },
      { status: 500 }
    )
  }
}
