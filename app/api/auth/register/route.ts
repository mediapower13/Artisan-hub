import { NextRequest, NextResponse } from "next/server";

// Mock user database
let mockUsers: any[] = [];

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

    // Check if user already exists in mock database
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create mock user
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      phone,
      role,
      student_id: role === "student" ? userData.studentId || null : null,
      department: role === "student" ? userData.department || null : null,
      level: role === "student" ? userData.level || null : null,
      created_at: new Date().toISOString()
    };

    // Add to mock database
    mockUsers.push(mockUser);

    console.log('Mock registration successful for:', email);

    // Create a simple response with session token
    const response = NextResponse.json({
      message: "Registration successful",
      user: {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.full_name,
        role: mockUser.role
      }
    }, { status: 201 });

    // Set auth cookie
    response.cookies.set("auth-token", `session_${mockUser.id}_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
