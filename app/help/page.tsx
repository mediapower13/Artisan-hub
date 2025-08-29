"use client"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Lightbulb
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of using our platform",
      articles: 12
    },
    {
      icon: BookOpen,
      title: "Learning Skills",
      description: "How to enroll and learn from artisans",
      articles: 8
    },
    {
      icon: Star,
      title: "Finding Artisans",
      description: "Search and connect with skilled professionals",
      articles: 15
    },
    {
      icon: CheckCircle,
      title: "Account & Profile",
      description: "Manage your account and profile settings",
      articles: 10
    }
  ]

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click the 'Get Started' button on the homepage, fill in your details, and verify your email. It's that simple!"
    },
    {
      question: "How do I find artisans near me?",
      answer: "Use the location filter in our marketplace to search for artisans in your area. You can also browse by category."
    },
    {
      question: "What should I do if I have a problem with a service?",
      answer: "Contact our support team through the contact form or email us directly. We'll help resolve any issues."
    },
    {
      question: "How do I become a verified artisan?",
      answer: "Complete your profile, upload relevant documents, and submit a verification request. Our team reviews applications within 24-48 hours."
    },
    {
      question: "Can I cancel an enrollment?",
      answer: "Yes, you can cancel enrollments through your dashboard. Refunds are processed according to our policy."
    },
    {
      question: "How do I contact an artisan?",
      answer: "Use the WhatsApp contact button on their profile or send them a direct message through our platform."
    }
  ]

  const quickActions = [
    {
      title: "Browse Marketplace",
      description: "Find artisans and skills",
      href: "/marketplace",
      icon: Users
    },
    {
      title: "View My Dashboard",
      description: "Check your enrollments and progress",
      href: "/dashboard",
      icon: BookOpen
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      href: "/contact",
      icon: MessageCircle
    },
    {
      title: "Update Profile",
      description: "Manage your account settings",
      href: "/profile",
      icon: CheckCircle
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the help you need to make the most of our platform.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <action.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={action.href}>
                      Go to Page
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Help Categories */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Help Topics
                  </CardTitle>
                  <CardDescription>Browse help articles by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {helpCategories.map((category, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <category.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{category.title}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <Badge variant="secondary" className="mt-1">
                          {category.articles} articles
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    {searchQuery ? `Found ${filteredFaqs.length} results for "${searchQuery}"` : "Common questions and answers"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {filteredFaqs.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600">
                        Try different keywords or browse our help categories above.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-8">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
                  <p className="text-gray-600 mb-4">
                    Can't find what you're looking for? Our support team is here to help.
                  </p>
                  <Button asChild>
                    <a href="/contact">
                      Contact Support
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
