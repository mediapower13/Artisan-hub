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
import { getAllProviders, getAllCategories, searchProviders, checkDatabaseConnection } from "@/lib/database-operations"
import { mockDatabase } from "@/lib/mock-data" // Fallback for development
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useDatabase, setUseDatabase] = useState(true)
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
      setLoading(true)
      setError(null)
      
      try {
        // Check if database is available
        const dbAvailable = await checkDatabaseConnection()
        
        if (dbAvailable && useDatabase) {
          // Load data from database
          console.log('Loading data from Supabase database...')
          const [artisansData, categoriesData] = await Promise.all([
            getAllProviders(),
            getAllCategories(),
          ])
          
          setArtisans(artisansData)
          setFilteredArtisans(artisansData)
          setCategories(categoriesData)
          
          // Calculate stats from real data
          setStats({
            totalArtisans: artisansData.length,
            totalSkills: artisansData.reduce((acc, artisan) => acc + artisan.skills.length, 0),
            avgRating: artisansData.length > 0 
              ? artisansData.reduce((acc, artisan) => acc + artisan.rating, 0) / artisansData.length 
              : 0,
            activeToday: Math.floor(artisansData.length * 0.7) // Estimate 70% active today
          })
          
          console.log(`Loaded ${artisansData.length} providers and ${categoriesData.length} categories from database`)
        } else {
          // Fallback to mock data
          console.log('Database not available, falling back to mock data...')
          setUseDatabase(false)
          
          const [artisansData, categoriesData] = await Promise.all([
            mockDatabase.getArtisans(),
            mockDatabase.getCategories(),
          ])
          
          setArtisans(artisansData)
          setFilteredArtisans(artisansData)
          setCategories(categoriesData)
          
          // Calculate stats from mock data
          setStats({
            totalArtisans: artisansData.length,
            totalSkills: artisansData.reduce((acc, artisan) => acc + artisan.skills.length, 0),
            avgRating: artisansData.reduce((acc, artisan) => acc + artisan.rating, 0) / artisansData.length,
            activeToday: Math.floor(artisansData.length * 0.7)
          })
          
          if (!dbAvailable) {
            setError('Database connection failed. Using demo data.')
          }
        }
      } catch (error) {
        console.error("Failed to load marketplace data:", error)
        setError('Failed to load data. Please try again.')
        
        // Fallback to mock data on error
        try {
          const [artisansData, categoriesData] = await Promise.all([
            mockDatabase.getArtisans(),
            mockDatabase.getCategories(),
          ])
          setArtisans(artisansData)
          setFilteredArtisans(artisansData)
          setCategories(categoriesData)
          setUseDatabase(false)
        } catch (fallbackError) {
          console.error("Fallback to mock data also failed:", fallbackError)
        }
      } finally {
        setLoading(false)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleFiltersChange = async (filters: FilterState) => {
    if (useDatabase) {
      // Use database search for better performance with large datasets
      try {
        setLoading(true)
        const searchResults = await searchProviders(filters.search || "")
        setFilteredArtisans(searchResults)
      } catch (error) {
        console.error('Database search failed, falling back to client-side filtering:', error)
        // Fallback to client-side filtering
        clientSideFilter(filters)
      } finally {
        setLoading(false)
      }
    } else {
      // Client-side filtering for mock data
      clientSideFilter(filters)
    }
  }

  const clientSideFilter = (filters: FilterState) => {
    let filtered = [...artisans]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(artisan =>
        artisan.firstName.toLowerCase().includes(searchTerm) ||
        artisan.lastName.toLowerCase().includes(searchTerm) ||
        artisan.businessName.toLowerCase().includes(searchTerm) ||
        artisan.specialization.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        artisan.skills.some(skill => skill.title.toLowerCase().includes(searchTerm))
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
                   spec.toLowerCase().includes('technology') ||
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

    // Availability filter
    if (filters.availability !== "All") {
      filtered = filtered.filter(artisan => {
        if (filters.availability === "Available") {
          return artisan.availability?.isAvailable
        }
        return true
      })
    }

    setFilteredArtisans(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <div className="space-y-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl" />
                <Skeleton className="h-8 w-1/2 mx-auto rounded-xl" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="p-6 bg-white border border-gray-200 shadow-lg">
                    <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-2xl" />
                    <Skeleton className="h-8 w-16 mx-auto mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-20 mx-auto rounded-lg" />
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-6 bg-white border border-gray-200 shadow-lg">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Database Status Indicator */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-yellow-700">
              ⚠️ {error}
            </div>
          </div>
        </div>
      )}
      
      {!useDatabase && !error && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-blue-700">
              📖 Currently using demo data for development
            </div>
          </div>
        </div>
      )}
      
      {useDatabase && !error && (
        <div className="bg-green-50 border-l-4 border-green-400 p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-green-700">
              🗄️ Connected to Supabase database
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-x-hidden">
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gray-50 py-16 lg:py-24">
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-2xl mb-6 shadow-lg">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Discover Skilled Artisans
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Connect with verified local artisans and skilled professionals. Learn new skills or hire experts for your projects in the UNILORIN community.
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalArtisans}</div>
                    <div className="text-sm font-medium text-gray-600">Total Artisans</div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-4 shadow-lg">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.activeToday}</div>
                    <div className="text-sm font-medium text-gray-600">Available Now</div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-2xl mx-auto mb-4 shadow-lg">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
                    <div className="text-sm font-medium text-gray-600">Avg Rating</div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mx-auto mb-4 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalSkills}</div>
                    <div className="text-sm font-medium text-gray-600">Skills Available</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl">
          <Tabs defaultValue="artisans" className="space-y-10">
            <TabsList className="grid w-full grid-cols-2 lg:w-[450px] mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-2 h-14 shadow-lg">
              <TabsTrigger 
                value="artisans" 
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 font-semibold text-lg"
              >
                Browse Artisans ({filteredArtisans.length})
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 font-semibold text-lg"
              >
                By Category
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artisans" className="space-y-8">
              {/* Enhanced Search and Filters */}
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                          <Filter className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Find Artisans</h2>
                          <p className="text-slate-600 dark:text-slate-400">Discover skilled professionals in your area</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                          className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 rounded-xl h-12 px-6"
                        >
                          <Filter className="h-4 w-4" />
                          {isFiltersVisible ? 'Hide' : 'Show'} Filters
                        </Button>
                        
                        <div className="flex items-center bg-orange-100 dark:bg-orange-900/50 rounded-xl p-1 border-2 border-orange-200 dark:border-orange-800">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={`h-10 w-10 p-0 rounded-lg ${viewMode === 'grid' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'hover:bg-orange-200 dark:hover:bg-orange-800'}`}
                          >
                            <LayoutGrid className="h-5 w-5" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={`h-10 w-10 p-0 rounded-lg ${viewMode === 'list' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'hover:bg-orange-200 dark:hover:bg-orange-800'}`}
                          >
                            <List className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {isFiltersVisible && (
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
                        <SearchFilters onFiltersChange={handleFiltersChange} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Results */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {filteredArtisans.length} Artisan{filteredArtisans.length !== 1 ? 's' : ''} Found
                    </h3>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-semibold rounded-xl shadow-lg">
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
                  <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden">
                    <CardContent className="p-16 text-center">
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 rounded-2xl flex items-center justify-center mx-auto border-2 border-orange-200 dark:border-orange-800">
                          <Users className="h-10 w-10 text-orange-500" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No artisans found</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Try adjusting your search criteria or filters to find more artisans.
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => window.location.reload()}
                          className="mt-6 h-12 px-8 text-lg font-semibold border-2 border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-xl"
                        >
                          Clear All Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-8">
              <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 shadow-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center space-y-4 mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl mb-6 shadow-lg">
                      <LayoutGrid className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Explore artisans organized by their specializations</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
                    <CategoryGrid categories={categories} />
                  </div>
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
