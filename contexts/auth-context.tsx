"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthUser {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  role: "student" | "artisan" | "admin"
  phone?: string
  studentId?: string
  department?: string
  level?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: "student" | "artisan"
    studentId?: string
    department?: string
    level?: string
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-token="))
          ?.split("=")[1]

        if (token && token.startsWith('session_')) {
          // Simple token validation - in production you'd verify against a database
          const parts = token.split('_')
          if (parts.length === 3 && parts[0] === 'session') {
            // For demo purposes, set a mock user
            setUser({
              id: parts[1],
              email: "demo@example.com",
              fullName: "Demo User",
              role: "student"
            })
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

    const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
  const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      console.log("Login successful:", data)
      setUser(data.user)
      
      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: "student" | "artisan"
    studentId?: string
    department?: string
    level?: string
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
  const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Clear cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
