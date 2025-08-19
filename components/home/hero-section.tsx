"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  Sparkles,
  Play,
  CheckCircle
} from "lucide-react"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { icon: Users, value: "2,500+", label: "Active Artisans" },
    { icon: BookOpen, value: "150+", label: "Skills Available" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Award, value: "95%", label: "Success Rate" }
  ]

  const features = [
    "Connect with skilled artisans",
    "Learn from certified professionals", 
    "Flexible learning schedules",
    "Community-driven platform"
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-100/60 to-indigo-100/40 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-emerald-100/60 to-teal-100/40 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-full blur-3xl"></div>
        
        {/* Professional Grid Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-gradient-pattern"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className={`inline-flex transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Badge className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 text-sm font-medium shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                UNILORIN Student Artisan Hub
              </Badge>
            </div>

            {/* Main Heading */}
            <div className={`space-y-4 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                  Master Skills,
                </span>
                <br />
                <span className="text-slate-900 dark:text-white">
                  Build Your Future
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-200 max-w-2xl leading-relaxed">
                Connect with expert student artisans, learn traditional and modern skills, and become part of UNILORIN's most vibrant creative community.
              </p>
            </div>

            {/* Features List */}
            <div className={`space-y-3 transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center space-x-3 text-slate-700 dark:text-slate-200 transition-all duration-500 delay-${(index + 1) * 100} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 animate-pulse" />
                  <span className="text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button 
                asChild
                {...({ size: "lg" } as any)}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Link href="/marketplace" className="flex items-center space-x-2">
                  <span>Explore Marketplace</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              
              <Button 
                {...({ variant: "outline", size: "lg" } as any)}
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              {stats.map((stat, index) => (
                <div key={index} className={`text-center group transition-all duration-500 delay-${(index + 2) * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                      <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="font-bold text-xl text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
            {/* Main Image Container */}
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl scale-110"></div>
              
              {/* Main Card */}
              <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src="/professional-woman-tailor.png"
                      alt="Professional Artisan at Work"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Floating Achievement Card */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg animate-bounce">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          Master Certified
                        </div>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">4.9</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute top-1/2 -left-8 w-6 h-6 bg-teal-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
