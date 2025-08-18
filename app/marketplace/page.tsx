"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArtisanCard } from "@/components/marketplace/artisan-card"
import { SearchFilters, type FilterState } from "@/components/marketplace/search-filters"
import { CategoryGrid } from "@/components/marketplace/category-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockDatabase } from "@/lib/mock-data"
import type { Artisan, Category } from "@/lib/types"
import { Grid, List, Users, Star, MapPin, Clock, TrendingUp } from "lucide-react"

export default function MarketplacePage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [filteredArtisans, setFilteredArtisans] = useState<Artisan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalArtisans: 0,
    totalSkills: 0,
    avgRating: 0,
    activeToday: 0
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artisansData, categoriesData] = await Promise.all([
          mockDatabase.getArtisans(),
          mockDatabase.getCategories(),
        ])
        setArtisans(artisansData)
        setFilteredArtisans(artisansData)
        setCategories(categoriesData)
        
        // Calculate stats
        setStats({
          totalArtisans: artisansData.length,
          totalSkills: artisansData.reduce((acc, artisan) => acc + artisan.skills.length, 0),
          avgRating: artisansData.reduce((acc, artisan) => acc + artisan.rating, 0) / artisansData.length,
          activeToday: Math.floor(artisansData.length * 0.7) // Mock 70% active today
        })
      } catch (error) {
        console.error("Failed to load marketplace data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredArtisans(artisans)
      return
    }

    const filtered = artisans.filter(
      (artisan) =>
        artisan.firstName.toLowerCase().includes(query.toLowerCase()) ||
        artisan.lastName.toLowerCase().includes(query.toLowerCase()) ||
        artisan.businessName.toLowerCase().includes(query.toLowerCase()) ||
        artisan.specialization.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredArtisans(filtered)
  }

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...artisans]

    if (filters.category && filters.category !== "All categories") {
      filtered = filtered.filter((artisan) =>
        artisan.specialization.some(
          (skill) => categories.find((cat) => cat.name === filters.category)?.name === filters.category,
        ),
      )
    }

    if (filters.location && filters.location !== "All locations") {
      filtered = filtered.filter((artisan) => artisan.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.experience && filters.experience !== "Any experience") {
      const [min, max] = filters.experience.includes("+")
        ? [Number.parseInt(filters.experience), Number.POSITIVE_INFINITY]
        : filters.experience.split("-").map(Number)

      filtered = filtered.filter(
        (artisan) => artisan.experience >= min && (max === undefined || artisan.experience <= max),
      )
    }

    if (filters.rating && filters.rating !== "Any rating") {
      const minRating = Number.parseFloat(filters.rating.replace("+", ""))
      filtered = filtered.filter((artisan) => artisan.rating >= minRating)
    }

    if (filters.verified) {
      filtered = filtered.filter((artisan) => artisan.verified)
    }

    setFilteredArtisans(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading marketplace...</p>
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
          <h1 className="text-3xl font-bold mb-2">Artisan Marketplace</h1>
          <p className="text-muted-foreground">
            Discover skilled artisans and learn new skills in the UNILORIN community
          </p>
        </div>

        <Tabs defaultValue="artisans" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="artisans">Browse Artisans</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="artisans" className="space-y-6">
            <SearchFilters categories={categories} onSearch={handleSearch} onFilterChange={handleFilterChange} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredArtisans.length} of {artisans.length} artisans
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

            {filteredArtisans.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No artisans found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleFilterChange({
                      category: "All categories",
                      location: "All locations",
                      experience: "Any experience",
                      rating: "Any rating",
                      verified: false,
                    })
                  }
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {filteredArtisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Skill Categories</h2>
                <p className="text-muted-foreground">
                  Explore different categories of skills available in our community
                </p>
              </div>
              <CategoryGrid categories={categories} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
