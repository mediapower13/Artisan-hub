import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ enrollments: [] })
}

export async function POST() {
  return NextResponse.json(
    { error: "Enrollment system is currently disabled" }, 
    { status: 503 }
  )
}
