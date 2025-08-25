import { type NextRequest, NextResponse } from "next/server"
import { SupabaseService } from "@/lib/supabase"
import { authUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const requiredFields = ["fullName", "email", "password", "userType"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (!["student", "artisan", "admin"].includes(userData.userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    // Validate student-specific fields
    if (userData.userType === "student") {
      if (!userData.studentId || !userData.department || !userData.level) {
        return NextResponse.json({ 
          error: "Student ID, department, and level are required for students" 
        }, { status: 400 })
      }
    }

    // Validate artisan-specific fields
    if (userData.userType === "artisan") {
      if (!userData.businessName || !userData.location || !userData.phone) {
        return NextResponse.json({ 
          error: "Business name, location, and phone are required for artisans" 
        }, { status: 400 })
      }
    }

    const hashedPassword = await authUtils.hashPassword(userData.password)

    // Split full name into first and last name
    const nameParts = userData.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

    // Create user
    const newUserData = {
      email: userData.email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      full_name: userData.fullName,
      phone: userData.phone || '',
      role: userData.userType as 'student' | 'artisan' | 'admin',
      student_id: userData.studentId || null,
      department: userData.department || null,
      level: userData.level || null,
      profile_image: null
    }

    const newUser = await SupabaseService.createUser(newUserData)

    // Create provider profile if user is an artisan
    let providerProfile = null
    if (userData.userType === "artisan") {
      const providerData = {
        user_id: newUser.id,
        business_name: userData.businessName,
        description: userData.description || '',
        specialization: userData.skills || [],
        experience: userData.experienceYears || 0,
        location: userData.location,
        rating: 0,
        total_reviews: 0,
        verified: false,
        verification_status: 'pending' as const,
        verification_evidence: [],
        whatsapp_number: userData.whatsappNumber || userData.phone || null,
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: true,
        availability_response_time: 'Usually responds within 24 hours',
        pricing_base_rate: userData.baseRate || null,
        pricing_learning_rate: userData.learningRate || null,
        pricing_currency: 'NGN'
      }

      providerProfile = await SupabaseService.createProvider(providerData)
    }

    const authUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      userType: newUser.role,
      role: newUser.role,
      studentId: newUser.student_id,
      department: newUser.department,
      level: newUser.level,
      phone: newUser.phone,
      profileImage: newUser.profile_image,
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
    console.error("Registration API error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("duplicate key") || error.message.includes("already exists")) {
        return NextResponse.json({ error: "Email or Student ID already exists" }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
