import { NextRequest, NextResponse } from "next/server";

// Simple in-memory user storage (shared with register)
const users = new Map();

// Add some default users for testing
users.set("test@example.com", {
  id: "user_1",
  email: "test@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  role: "student",
  phone: "1234567890"
});

users.set("artisan@example.com", {
  id: "user_2",
  email: "artisan@example.com",
  password: "password123",
  firstName: "Jane",
  lastName: "Smith",
  fullName: "Jane Smith",
  role: "artisan",
  phone: "0987654321"
});

export async function POST(req: NextRequest) {
  try {
    console.log("Login endpoint hit");
    
    const body = await req.json();
    console.log("Login data received:", { email: body.email });
    
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = users.get(email);
    if (!user || user.password !== password) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Login successful for:", email);

    // Create response
    const response = Response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });

    // Set session cookie
    const sessionToken = `session_${user.id}_${Date.now()}`;
    response.headers.set(
      'Set-Cookie',
      `auth-token=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
