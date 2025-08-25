import { type NextRequest, NextResponse } from "next/server"
import { SupabaseService } from "@/lib/supabase"
import { authUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user from Supabase
    const user = await SupabaseService.getUserByEmail(email)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await authUtils.verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Get provider profile if user is an artisan
    let providerProfile = null
    if (user.role === 'artisan') {
      try {
        const providers = await SupabaseService.getProviders({ limit: 1 })
        providerProfile = providers.find((p: any) => p.user_id === user.id)
      } catch (error) {
        console.warn("Could not fetch provider profile:", error)
      }
    }

    const authUser = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      firstName: user.first_name,
      lastName: user.last_name,
      userType: user.role,
      role: user.role,
      studentId: user.student_id,
      department: user.department,
      level: user.level,
      phone: user.phone,
      profileImage: user.profile_image,
      provider: providerProfile ? {
        id: providerProfile.id,
        businessName: providerProfile.business_name,
        description: providerProfile.description,
        specialization: providerProfile.specialization,
        location: providerProfile.location,
        verified: providerProfile.verified,
        verificationStatus: providerProfile.verification_status
      } : null
    }

    const token = authUtils.generateToken(authUser)

    const response = NextResponse.json({
      success: true,
      user: authUser,
      token,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
