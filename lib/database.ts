import { mockSql } from "./mock-database"

const sql = mockSql

export { sql }

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Mock implementation - in real app this would execute the query
    console.log("[v0] Mock query:", query, params)
    return { success: true, data: [] }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// User management functions
export async function createUser(userData: {
  email: string
  name: string
  password_hash: string
  role: "student" | "artisan"
  phone?: string
  location?: string
  bio?: string
}) {
  const query = `
    INSERT INTO users (email, name, password_hash, role, phone, location, bio)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, name, role, phone, location, bio, created_at
  `

  return executeQuery(query, [
    userData.email,
    userData.name,
    userData.password_hash,
    userData.role,
    userData.phone || null,
    userData.location || null,
    userData.bio || null,
  ])
}

export async function getUserByEmail(email: string) {
  const query = `
    SELECT id, email, name, password_hash, role, phone, location, bio, created_at
    FROM users 
    WHERE email = $1
  `

  const result = await executeQuery(query, [email])
  return result.success ? result.data[0] : null
}

export async function getUserById(id: string) {
  const query = `
    SELECT id, email, name, role, phone, location, bio, created_at
    FROM users 
    WHERE id = $1
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

// Skills management functions
export async function getAllSkills() {
  const query = `
    SELECT s.*, 
           COUNT(DISTINCT as_table.artisan_id) as artisan_count,
           COUNT(DISTINCT e.id) as enrollment_count
    FROM skills s
    LEFT JOIN artisan_skills as_table ON s.id = as_table.skill_id
    LEFT JOIN enrollments e ON s.id = e.skill_id
    GROUP BY s.id
    ORDER BY s.name
  `

  const result = await executeQuery(query)
  return result.success ? result.data : []
}

export async function getSkillById(id: string) {
  const query = `
    SELECT s.*,
           COUNT(DISTINCT as_table.artisan_id) as artisan_count,
           COUNT(DISTINCT e.id) as enrollment_count
    FROM skills s
    LEFT JOIN artisan_skills as_table ON s.id = as_table.skill_id
    LEFT JOIN enrollments e ON s.id = e.skill_id
    WHERE s.id = $1
    GROUP BY s.id
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

// Artisan management functions
export async function getAllArtisans() {
  const query = `
    SELECT ap.*, u.name, u.email, u.phone, u.location, u.bio,
           array_agg(DISTINCT s.name) as skills
    FROM artisan_profiles ap
    JOIN users u ON ap.user_id = u.id
    LEFT JOIN artisan_skills as_table ON ap.id = as_table.artisan_id
    LEFT JOIN skills s ON as_table.skill_id = s.id
    GROUP BY ap.id, u.id
    ORDER BY ap.rating DESC, ap.total_reviews DESC
  `

  const result = await executeQuery(query)
  return result.success ? result.data : []
}

export async function getArtisanById(id: string) {
  const query = `
    SELECT ap.*, u.name, u.email, u.phone, u.location, u.bio
    FROM artisan_profiles ap
    JOIN users u ON ap.user_id = u.id
    WHERE ap.id = $1
  `

  const result = await executeQuery(query, [id])
  return result.success ? result.data[0] : null
}

export async function getArtisanSkills(artisanId: string) {
  const query = `
    SELECT s.*, as_table.proficiency_level
    FROM skills s
    JOIN artisan_skills as_table ON s.id = as_table.skill_id
    WHERE as_table.artisan_id = $1
    ORDER BY s.name
  `

  const result = await executeQuery(query, [artisanId])
  return result.success ? result.data : []
}

// Enrollment management functions
export async function createEnrollment(enrollmentData: {
  student_id: string
  artisan_id: string
  skill_id: string
}) {
  const query = `
    INSERT INTO enrollments (student_id, artisan_id, skill_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `

  return executeQuery(query, [enrollmentData.student_id, enrollmentData.artisan_id, enrollmentData.skill_id])
}

export async function getUserEnrollments(userId: string) {
  const query = `
    SELECT e.*, s.name as skill_name, s.description as skill_description,
           ap.business_name, u.name as artisan_name
    FROM enrollments e
    JOIN skills s ON e.skill_id = s.id
    JOIN artisan_profiles ap ON e.artisan_id = ap.id
    JOIN users u ON ap.user_id = u.id
    WHERE e.student_id = $1
    ORDER BY e.created_at DESC
  `

  const result = await executeQuery(query, [userId])
  return result.success ? result.data : []
}
