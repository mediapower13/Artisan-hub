"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone number)",
        "Account information and preferences",
        "Usage data and interaction patterns",
        "Device and browser information",
        "Location data (with your permission)"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our services",
        "Process transactions and manage accounts",
        "Send important updates and notifications",
        "Personalize your experience",
        "Ensure platform security and prevent fraud"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for data transmission",
        "Secure storage with access controls",
        "Regular security audits and updates",
        "Limited access to personal data",
        "Data backup and recovery procedures"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking",
      content: [
        "Essential cookies for platform functionality",
        "Analytics cookies to improve user experience",
        "Preference cookies to remember your settings",
        "Third-party cookies for payment processing",
        "Option to disable non-essential cookies"
      ]
    }
  ]

  const rights = [
    "Access your personal information",
    "Correct inaccurate or incomplete data",
    "Request deletion of your data",
    "Object to data processing",
    "Data portability",
    "Withdraw consent at any time"
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
                Privacy Policy
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                Your privacy is important to us. This policy explains how we collect,
                use, and protect your personal information.
              </p>
              <Badge variant="secondary" className="mt-4 text-white border-white/20">
                Last updated: December 2024
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-12">
                <p className="text-lg text-gray-700 leading-relaxed">
                  At UNILORIN Artisan Hub, we are committed to protecting your privacy and ensuring
                  the security of your personal information. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </div>

              {/* Privacy Sections */}
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <section.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Your Rights */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Your Rights</CardTitle>
                  <CardDescription>
                    You have the following rights regarding your personal data:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {rights.map((right, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{right}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Data Sharing */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Information Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">With service providers who assist our operations (under strict confidentiality agreements)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">When required by law or to protect our rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">In connection with a business transfer or acquisition</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Us</CardTitle>
                  <CardDescription>
                    If you have any questions about this Privacy Policy or our data practices:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">privacy@unilorinartisan.edu.ng</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">+234 (0) 123 456 7890</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <span className="text-gray-700">
                          University of Ilorin<br />
                          Ilorin, Kwara State<br />
                          Nigeria
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Data Protection Officer</h4>
                      <p className="text-gray-700">
                        For data protection related inquiries, please contact our Data Protection Officer
                        at dpo@unilorinartisan.edu.ng
                      </p>
                      <Button asChild>
                        <a href="/contact">
                          Contact Us
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Updates */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Policy Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    We may update this Privacy Policy from time to time. We will notify you of any
                    material changes by posting the new Privacy Policy on this page and updating
                    the "Last updated" date. Your continued use of our platform after any such
                    changes constitutes your acceptance of the updated Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
