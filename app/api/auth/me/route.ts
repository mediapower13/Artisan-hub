import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Mock user database - in production, this would be from your database
const mockUsers = [
  {
    id: "user_1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    role: "student",
    phone: "1234567890",
    studentId: "ST001",
    department: "Computer Science",
    level: "400"
  },
  {
    id: "user_2",
    email: "artisan@example.com",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    role: "artisan",
    phone: "0987654321"
  }
]

export async function GET() {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("auth-token")?.value

    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // In a real app, you'd verify the token and get user from database
    // For now, return mock user data
    const user = mockUsers.find(u => u.email === "test@example.com") // Default to first user

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Return user data (excluding sensitive information)
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      studentId: user.studentId,
      department: user.department,
      level: user.level
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
