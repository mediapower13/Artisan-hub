"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Book,
  Search,
  FileText,
  Video,
  Users,
  Download,
  ExternalLink,
  Star,
  Clock,
  CheckCircle
} from "lucide-react"
import { useState } from "react"

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using UNILORIN Artisan Hub",
      icon: Book,
      articles: [
        { title: "Creating Your Account", readTime: "3 min", difficulty: "Beginner" },
        { title: "Navigating the Platform", readTime: "5 min", difficulty: "Beginner" },
        { title: "Setting Up Your Profile", readTime: "4 min", difficulty: "Beginner" }
      ]
    },
    {
      title: "For Students",
      description: "Find and connect with artisans for your needs",
      icon: Users,
      articles: [
        { title: "Browsing the Marketplace", readTime: "6 min", difficulty: "Beginner" },
        { title: "Contacting Artisans", readTime: "4 min", difficulty: "Intermediate" },
        { title: "Making Payments", readTime: "5 min", difficulty: "Intermediate" },
        { title: "Leaving Reviews", readTime: "2 min", difficulty: "Beginner" }
      ]
    },
    {
      title: "For Artisans",
      description: "Grow your business and connect with students",
      icon: Star,
      articles: [
        { title: "Becoming an Artisan", readTime: "8 min", difficulty: "Intermediate" },
        { title: "Creating Service Listings", readTime: "6 min", difficulty: "Intermediate" },
        { title: "Managing Bookings", readTime: "7 min", difficulty: "Advanced" },
        { title: "Payment and Earnings", readTime: "5 min", difficulty: "Intermediate" }
      ]
    },
    {
      title: "Safety & Security",
      description: "Stay safe while using our platform",
      icon: CheckCircle,
      articles: [
        { title: "Safety Best Practices", readTime: "6 min", difficulty: "Beginner" },
        { title: "Reporting Issues", readTime: "3 min", difficulty: "Beginner" },
        { title: "Privacy Settings", readTime: "4 min", difficulty: "Intermediate" }
      ]
    }
  ]

  const quickGuides = [
    {
      title: "Quick Start Guide",
      description: "Get up and running in under 10 minutes",
      icon: Clock,
      downloadUrl: "#"
    },
    {
      title: "Artisan Onboarding",
      description: "Step-by-step guide for new artisans",
      icon: Users,
      downloadUrl: "#"
    },
    {
      title: "Payment Guide",
      description: "Understanding payments and fees",
      icon: CheckCircle,
      downloadUrl: "#"
    }
  ]

  const videoTutorials = [
    {
      title: "Platform Overview",
      duration: "5:32",
      thumbnail: "/placeholder-video.jpg"
    },
    {
      title: "Finding Services",
      duration: "3:45",
      thumbnail: "/placeholder-video.jpg"
    },
    {
      title: "Account Setup",
      duration: "4:18",
      thumbnail: "/placeholder-video.jpg"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-blue-900 via-emerald-900 to-teal-900">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Documentation
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                Everything you need to know about using UNILORIN Artisan Hub effectively.
                From getting started to advanced features.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Guides */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quick Start Guides
              </h2>
              <p className="text-xl text-gray-600">
                Get started quickly with these essential guides
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {quickGuides.map((guide, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                      <guide.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{guide.title}</h3>
                    <p className="text-gray-600 mb-6">{guide.description}</p>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Documentation Categories
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive guides organized by topic
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <category.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{article.title}</h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.readTime}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {article.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Video Tutorials
              </h2>
              <p className="text-xl text-gray-600">
                Visual guides to help you understand the platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {videoTutorials.map((video, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-emerald-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Video className="h-8 w-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="/help">
                  Visit Help Center
                  <ExternalLink className="h-5 w-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <a href="/contact">
                  Contact Support
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
