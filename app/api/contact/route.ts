import { NextRequest, NextResponse } from "next/server"
import { createContactRequest } from "@/lib/database"
import { authUtils } from "@/lib/auth-utils"

// POST /api/contact - Create a new contact request for WhatsApp CTA tracking
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = await authUtils.verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { providerId, serviceType, contactMethod, messagePreview } = body

    // Validate required fields
    if (!providerId || !serviceType || !['direct_service', 'skill_learning'].includes(serviceType)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Create contact request for tracking
    const result = await createContactRequest({
      studentId: user.id,
      providerId,
      serviceType,
      contactMethod: contactMethod || 'whatsapp',
      messagePreview
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Contact request tracked successfully"
    })
  } catch (error) {
    console.error("[v0] Error creating contact request:", error)
    return NextResponse.json(
      { success: false, error: "Failed to track contact request" },
      { status: 500 }
    )
  }
}
