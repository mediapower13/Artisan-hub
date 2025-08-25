import { NextResponse } from "next/server"
import { SupabaseService } from "@/lib/supabase"

export async function GET() {
  try {
    const categories = await SupabaseService.getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
