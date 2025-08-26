import { mockSql } from "./mock-database"

const sql = mockSql
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
      const result = await sql`
        SELECT id, email, full_name, user_type, student_id, department, level, phone, location, bio
        FROM users 
        WHERE id = ${id}
      `

      if (result.length === 0) return null

      const user = result[0] as {
        id: string
        email: string
        full_name: string
        user_type: "student" | "artisan"
        student_id?: string
        department?: string
        level?: number
        phone?: string
        location?: string
        bio?: string
      }
      return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        role: user.user_type, // Map userType to role for backward compatibility
        studentId: user.student_id,
        department: user.department,
        level: user.level,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
  },

  async getUserByEmail(email: string): Promise<(AuthUser & { password: string }) | null> {
    try {
      const result = await sql`
        SELECT id, email, full_name, user_type, password, student_id, department, level, phone, location, bio
        FROM users 
        WHERE email = ${email}
      `

      if (result.length === 0) return null

      const user = result[0] as {
        id: string
        email: string
        full_name: string
        user_type: "student" | "artisan"
        password: string
        student_id?: string
        department?: string
        level?: number
        phone?: string
        location?: string
        bio?: string
      }
      return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        role: user.user_type, // Map userType to role for backward compatibility
        studentId: user.student_id,
        department: user.department,
        level: user.level,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        password: user.password,
      }
    } catch (error) {
      console.error("Error fetching user by email:", error)
      return null
    }
  },
}
