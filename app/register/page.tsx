"use client"
import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Users, BookOpen, Award, Shield } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push("/profile")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/placeholder-logo.png"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mr-4 bg-white rounded-full p-2"
            />
            <div className="text-left">
              <h1 className="text-3xl font-bold">UNIVERSITY OF ILORIN</h1>
              <p className="text-purple-100 text-lg">Artisan Community Platform</p>
            </div>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Join Nigeria's premier university artisan community and unlock your potential
          </p>
        </div>
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Registration Form */}
            <div className="order-2 lg:order-1">
              <RegisterForm onSuccess={handleRegisterSuccess} />
            </div>

            {/* Benefits Section */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Join Our Community?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Connect with skilled artisans and fellow students in a thriving learning environment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-800 hover:shadow-xl transition-shadow">
                  <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Artisans</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Learn from experienced craftspeople and skilled professionals.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800 hover:shadow-xl transition-shadow">
                  <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Skill Development</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Master new skills and enhance your career prospects.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-shadow">
                  <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Certification</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Earn recognized certificates for completed courses.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-orange-100 dark:border-orange-800 hover:shadow-xl transition-shadow">
                  <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safe Learning</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Verified instructors and secure learning environment.</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Join Our Growing Community</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-purple-200 text-sm">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-purple-200 text-sm">Artisans</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-purple-200 text-sm">Skills</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
