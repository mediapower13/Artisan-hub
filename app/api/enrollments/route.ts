import { type NextRequest, NextResponse } from "next/server"
import { SupabaseService } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const providerId = searchParams.get("providerId")

    let enrollments = []

    if (studentId) {
      enrollments = await SupabaseService.getEnrollmentsByStudentId(studentId)
    } else if (providerId) {
      enrollments = await SupabaseService.getEnrollmentsByProviderId(providerId)
    } else {
      return NextResponse.json({ error: "Either studentId or providerId is required" }, { status: 400 })
    }

    // Transform enrollments to match expected format
    const transformedEnrollments = enrollments.map((enrollment: any) => ({
      id: enrollment.id,
      studentId: enrollment.student_id,
      skillId: enrollment.skill_id,
      artisanId: enrollment.provider_id, // Keep backward compatibility
      providerId: enrollment.provider_id,
      status: enrollment.status,
      progress: enrollment.progress,
      enrolledAt: enrollment.enrolled_at,
      completedAt: enrollment.completed_at,
      skill: enrollment.skill ? {
        id: enrollment.skill.id,
        title: enrollment.skill.title,
        description: enrollment.skill.description,
        category: enrollment.skill.category,
        difficulty: enrollment.skill.difficulty,
        duration: enrollment.skill.duration,
        price: enrollment.skill.price,
        images: enrollment.skill.images
      } : null,
      provider: enrollment.provider ? {
        id: enrollment.provider.id,
        name: enrollment.provider.user?.full_name || enrollment.provider.business_name,
        business_name: enrollment.provider.business_name,
        location: enrollment.provider.location,
        rating: enrollment.provider.rating,
        verified: enrollment.provider.verified,
        whatsapp_number: enrollment.provider.whatsapp_number
      } : null,
      student: enrollment.student ? {
        id: enrollment.student.id,
        name: enrollment.student.full_name,
        email: enrollment.student.email,
        phone: enrollment.student.phone,
        student_id: enrollment.student.student_id,
        department: enrollment.student.department,
        level: enrollment.student.level
      } : null
    }))

    return NextResponse.json({ enrollments: transformedEnrollments })
  } catch (error) {
    console.error("Enrollments API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, skillId, providerId, motivation } = await request.json()

    if (!studentId || !skillId || !providerId) {
      return NextResponse.json({ error: "Missing required fields: studentId, skillId, providerId" }, { status: 400 })
    }

    // Create new enrollment
    const enrollmentData = {
      student_id: studentId,
      skill_id: skillId,
      provider_id: providerId,
      status: 'pending' as const,
      progress: 0,
      enrolled_at: new Date().toISOString()
    }

    const newEnrollment = await SupabaseService.createEnrollment(enrollmentData)

    return NextResponse.json({ 
      success: true, 
      enrollment: {
        id: newEnrollment.id,
        studentId: newEnrollment.student_id,
        skillId: newEnrollment.skill_id,
        artisanId: newEnrollment.provider_id, // Backward compatibility
        providerId: newEnrollment.provider_id,
        status: newEnrollment.status,
        progress: newEnrollment.progress,
        enrolledAt: newEnrollment.enrolled_at
      }
    })
  } catch (error) {
    console.error("Enrollment creation API error:", error)
    
    // Handle unique constraint error (already enrolled)
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json({ error: "Already enrolled in this skill" }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
