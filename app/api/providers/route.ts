import { NextResponse } from "next/server"
import { getAllProviders } from "@/lib/database-operations"

export async function GET() {
  try {
    const providers = await getAllProviders()
    return NextResponse.json({ providers })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch providers" }, 
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Provider creation is currently disabled" }, 
    { status: 503 }
  )
}
