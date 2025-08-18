"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SkillCard } from "@/components/skills/skill-card"
import { SearchFilters, type FilterState } from "@/components/marketplace/search-filters"
import { Button } from "@/components/ui/button"
import { mockDatabase } from "@/lib/mock-data"
import type { Skill, Artisan, Category } from "@/lib/types"
import { Grid, List } from "lucide-react"

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skillsData, artisansData, categoriesData] = await Promise.all([
          mockDatabase.getSkills(),
          mockDatabase.getArtisans(),
          mockDatabase.getCategories(),
        ])
        setSkills(skillsData)
        setFilteredSkills(skillsData)
        setArtisans(artisansData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to load skills data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSkills(skills)
      return
    }

    const filtered = skills.filter(
      (skill) =>
        skill.title.toLowerCase().includes(query.toLowerCase()) ||
        skill.description.toLowerCase().includes(query.toLowerCase()) ||
        skill.category.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredSkills(filtered)
  }

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...skills]

    if (filters.category && filters.category !== "All categories") {
      filtered = filtered.filter((skill) => skill.category === filters.category)
    }

    if (filters.experience && filters.experience !== "Any experience") {
      // Filter by difficulty level as a proxy for experience requirement
      const difficultyMap: { [key: string]: string[] } = {
        "1-2": ["beginner"],
        "3-5": ["beginner", "intermediate"],
        "5+": ["intermediate", "advanced"],
      }

      if (difficultyMap[filters.experience]) {
        filtered = filtered.filter((skill) => difficultyMap[filters.experience].includes(skill.difficulty))
      }
    }

    setFilteredSkills(filtered)
  }

  const getArtisanById = (artisanId: string) => artisans.find((a) => a.id === artisanId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading skills...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skills Learning Platform</h1>
          <p className="text-muted-foreground">
            Discover and learn new skills from expert artisans in the UNILORIN community
          </p>
        </div>

        <div className="space-y-6">
          <SearchFilters categories={categories} onSearch={handleSearch} onFilterChange={handleFilterChange} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSkills.length} of {skills.length} skills
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {filteredSkills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No skills found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilteredSkills(skills)
                  handleSearch("")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredSkills.map((skill) => {
                const artisan = getArtisanById(skill.artisanId)
                return <SkillCard key={skill.id} skill={skill} artisan={artisan} showArtisan={true} />
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
