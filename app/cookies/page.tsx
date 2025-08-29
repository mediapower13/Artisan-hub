"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Cookie,
  Settings,
  Shield,
  Eye,
  Database,
  BarChart3,
  MessageSquare,
  CheckCircle,
  X
} from "lucide-react"
import { useState } from "react"

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    functional: true
  })

  const cookieCategories = [
    {
      id: "essential",
      title: "Essential Cookies",
      description: "Required for the platform to function properly",
      icon: Shield,
      required: true,
      cookies: [
        {
          name: "session_token",
          purpose: "Maintains your login session",
          duration: "Session"
        },
        {
          name: "csrf_token",
          purpose: "Prevents cross-site request forgery",
          duration: "Session"
        },
        {
          name: "auth_state",
          purpose: "Manages authentication state",
          duration: "7 days"
        }
      ]
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      description: "Help us understand how you use our platform",
      icon: BarChart3,
      required: false,
      cookies: [
        {
          name: "_ga",
          purpose: "Google Analytics tracking",
          duration: "2 years"
        },
        {
          name: "_gid",
          purpose: "Google Analytics session tracking",
          duration: "24 hours"
        },
        {
          name: "page_views",
          purpose: "Tracks page visit patterns",
          duration: "30 days"
        }
      ]
    },
    {
      id: "functional",
      title: "Functional Cookies",
      description: "Enhance your experience on our platform",
      icon: Settings,
      required: false,
      cookies: [
        {
          name: "theme_preference",
          purpose: "Remembers your theme choice",
          duration: "1 year"
        },
        {
          name: "language",
          purpose: "Remembers your language preference",
          duration: "1 year"
        },
        {
          name: "search_filters",
          purpose: "Remembers your search preferences",
          duration: "30 days"
        }
      ]
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      description: "Used to deliver relevant advertisements",
      icon: MessageSquare,
      required: false,
      cookies: [
        {
          name: "marketing_id",
          purpose: "Tracks marketing campaign effectiveness",
          duration: "90 days"
        },
        {
          name: "retargeting",
          purpose: "Shows relevant ads on other sites",
          duration: "60 days"
        }
      ]
    }
  ]

  const handleCookieToggle = (categoryId: string, enabled: boolean) => {
    if (categoryId === "essential") return // Essential cookies cannot be disabled

    setCookieSettings(prev => ({
      ...prev,
      [categoryId]: enabled
    }))
  }

  const saveSettings = () => {
    // In a real app, this would save to backend/localStorage
    localStorage.setItem("cookie_settings", JSON.stringify(cookieSettings))
    alert("Cookie settings saved successfully!")
  }

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
                Cookie Policy
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                We use cookies to enhance your experience on UNILORIN Artisan Hub.
                Learn about what cookies we use and how to manage your preferences.
              </p>
              <Badge variant="secondary" className="mt-4 text-white border-white/20">
                Last updated: December 2024
              </Badge>
            </div>
          </div>
        </section>

        {/* What are Cookies */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What are Cookies?
              </h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                    <Cookie className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Cookies are small text files that are stored on your device when you visit our website.
                      They help us provide you with a better browsing experience by remembering your preferences
                      and understanding how you use our platform.
                    </p>
                    <p className="text-gray-600 mt-4">
                      Cookies allow us to:
                    </p>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Keep you logged in during your session</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Remember your settings and preferences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Analyze platform usage to improve our services</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Provide relevant content and advertisements</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cookie Categories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Cookie Categories
              </h2>
              <p className="text-xl text-gray-600">
                Different types of cookies we use and their purposes
              </p>
            </div>

            <div className="space-y-8">
              {cookieCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <category.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {category.required && (
                          <Badge variant="secondary">Required</Badge>
                        )}
                        <Switch
                          checked={cookieSettings[category.id as keyof typeof cookieSettings]}
                          onCheckedChange={(checked) => handleCookieToggle(category.id, checked)}
                          disabled={category.required}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.cookies.map((cookie, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{cookie.name}</h4>
                            <p className="text-sm text-gray-600">{cookie.purpose}</p>
                          </div>
                          <Badge variant="outline">{cookie.duration}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cookie Settings */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Manage Your Cookie Settings
              </h2>
              <p className="text-xl text-gray-600">
                Customize which cookies you want to allow
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
                        <p className="text-sm text-gray-600">Required for platform functionality</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Always On</Badge>
                      <Switch checked={true} disabled />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                        <p className="text-sm text-gray-600">Help us improve our platform</p>
                      </div>
                    </div>
                    <Switch
                      checked={cookieSettings.analytics}
                      onCheckedChange={(checked) => handleCookieToggle("analytics", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                        <p className="text-sm text-gray-600">Enhance your browsing experience</p>
                      </div>
                    </div>
                    <Switch
                      checked={cookieSettings.functional}
                      onCheckedChange={(checked) => handleCookieToggle("functional", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-orange-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                        <p className="text-sm text-gray-600">Show relevant advertisements</p>
                      </div>
                    </div>
                    <Switch
                      checked={cookieSettings.marketing}
                      onCheckedChange={(checked) => handleCookieToggle("marketing", checked)}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button onClick={saveSettings} size="lg" className="w-full">
                    Save Cookie Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Control Cookies */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How to Control Cookies
              </h2>
              <p className="text-xl text-gray-600">
                You can control cookies through your browser settings
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Browser Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Most web browsers allow you to control cookies through their settings preferences.
                    You can usually find these settings in the 'Options' or 'Preferences' menu.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Block all cookies</li>
                    <li>• Block third-party cookies</li>
                    <li>• Delete existing cookies</li>
                    <li>• Receive notifications about cookies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Our Platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    You can manage your cookie preferences directly on our platform using the settings above.
                    Changes will take effect immediately and be saved for future visits.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Customize cookie categories</li>
                    <li>• Save your preferences</li>
                    <li>• Change settings anytime</li>
                    <li>• Platform-specific controls</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Questions About Cookies?</CardTitle>
                <CardDescription className="text-center">
                  If you have any questions about our cookie policy or need help managing your settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Privacy Team</h4>
                      <p className="text-gray-700">privacy@unilorinartisan.edu.ng</p>
                      <p className="text-gray-700">+234 (0) 123 456 7890</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                      <p className="text-gray-700">support@unilorinartisan.edu.ng</p>
                      <Button asChild className="mt-2">
                        <a href="/contact">Contact Us</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
