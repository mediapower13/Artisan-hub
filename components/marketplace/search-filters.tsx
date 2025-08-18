"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"
import type { Category } from "@/lib/types"

interface SearchFiltersProps {
  categories: Category[]
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  category: string
  location: string
  experience: string
  rating: string
  verified: boolean
}

export function SearchFilters({ categories, onSearch, onFilterChange, initialFilters }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      category: "All categories",
      location: "All locations",
      experience: "Any experience",
      rating: "Any rating",
      verified: false,
    },
  )
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: "All categories",
      location: "All locations",
      experience: "Any experience",
      rating: "Any rating",
      verified: false,
    }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== "All categories" &&
      value !== "All locations" &&
      value !== "Any experience" &&
      value !== "Any rating" &&
      value !== false,
  ).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search artisans, skills, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All categories">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All locations">All locations</SelectItem>
                    <SelectItem value="Ilorin">Ilorin</SelectItem>
                    <SelectItem value="Kwara State">Kwara State</SelectItem>
                    <SelectItem value="On Campus">On Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Select value={filters.experience} onValueChange={(value) => handleFilterChange("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any experience">Any experience</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5+">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <Select value={filters.rating} onValueChange={(value) => handleFilterChange("rating", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any rating">Any rating</SelectItem>
                    <SelectItem value="4.5+">4.5+ stars</SelectItem>
                    <SelectItem value="4.0+">4.0+ stars</SelectItem>
                    <SelectItem value="3.5+">3.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange("verified", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="verified" className="text-sm font-medium">
                  Verified artisans only
                </label>
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
