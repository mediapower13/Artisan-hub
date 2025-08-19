"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  Star, 
  Shield,
  Clock,
  Award,
  Zap,
  Heart,
  Globe,
  ChevronRight
} from "lucide-react"

export function FeaturesSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Users,
      title: "Expert Artisans",
      description: "Connect with certified professionals who have years of experience in their craft",
      badge: "Verified",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Learning",
      description: "Access structured courses from beginner to advanced levels with practical projects",
      badge: "Interactive",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "All artisans are vetted and courses are quality-checked for the best learning experience",
      badge: "Guaranteed",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to materials and one-on-one mentorship",
      badge: "On-demand",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn recognized certificates and build a portfolio that showcases your new skills",
      badge: "Accredited",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join a vibrant community of learners and creators from across Nigeria and beyond",
      badge: "Connected",
      color: "from-teal-500 to-blue-500"
    }
  ]

  const stats = [
    { value: "98%", label: "Completion Rate", icon: Zap },
    { value: "4.9/5", label: "Student Rating", icon: Star },
    { value: "50K+", label: "Happy Students", icon: Heart },
    { value: "24/7", label: "Support Available", icon: Clock }
  ]

  return (
    <section className="relative py-20 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center space-y-6 mb-16 ${mounted ? 'animate-in slide-in-from-bottom duration-700' : ''}`}>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Empowering Artisans
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Building Futures
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our platform provides everything you need to master traditional and modern skills, 
            connect with expert artisans, and build a successful career in the creative industry.
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 ${mounted ? 'animate-in slide-in-from-bottom duration-700 delay-200' : ''}`}>
          {stats.map((stat, index) => (
            <Card key={index} className="text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                mounted ? 'animate-in slide-in-from-bottom duration-700' : ''
              }`}
              style={{ animationDelay: `${index * 100 + 400}ms` }}
            >
              {/* Gradient Border on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300`}></div>
              
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge {...({ variant: "secondary" } as any)} className="bg-gray-100 dark:bg-gray-700 text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="flex items-center text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 ${mounted ? 'animate-in slide-in-from-bottom duration-700 delay-1000' : ''}`}>
          <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400">
            <Zap className="h-5 w-5" />
            <span className="font-medium">Ready to start your journey?</span>
          </div>
        </div>
      </div>
    </section>
  )
}
