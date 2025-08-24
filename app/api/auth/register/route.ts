import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/lib/auth-utils"
import { mockSql } from "@/lib/mock-database"

const sql = mockSql

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const requiredFields = ["fullName", "email", "password", "userType"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    if (!["student", "artisan"].includes(userData.userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    const hashedPassword = await authUtils.hashPassword(userData.password)

    const result = await sql`
      INSERT INTO users (email, full_name, password, user_type)
      VALUES (${userData.email}, ${userData.fullName}, ${hashedPassword}, ${userData.userType})
      RETURNING id, email, full_name, user_type, created_at
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const newUser = result[0] as {
      id: string
      email: string
      full_name: string
      user_type: "student" | "artisan"
      created_at: string
    }

    if (userData.userType === "artisan" && userData.businessName) {
      await sql`
        INSERT INTO artisan_profiles (
          user_id, business_name, description, location, phone, 
          skills, experience_years, is_verified
        )
        VALUES (
          ${newUser.id}, ${userData.businessName}, ${userData.description || ""}, 
          ${userData.location || ""}, ${userData.phone || ""}, 
          ${userData.skills || []}, ${userData.experienceYears || 0}, false
        )
      `
    }

    const authUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name,
      userType: newUser.user_type,
      role: newUser.user_type, // Map userType to role for compatibility
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
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
