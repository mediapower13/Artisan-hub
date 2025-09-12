import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get verification requests by fetching pending providers
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        business_name,
        description,
        bio,
        specialization,
        experience,
        location,
        certificates,
        verification_status,
        verification_evidence,
        created_at,
        updated_at,
        users!providers_user_id_fkey (
          id,
          email,
          first_name,
          last_name,
          full_name,
          student_id,
          department
        )
      `)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching verification requests:", error)
      return NextResponse.json(
        { error: "Failed to fetch verification requests" },
        { status: 500 }
      )
    }

    // Transform the data to match the VerificationRequest interface
    const verificationRequests = providers?.map(provider => ({
      id: `vr-${provider.id}`,
      providerId: provider.id,
      providerName: provider.users?.full_name || 'Unknown',
      providerEmail: provider.users?.email || '',
      studentId: provider.users?.student_id || '',
      department: provider.users?.department || '',
      businessName: provider.business_name,
      businessDescription: provider.description,
      bio: provider.bio,
      specializations: provider.specialization || [],
      experienceYears: provider.experience,
      certificates: provider.certificates || [],
      evidenceFiles: (provider.verification_evidence || []).map((url: string) => ({
        url,
        type: url.includes('.pdf') ? 'certificate' as const : 'portfolio' as const
      })),
      status: provider.verification_status,
      submittedAt: new Date(provider.created_at),
      reviewedAt: undefined,
      reviewedBy: undefined,
      adminNotes: undefined
    })) || []

    return NextResponse.json({
      success: true,
      data: verificationRequests
    })

  } catch (error) {
    console.error("Error in verification requests API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, providerId, adminNotes } = await request.json()

    if (!action || !providerId) {
      return NextResponse.json(
        { error: "Missing required fields: action, providerId" },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Update the provider verification status
    const { data, error } = await supabase
      .from('providers')
      .update({
        verification_status: action === 'approve' ? 'approved' : 'rejected',
        verified: action === 'approve',
        updated_at: new Date().toISOString()
      })
      .eq('id', providerId)
      .select()

    if (error) {
      console.error("Error updating verification status:", error)
      return NextResponse.json(
        { error: "Failed to update verification status" },
        { status: 500 }
      )
    }

    // TODO: Send notification email to the artisan
    // You can implement email notifications here

    return NextResponse.json({
      success: true,
      message: `Provider ${action}d successfully`,
      data: data[0]
    })

  } catch (error) {
    console.error("Error in verification update:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
