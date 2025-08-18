import { type NextRequest, NextResponse } from "next/server"
import { getAllSkills } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let skills = await getAllSkills()

    if (category && category !== "All categories") {
      skills = skills.filter((skill) => skill.category === category)
    }

    if (search) {
      skills = skills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(search.toLowerCase()) ||
          skill.description.toLowerCase().includes(search.toLowerCase()) ||
          skill.category.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Skills API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
