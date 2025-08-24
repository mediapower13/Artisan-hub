import { NextRequest, NextResponse } from "next/server"
import { getVerificationRequests, getVerificationRequestById, updateProviderVerification } from "@/lib/database"
import { authUtils } from "@/lib/auth-utils"

// GET /api/admin/verifications - Get all verification requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = await authUtils.verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'

    const requests = await getVerificationRequests(status === 'all' ? undefined : status)
    
    return NextResponse.json({
      success: true,
      data: requests
    })
  } catch (error) {
    console.error("[v0] Error fetching verification requests:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch verification requests" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/verifications - Update verification request status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const user = await authUtils.verifyToken(token)
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { requestId, status, adminNotes } = body

    if (!requestId || !status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      )
    }

    // Get the verification request to find the provider ID
    const verificationRequest = await getVerificationRequestById(requestId)
    if (!verificationRequest) {
      return NextResponse.json(
        { success: false, error: "Verification request not found" },
        { status: 404 }
      )
    }

    // Update provider verification status
    const result = await updateProviderVerification(
      verificationRequest.providerId,
      status,
      user.id,
      adminNotes
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: `Provider ${status} successfully`
    })
  } catch (error) {
    console.error("[v0] Error updating verification:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update verification status" },
      { status: 500 }
    )
  }
}
