import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"
import Link from "next/link"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="text-3xl sm:text-4xl mb-2">{category.icon}</div>
              <CardTitle className="text-base sm:text-lg leading-tight">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{category.description}</p>
              <Badge variant="secondary" className="text-xs">{category.skillCount} skills available</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
