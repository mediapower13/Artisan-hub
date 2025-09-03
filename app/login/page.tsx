"use client"
import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-lg">
          {/* Logo and Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/placeholder-logo.png"
                alt="University of Ilorin Logo"
                width={96}
                height={96}
                className="bg-white rounded-full p-3 shadow-lg border-4 border-purple-100"
              />
            </div>
            <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">Welcome Back</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">UNILORIN Artisan Community Platform</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Sign in to access your account</p>
          </div>
          
          {/* Login Form Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <LoginForm onSuccess={handleLoginSuccess} />
          </div>
          
          {/* Additional Information */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
