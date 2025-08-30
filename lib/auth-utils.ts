import { supabase } from "./supabase"
const JWT_SECRET = process.env.JWT_SECRET || "unilorin-artisan-platform-jwt-secret-key-minimum-32-chars-2024"

export interface AuthUser {
  id: string
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  userType: "student" | "artisan"
  role: "student" | "artisan" | "admin"
  studentId?: string
  department?: string
  level?: number
  phone?: string
  location?: string
  bio?: string
  profileImage?: string
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const passwordData = encoder.encode(
    password +
      Array.from(salt)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
  )

  const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return `${saltHex}:${hashHex}`
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const [saltHex, hashHex] = hashedPassword.split(":")
    if (!saltHex || !hashHex) return false

    const encoder = new TextEncoder()
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const passwordData = encoder.encode(password + saltHex)

    const hashBuffer = await crypto.subtle.digest("SHA-256", passwordData)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const computedHashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return computedHashHex === hashHex
  } catch (error) {
    console.error("[v0] Password verification error:", error)
    return false
  }
}

// Simple base64 encoding/decoding for JWT-like tokens
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  str += "=".repeat((4 - (str.length % 4)) % 4)
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
}

// Web Crypto API compatible HMAC signature
async function createSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(data)
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export const authUtils = {
  async hashPassword(password: string): Promise<string> {
    return hashPassword(password)
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return verifyPassword(password, hashedPassword)
  },

  async generateToken(user: AuthUser): Promise<string> {
    try {
      const header = { alg: "HS256", typ: "JWT" }
      const payload = {
        id: user.id,
        email: user.email,
        userType: user.userType,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      }

      const encodedHeader = base64UrlEncode(JSON.stringify(header))
      const encodedPayload = base64UrlEncode(JSON.stringify(payload))
      const signature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)

      return `${encodedHeader}.${encodedPayload}.${signature}`
    } catch (error) {
      console.error("[v0] Token generation failed:", error)
      throw new Error("Failed to generate token")
    }
  },

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      if (!token || typeof token !== "string") {
        return null
      }

      const parts = token.split(".")
      if (parts.length !== 3) {
        return null
      }

      const [encodedHeader, encodedPayload, signature] = parts

      // Verify signature
      const expectedSignature = await createSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
      if (signature !== expectedSignature) {
        console.log("[v0] Invalid token signature")
        return null
      }

      // Decode payload
      const payload = JSON.parse(base64UrlDecode(encodedPayload))

      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log("[v0] Token expired")
        return null
      }

      return {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName || "",
        userType: payload.userType,
        role: payload.userType, // Map userType to role for backward compatibility
        studentId: payload.studentId,
        department: payload.department,
        level: payload.level,
        phone: payload.phone,
        location: payload.location,
        bio: payload.bio,
      }
    } catch (error) {
      console.log("[v0] JWT verification failed:", error)
      return null
    }
  },

  async getUserById(id: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, user_type, student_id, department, level, phone, location, bio')
        .eq('id', id)
        .single()
      if (error || !data) return null
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        role: data.user_type, // Map userType to role for backward compatibility
        studentId: data.student_id,
        department: data.department,
        level: data.level,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  },

  async getUserByEmail(email: string): Promise<(AuthUser & { password: string }) | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, user_type, password, student_id, department, level, phone, location, bio')
        .eq('email', email)
        .single()
      if (error || !data) return null
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        role: data.user_type, // Map userType to role for backward compatibility
        studentId: data.student_id,
        department: data.department,
        level: data.level,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        password: data.password,
      }
    } catch (error) {
      console.error("Error fetching user by email:", error)
      return null
    }
  },

  async createUser(user: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    fullName: string,
    phone: string,
    role: "student" | "artisan",
    studentId?: string,
    department?: string,
    level?: string,
  }): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email: user.email,
            password: user.password,
            first_name: user.firstName,
            last_name: user.lastName,
            full_name: user.fullName,
            phone: user.phone,
            role: user.role,
            student_id: user.studentId || null,
            department: user.department || null,
            level: user.level || null,
          }
        ])
        .select('id, email, full_name, user_type, student_id, department, level, phone, location, bio')
        .single()
      if (error || !data) return null
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        userType: data.user_type,
        role: data.user_type,
        studentId: data.student_id,
        department: data.department,
        level: data.level,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  },
}
