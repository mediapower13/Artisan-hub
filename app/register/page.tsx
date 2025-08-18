"use client"
import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <Image
              src="/images/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-unilorin-purple">UNILORIN</h1>
            <p className="text-sm text-muted-foreground">Artisan Community Platform</p>
          </div>
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
