import { type NextRequest, NextResponse } from "next/server"
import { getAllSkills } from "@/lib/database-operations"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")
    const maxPrice = searchParams.get("maxPrice")

    // Get all skills from database
    const allSkills = await getAllSkills()
    
    // Filter skills based on search parameters
    let filteredSkills = allSkills
    
    if (category && category !== "All categories") {
      filteredSkills = filteredSkills.filter(skill => skill.category === category)
    }
    
    if (difficulty && difficulty !== "all") {
      filteredSkills = filteredSkills.filter(skill => skill.difficulty === difficulty)
    }
    
    if (maxPrice) {
      filteredSkills = filteredSkills.filter(skill => skill.price <= parseInt(maxPrice))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredSkills = filteredSkills.filter(skill => 
        skill.title.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Transform skills to match expected format (already includes instructor info)
    let skills = filteredSkills.map((skill: any) => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      difficulty: skill.difficulty,
      duration: skill.duration,
      price: skill.price,
      maxStudents: skill.maxStudents,
      currentStudents: skill.currentStudents,
      images: skill.images || [],
      syllabus: skill.syllabus || [],
      requirements: skill.requirements || [],
      instructor: skill.instructor,
      createdAt: skill.createdAt,
      updatedAt: skill.updatedAt
    }))

    return NextResponse.json({ skills })
  } catch (error) {
    console.error("Skills API error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
