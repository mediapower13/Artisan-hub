import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Category } from "@/lib/types"
import Link from "next/link"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-2">{category.icon}</div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
              <Badge variant="secondary">{category.skillCount} skills available</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
