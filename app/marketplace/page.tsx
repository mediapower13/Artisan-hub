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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary animate-spin [animation-delay:0.5s] mx-auto"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold animate-pulse">Loading Marketplace</h2>
                <p className="text-muted-foreground animate-pulse">Discovering amazing artisans for you...</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                      <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section with Stats */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 py-8 sm:py-12 lg:py-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl">
            <div className="text-center mb-8 sm:mb-12 animate-in slide-in-from-bottom duration-1000">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4 leading-tight">
                Artisan Marketplace
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
                Discover skilled artisans in the UNILORIN community. Connect, learn, and grow together.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto px-2 sm:px-0">
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-200">
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary" />
                    <div className="text-lg sm:text-2xl font-bold text-primary">{stats.totalArtisans}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Expert Artisans</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-300">
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-lg sm:text-2xl font-bold text-primary">{stats.avgRating.toFixed(1)}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Average Rating</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-400">
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-lg sm:text-2xl font-bold text-primary">{stats.totalSkills}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Skills Available</div>
                  </CardContent>
                </Card>
                <Card className="glass-card hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom delay-500">
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-lg sm:text-2xl font-bold text-primary">{stats.activeToday}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Active Today</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl">
          <Tabs defaultValue="artisans" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 backdrop-blur">
                <TabsTrigger value="artisans" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                  Browse Artisans
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
                  Categories
                </TabsTrigger>
              </TabsList>
              
              <Badge {...({ variant: "outline" } as any)} className="w-fit bg-primary/10 text-primary border-primary/20 self-start sm:self-auto">
                <MapPin className="h-3 w-3 mr-1" />
                UNILORIN Community
              </Badge>
            </div>

            <TabsContent value="artisans" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="bg-white/50 dark:bg-muted/50 backdrop-blur rounded-xl p-4 sm:p-6 border border-white/20 overflow-hidden">
                <SearchFilters categories={categories} onSearch={handleSearch} onFilterChange={handleFilterChange} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/30 dark:bg-muted/30 backdrop-blur rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Badge {...({ variant: "secondary" } as any)} className="bg-primary/10 text-primary w-fit">
                    {filteredArtisans.length} artisans found
                  </Badge>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    from {artisans.length} total
                  </p>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <Button
                    {...({ variant: viewMode === "grid" ? "default" : "outline", size: "sm" } as any)}
                    onClick={() => setViewMode("grid")}
                    className="transition-all duration-200 hover:scale-105 h-8 w-8 p-0"
                  >
                    <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    {...({ variant: viewMode === "list" ? "default" : "outline", size: "sm" } as any)}
                    onClick={() => setViewMode("list")}
                    className="transition-all duration-200 hover:scale-105 h-8 w-8 p-0"
                  >
                    <List className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {filteredArtisans.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="max-w-md mx-auto space-y-6 px-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold">No artisans found</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your search criteria to find more artisans</p>
                    </div>
                    <Button
                      {...({ variant: "outline" } as any)}
                      onClick={() =>
                        handleFilterChange({
                          category: "All categories",
                          location: "All locations",
                          experience: "Any experience",
                          rating: "Any rating",
                          verified: false,
                        })
                      }
                      className="hover:scale-105 transition-all duration-200"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div
                    className={
                      viewMode === "grid" 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                        : "space-y-4"
                    }
                  >
                    {filteredArtisans.map((artisan, index) => (
                      <div 
                        key={artisan.id} 
                        className={`animate-in fade-in slide-in-from-bottom duration-500 w-full ${
                          index < 3 ? 'delay-100' :
                          index < 6 ? 'delay-200' :
                          index < 9 ? 'delay-300' : 'delay-500'
                        }`}
                      >
                        <ArtisanCard artisan={artisan} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="animate-in fade-in slide-in-from-bottom duration-700">
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center space-y-4 px-4">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Explore by Category
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
                    Discover artisans organized by their areas of expertise. Each category represents skilled professionals ready to share their knowledge.
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-muted/50 backdrop-blur rounded-xl p-4 sm:p-6 border border-white/20 overflow-hidden">
                  <CategoryGrid categories={categories} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  )
}
