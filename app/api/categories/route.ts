import { NextResponse } from "next/server"
import { mockDatabase } from "@/lib/mock-data"

export async function GET() {
  try {
    const categories = await mockDatabase.getCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
