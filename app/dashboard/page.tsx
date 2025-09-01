"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LearningDashboard } from "@/components/skills/learning-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { mockDatabase } from "@/lib/mock-data"
import type { Enrollment, Skill, Artisan } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [skillsData, artisansData] = await Promise.all([mockDatabase.getSkills(), mockDatabase.getArtisans()])

        // Mock enrollments for demo - use actual user ID
        const mockEnrollments: Enrollment[] = [
          {
            id: "1",
            studentId: user?.id || "student1",
            skillId: "1",
            providerId: "1",
            status: "active",
            progress: 65,
            enrolledAt: new Date("2024-01-15"),
          },
          {
            id: "2",
            studentId: user?.id || "student1",
            skillId: "2",
            providerId: "2",
            status: "completed",
            progress: 100,
            enrolledAt: new Date("2023-12-01"),
            completedAt: new Date("2024-01-10"),
          },
        ]

        setEnrollments(mockEnrollments)
        setSkills(skillsData)
        setArtisans(artisansData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AuthGuard requireAuth={true} allowedRoles={["student", "artisan"]}>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and manage your enrolled skills</p>
          </div>

          <LearningDashboard enrollments={enrollments} skills={skills} artisans={artisans} />
        </main>
      </AuthGuard>
      <Footer />
    </div>
  )
}
