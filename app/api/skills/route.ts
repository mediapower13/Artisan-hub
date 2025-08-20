import { type NextRequest, NextResponse } from "next/server"
import { getAllSkills } from "@/lib/database"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const skillsData = await getAllSkills()
    let skills = skillsData || []

    if (category && category !== "All categories") {
      skills = skills.filter((skill: any) => skill.category === category)
    }

    if (search) {
      skills = skills.filter(
        (skill: any) =>
          skill.title?.toLowerCase().includes(search.toLowerCase()) ||
          skill.description?.toLowerCase().includes(search.toLowerCase()) ||
          skill.category?.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Skills API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
