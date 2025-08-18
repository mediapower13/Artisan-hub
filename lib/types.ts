// Database schema types for the University of Ilorin Artisan Community Platform

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: "student" | "artisan" | "admin"
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student extends User {
  role: "student"
  studentId: string
  department: string
  level: string
  enrolledSkills: string[]
}

export interface Artisan extends User {
  role: "artisan"
  businessName: string
  specialization: string[]
  experience: number
  location: string
  rating: number
  totalReviews: number
  verified: boolean
  portfolio: PortfolioItem[]
  skills: Skill[]
}

export interface Skill {
  id: string
  artisanId: string
  title: string
  description: string
  category: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: string
  price: number
  maxStudents: number
  currentStudents: number
  images: string[]
  syllabus: string[]
  requirements: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  completedAt: Date
}

export interface Enrollment {
  id: string
  studentId: string
  skillId: string
  artisanId: string
  status: "pending" | "active" | "completed" | "cancelled"
  progress: number
  enrolledAt: Date
  completedAt?: Date
}

export interface Review {
  id: string
  studentId: string
  artisanId: string
  skillId: string
  rating: number
  comment: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  skillCount: number
}
