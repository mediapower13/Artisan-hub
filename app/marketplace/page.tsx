"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArtisanCard } from "@/components/marketplace/artisan-card"
import { SearchFilters } from "@/components/marketplace/search-filters"
import { CategoryGrid } from "@/components/marketplace/category-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { mockDatabase } from "@/lib/mock-data"
import type { Artisan, Category } from "@/lib/types"
import { Grid, List, Users, Star, MapPin, Clock, TrendingUp, Filter, LayoutGrid } from "lucide-react"

interface FilterState {
  search: string
  category: string
  location: string
  minRating: number
  experience: string
  availability: string
}

export default function MarketplacePage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [filteredArtisans, setFilteredArtisans] = useState<Artisan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
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

  const handleFiltersChange = (filters: FilterState) => {
    let filtered = [...artisans]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(artisan =>
        artisan.firstName.toLowerCase().includes(searchTerm) ||
        artisan.lastName.toLowerCase().includes(searchTerm) ||
        artisan.businessName.toLowerCase().includes(searchTerm) ||
        artisan.specialization.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        artisan.skills.some(skill => skill.name.toLowerCase().includes(searchTerm))
      )
    }

    // Category filter
    if (filters.category !== "All Categories") {
      filtered = filtered.filter(artisan =>
        artisan.specialization.some(spec => {
          if (filters.category === "Fashion & Tailoring") {
            return spec.toLowerCase().includes('fashion') || 
                   spec.toLowerCase().includes('tailoring') || 
                   spec.toLowerCase().includes('sewing')
          }
          if (filters.category === "Electronics & Technology") {
            return spec.toLowerCase().includes('electronics') || 
                   spec.toLowerCase().includes('tech') || 
                   spec.toLowerCase().includes('computer')
          }
          return spec.toLowerCase().includes(filters.category.toLowerCase())
        })
      )
    }

    // Location filter
    if (filters.location !== "All Locations") {
      filtered = filtered.filter(artisan => 
        artisan.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(artisan => artisan.rating >= filters.minRating)
    }

    // Experience filter
    if (filters.experience !== "All Experience") {
      const experienceYears = filters.experience
      filtered = filtered.filter(artisan => {
        switch (experienceYears) {
          case "0-1 years":
            return artisan.experience <= 1
          case "2-3 years":
            return artisan.experience >= 2 && artisan.experience <= 3
          case "4-5 years":
            return artisan.experience >= 4 && artisan.experience <= 5
          case "6-10 years":
            return artisan.experience >= 6 && artisan.experience <= 10
          case "10+ years":
            return artisan.experience >= 10
          default:
            return true
        }
      })
    }

    setFilteredArtisans(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-8 w-8 mx-auto mb-2" />
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 py-12 lg:py-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Skilled
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Artisans</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Connect with verified local artisans and skilled professionals. Learn new skills or hire experts for your projects.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalArtisans}</div>
                    <div className="text-sm text-gray-600">Total Artisans</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.activeToday}</div>
                    <div className="text-sm text-gray-600">Available Now</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mx-auto mb-3">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalSkills}</div>
                    <div className="text-sm text-gray-600">Skills Available</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
          <Tabs defaultValue="artisans" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1 h-12">
              <TabsTrigger 
                value="artisans" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 font-medium"
              >
                Browse Artisans ({filteredArtisans.length})
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200 font-medium"
              >
                By Category
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artisans" className="space-y-6">
              {/* Search and Filters */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Find Artisans</h2>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                          className="flex items-center gap-2 bg-white/50"
                        >
                          <Filter className="h-4 w-4" />
                          {isFiltersVisible ? 'Hide' : 'Show'} Filters
                        </Button>
                        
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className="h-8 w-8 p-0"
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="h-8 w-8 p-0"
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isFiltersVisible && (
                      <SearchFilters onFiltersChange={handleFiltersChange} />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {filteredArtisans.length} Artisan{filteredArtisans.length !== 1 ? 's' : ''} Found
                    </h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      From {artisans.length} total
                    </Badge>
                  </div>
                </div>

                {filteredArtisans.length > 0 ? (
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1 lg:grid-cols-2'
                  }`}>
                    {filteredArtisans.map((artisan) => (
                      <div key={artisan.id} className="w-full">
                        <ArtisanCard artisan={artisan} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">No artisans found</h3>
                          <p className="text-gray-600">
                            Try adjusting your search criteria or filters to find more artisans.
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => window.location.reload()}
                          className="mt-4"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center space-y-2 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                    <p className="text-gray-600">Explore artisans organized by their specializations</p>
                  </div>
                  <CategoryGrid categories={categories} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  )
}
