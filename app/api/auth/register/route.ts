import { NextRequest, NextResponse } from "next/server";

import { authUtils } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    const { email, password, firstName, lastName, phone, role } = userData;

    if (!email || !password || !firstName || !lastName || !phone || !role) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, firstName, lastName, phone, role" },
        { status: 400 }
      );
    }

    if (!["student", "artisan"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'student' or 'artisan'" },
        { status: 400 }
      );
    }

    // Check if user already exists in Supabase
    const existingUser = await authUtils.getUserByEmail(email)
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    console.log("Hashing password for user:", email)
    // Hash password
    const hashedPassword = await authUtils.hashPassword(password)

    console.log("Creating user in Supabase:", { email, role, firstName, lastName })
    // Create user in Supabase
    const fullName = `${firstName} ${lastName}`
    const newUser = await authUtils.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      fullName,
      phone,
      role,
      studentId: role === "student" ? userData.studentId || null : null,
      department: role === "student" ? userData.department || null : null,
      level: role === "student" ? userData.level || null : null,
    })

    if (!newUser) {
      console.error("Failed to create user - authUtils.createUser returned null")
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    console.log("User created successfully:", newUser.id)
    console.log("Generating JWT token")
    // Generate JWT token
    const token = await authUtils.generateToken(newUser)

    // Create response
    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      },
      token
    }, { status: 201 })
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    return response
  } catch (error: any) {
      console.error("Registration error:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
    );
  }
}