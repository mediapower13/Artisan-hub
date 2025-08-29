import { NextRequest, NextResponse } from "next/server";

// Mock users for testing (in production, this would come from a database)
const mockUsers = [
  {
    id: "user_1",
    email: "test@example.com",
    password: "password123",
    first_name: "John",
    last_name: "Doe",
    full_name: "John Doe",
    role: "student",
    phone: "1234567890",
    student_id: "ST001",
    department: "Computer Science",
    level: "400"
  },
  {
    id: "user_2",
    email: "artisan@example.com",
    password: "password123",
    first_name: "Jane",
    last_name: "Smith",
    full_name: "Jane Smith",
    role: "artisan",
    phone: "0987654321",
    student_id: null,
    department: null,
    level: null
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in mock database
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Simple password check (in production, use proper password verification)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session response
    const userResponse = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phone: user.phone,
      studentId: user.student_id,
      department: user.department,
      level: user.level
    };

    console.log('Mock login successful for:', email);

    // Create a simple response with session token
    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token: `session_${user.id}_${Date.now()}`
    });

    // Set auth cookie
    response.cookies.set("auth-token", `session_${user.id}_${Date.now()}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
