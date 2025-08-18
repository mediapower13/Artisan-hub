import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, BookOpen } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student CTA */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-unilorin-purple/10 to-unilorin-gold/10"></div>
            <CardContent className="relative p-8 text-center">
              <div className="w-16 h-16 bg-unilorin-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-unilorin-purple" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to Learn?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of students already learning practical skills from expert artisans.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="w-full bg-unilorin-purple hover:bg-unilorin-purple/90" asChild>
                  <Link href="/register">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                  <Link href="/skills">Browse Skills</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Artisan CTA */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-unilorin-gold/10 to-unilorin-green/10"></div>
            <CardContent className="relative p-8 text-center">
              <div className="w-16 h-16 bg-unilorin-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-unilorin-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Share Your Skills</h3>
              <p className="text-muted-foreground mb-6">
                Become an instructor and share your expertise with eager students in the community.
              </p>
              <div className="space-y-4">
                <Button size="lg" className="w-full bg-unilorin-gold hover:bg-unilorin-gold/90 text-black" asChild>
                  <Link href="/register">
                    Become an Artisan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                  <Link href="/marketplace">View Artisans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
