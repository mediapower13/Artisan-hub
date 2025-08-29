"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MessageSquare,
  Calendar,
  Heart,
  Star,
  BookOpen,
  Lightbulb,
  Target,
  ArrowRight,
  Clock,
  MapPin
} from "lucide-react"

export default function CommunityPage() {
  const communityStats = [
    { number: "2,500+", label: "Active Members", icon: Users },
    { number: "150+", label: "Skills Shared", icon: BookOpen },
    { number: "500+", label: "Success Stories", icon: Star },
    { number: "95%", label: "Satisfaction Rate", icon: Heart }
  ]

  const upcomingEvents = [
    {
      title: "Artisan Showcase",
      date: "September 15, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "UNILORIN Main Campus",
      description: "Meet our verified artisans and see their work firsthand.",
      attendees: 45
    },
    {
      title: "Skill Development Workshop",
      date: "September 20, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "Faculty of Engineering",
      description: "Learn basic electrical repairs and maintenance.",
      attendees: 32
    },
    {
      title: "Community Meetup",
      date: "October 5, 2025",
      time: "4:00 PM - 6:00 PM",
      location: "Student Center",
      description: "Monthly networking session for students and artisans.",
      attendees: 67
    }
  ]

  const discussionTopics = [
    {
      title: "Tips for finding reliable artisans",
      author: "Sarah Johnson",
      replies: 23,
      lastActivity: "2 hours ago",
      category: "General"
    },
    {
      title: "Best practices for skill documentation",
      author: "Mike Adebayo",
      replies: 18,
      lastActivity: "5 hours ago",
      category: "Learning"
    },
    {
      title: "Payment security on the platform",
      author: "Grace Okafor",
      replies: 31,
      lastActivity: "1 day ago",
      category: "Safety"
    }
  ]

  const successStories = [
    {
      name: "Adeola Thompson",
      role: "Computer Science Student",
      story: "I learned web development from an amazing artisan on this platform. Now I have my own freelance business!",
      rating: 5,
      skill: "Web Development"
    },
    {
      name: "Kemi Adeyemi",
      role: "Fashion Design Artisan",
      story: "The platform helped me connect with students who needed my tailoring services. My business has grown tremendously.",
      rating: 5,
      skill: "Fashion Design"
    },
    {
      name: "Tunde Bakare",
      role: "Electrical Engineering Student",
      story: "Found an excellent electrician who taught me advanced wiring techniques. Highly recommend the platform!",
      rating: 5,
      skill: "Electrical Work"
    }
  ]

  const communityGuidelines = [
    {
      icon: Heart,
      title: "Be Respectful",
      description: "Treat all community members with respect and professionalism."
    },
    {
      icon: MessageSquare,
      title: "Communicate Clearly",
      description: "Use clear, professional language in all interactions."
    },
    {
      icon: Target,
      title: "Stay On Topic",
      description: "Keep discussions relevant to skills, learning, and artisan services."
    },
    {
      icon: Lightbulb,
      title: "Share Knowledge",
      description: "Help others learn and grow by sharing your expertise."
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
                Community Hub
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                Connect, learn, and grow together. Join thousands of UNILORIN students and artisans
                building a vibrant community of skill development and entrepreneurship.
              </p>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Growing Community
              </h2>
              <p className="text-xl text-gray-600">
                Join a thriving ecosystem of learning and collaboration
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {communityStats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <stat.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600">
                Join us for workshops, meetups, and learning opportunities
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{event.attendees} attending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                      <Button className="w-full mt-4">
                        Register for Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Discussion Forum */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Community Discussions
              </h2>
              <p className="text-xl text-gray-600">
                Share knowledge, ask questions, and connect with fellow community members
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 mb-8">
                {discussionTopics.map((topic, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>by {topic.author}</span>
                            <span>{topic.replies} replies</span>
                            <span>{topic.lastActivity}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{topic.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start a Discussion
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Real stories from our community members
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{story.name}</h3>
                        <p className="text-sm text-gray-600">{story.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <p className="text-gray-700 mb-4">"{story.story}"</p>

                    <Badge variant="secondary">{story.skill}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Community Guidelines
              </h2>
              <p className="text-xl text-gray-600">
                Help us maintain a positive and productive community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {communityGuidelines.map((guideline, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <guideline.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{guideline.title}</h3>
                    <p className="text-gray-600">{guideline.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join Community CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Connect with like-minded students and artisans, share your skills,
              and grow together in a supportive environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="/register">
                  Join the Community
                  <ArrowRight className="h-5 w-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <a href="/marketplace">
                  Explore Marketplace
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
