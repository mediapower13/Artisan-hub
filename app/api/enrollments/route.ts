import { type NextRequest, NextResponse } from "next/server"
import type { Enrollment } from "@/lib/types"

// Mock enrollments storage (in a real app, this would be in a database)
const mockEnrollments: Enrollment[] = [
  {
    id: "1",
    studentId: "student1",
    skillId: "1",
    artisanId: "1",
    status: "active",
    progress: 65,
    enrolledAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    studentId: "student1",
    skillId: "2",
    artisanId: "2",
    status: "completed",
    progress: 100,
    enrolledAt: new Date("2023-12-01"),
    completedAt: new Date("2024-01-10"),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    let enrollments = mockEnrollments

    if (studentId) {
      enrollments = enrollments.filter((enrollment) => enrollment.studentId === studentId)
    }

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error("Enrollments API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, skillId, artisanId, motivation } = await request.json()

    if (!studentId || !skillId || !artisanId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if already enrolled
    const existingEnrollment = mockEnrollments.find((e) => e.studentId === studentId && e.skillId === skillId)

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled in this skill" }, { status: 400 })
    }

    const newEnrollment: Enrollment = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      skillId,
      artisanId,
      status: "pending",
      progress: 0,
      enrolledAt: new Date(),
    }

    mockEnrollments.push(newEnrollment)

    return NextResponse.json({ success: true, enrollment: newEnrollment })
  } catch (error) {
    console.error("Enrollment creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
