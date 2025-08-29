"use client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  CreditCard,
  MessageSquare,
  Ban
} from "lucide-react"

export default function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You must be a current UNILORIN student or staff member to register",
        "Provide accurate and complete information during registration",
        "Maintain the confidentiality of your account credentials",
        "You are responsible for all activities under your account",
        "Notify us immediately of any unauthorized account access"
      ]
    },
    {
      icon: Shield,
      title: "Platform Usage",
      content: [
        "Use the platform only for lawful purposes",
        "Respect intellectual property rights",
        "Do not engage in fraudulent or deceptive activities",
        "Maintain professional conduct in all interactions",
        "Do not attempt to circumvent platform security measures"
      ]
    },
    {
      icon: CreditCard,
      title: "Payments and Fees",
      content: [
        "Artisans set their own pricing for services",
        "Platform fees may apply to certain transactions",
        "All payments are processed securely through approved providers",
        "Refunds are subject to artisan and platform policies",
        "Disputes will be resolved fairly and transparently"
      ]
    },
    {
      icon: MessageSquare,
      title: "Communication",
      content: [
        "Use respectful and professional language",
        "Do not share contact information outside the platform initially",
        "Report inappropriate behavior or content",
        "Platform communications may be monitored for quality assurance",
        "Maintain confidentiality of private communications"
      ]
    }
  ]

  const prohibited = [
    "Harassment or discrimination",
    "Spam or unsolicited communications",
    "Sharing false or misleading information",
    "Impersonating others or creating fake accounts",
    "Attempting to hack or compromise the platform",
    "Violating intellectual property rights",
    "Engaging in illegal activities",
    "Circumventing platform fees or policies"
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
                Terms of Service
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                These terms govern your use of the UNILORIN Artisan Hub platform.
                Please read them carefully before using our services.
              </p>
              <Badge variant="secondary" className="mt-4 text-white border-white/20">
                Effective: December 2024
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
                  Welcome to UNILORIN Artisan Hub. By accessing or using our platform, you agree to be
                  bound by these Terms of Service. If you disagree with any part of these terms,
                  please do not use our platform.
                </p>
              </div>

              {/* Terms Sections */}
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

              {/* Prohibited Activities */}
              <Card className="mt-12">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Ban className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl">Prohibited Activities</CardTitle>
                  </div>
                  <CardDescription>
                    The following activities are strictly prohibited on our platform:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {prohibited.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{activity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Intellectual Property */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    The UNILORIN Artisan Hub platform and its original content, features, and functionality
                    are owned by the University of Ilorin and are protected by copyright, trademark,
                    and other intellectual property laws.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Platform content is protected by copyright laws</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">You may not reproduce or distribute platform materials without permission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">User-generated content remains your property but you grant us usage rights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Termination */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Account Termination</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    We reserve the right to terminate or suspend your account and access to our
                    platform immediately, without prior notice or liability, for any reason,
                    including but not limited to breach of these Terms.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Termination Consequences</h4>
                        <p className="text-yellow-700 mt-1">
                          Upon termination, your right to use the platform will cease immediately.
                          All provisions of these Terms which by their nature should survive
                          termination shall survive.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card className="mt-12">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Scale className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    In no event shall UNILORIN Artisan Hub, nor its directors, employees, partners,
                    agents, suppliers, or affiliates, be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without limitation, loss of profits,
                    data, use, goodwill, or other intangible losses.
                  </p>
                  <p className="text-gray-700">
                    Our total liability shall not exceed the amount paid by you for the services
                    in the twelve months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              {/* Governing Law */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    These Terms shall be interpreted and governed by the laws of the Federal Republic
                    of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive
                    jurisdiction of the courts in Ilorin, Kwara State, Nigeria.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    We reserve the right to modify or replace these Terms at any time. If a revision
                    is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                  <p className="text-gray-700">
                    Your continued use of the platform after any such changes constitutes your
                    acceptance of the new Terms of Service.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mt-12">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Us</CardTitle>
                  <CardDescription>
                    If you have any questions about these Terms of Service:
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Legal Department</h4>
                        <p className="text-blue-800">legal@unilorinartisan.edu.ng</p>
                        <p className="text-blue-800">+234 (0) 123 456 7890</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">General Support</h4>
                        <p className="text-blue-800">support@unilorinartisan.edu.ng</p>
                        <Button asChild className="mt-2">
                          <a href="/contact">Contact Support</a>
                        </Button>
                      </div>
                    </div>
                  </div>
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
