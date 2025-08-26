// Database operations for the Unilorin Artisan Platform
// This replaces mock data with real Supabase database calls

import { supabase } from './supabase'
import type { Provider, Category, Skill, User } from './types'

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && url !== 'your-supabase-url' && key !== 'your-supabase-anon-key')
}

// Provider/Artisan operations
export async function getAllProviders(): Promise<Provider[]> {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        users!inner(
          id,
          email,
          first_name,
          last_name,
          full_name,
          phone,
          profile_image,
          student_id,
          department,
          level,
          created_at,
          updated_at
        )
      `)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false })

    if (error) {
      console.error('Error fetching providers:', error)
      throw error
    }

    // Transform the data to match our Provider interface
    const providers: Provider[] = (data || []).map(provider => ({
      id: provider.users.id,
      email: provider.users.email,
      password: '', // Don't expose password
      firstName: provider.users.first_name,
      lastName: provider.users.last_name,
      fullName: provider.users.full_name,
      phone: provider.users.phone,
      role: 'artisan' as const,
      profileImage: provider.users.profile_image,
      studentId: provider.users.student_id,
      department: provider.users.department,
      level: provider.users.level,
      businessName: provider.business_name,
      description: provider.description,
      specialization: provider.specialization || [],
      experience: provider.experience || 0,
      location: provider.location,
      rating: parseFloat(provider.rating) || 0,
      totalReviews: provider.total_reviews || 0,
      verified: provider.verified || false,
      verificationStatus: provider.verification_status as 'pending' | 'approved' | 'rejected',
      verificationEvidence: provider.verification_evidence || [],
      portfolio: [], // TODO: Fetch from portfolio table
      skills: [], // TODO: Fetch from skills table
      availability: {
        isAvailable: provider.availability_is_available || false,
        availableForWork: provider.availability_available_for_work || false,
        availableForLearning: provider.availability_available_for_learning || false,
        responseTime: provider.availability_response_time || 'Usually responds within 24 hours'
      },
      pricing: {
        baseRate: parseFloat(provider.pricing_base_rate) || undefined,
        learningRate: parseFloat(provider.pricing_learning_rate) || undefined,
        currency: provider.pricing_currency || 'NGN'
      },
      whatsappNumber: provider.whatsapp_number || provider.users.phone,
      createdAt: new Date(provider.users.created_at),
      updatedAt: new Date(provider.users.updated_at)
    }))

    return providers
  } catch (error) {
    console.error('Error in getAllProviders:', error)
    return [] // Return empty array on error to prevent app crash
  }
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    // Get provider count for each category
    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (category) => {
        const { data: providerData, error: countError } = await supabase
          .from('providers')
          .select('id', { count: 'exact' })
          .contains('specialization', [category.name])
          .eq('verification_status', 'approved')

        const providerCount = countError ? 0 : (providerData?.length || 0)

        const { data: skillData, error: skillCountError } = await supabase
          .from('skills')
          .select('id', { count: 'exact' })
          .eq('category', category.name)

        const skillCount = skillCountError ? 0 : (skillData?.length || 0)

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          icon: category.icon || '🔧',
          skillCount,
          providerCount,
          artisanCount: providerCount, // For backward compatibility
          skills: [] // TODO: Add popular skills if needed
        }
      })
    )

    return categoriesWithCounts
  } catch (error) {
    console.error('Error in getAllCategories:', error)
    return [] // Return empty array on error
  }
}

// Skills operations
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select(`
        *,
        providers!inner(
          id,
          business_name,
          rating,
          users!inner(
            full_name,
            profile_image
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching skills:', error)
      throw error
    }

    // Transform the data to match our Skill interface
    const skills: Skill[] = (data || []).map(skill => ({
      id: skill.id,
      artisanId: skill.provider_id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      difficulty: skill.difficulty as 'beginner' | 'intermediate' | 'advanced',
      duration: skill.duration,
      price: parseFloat(skill.price) || 0,
      maxStudents: skill.max_students || 10,
      currentStudents: skill.current_students || 0,
      images: skill.images || [],
      syllabus: skill.syllabus || [],
      requirements: skill.requirements || [],
      instructor: {
        id: skill.providers.id,
        name: skill.providers.users.full_name,
        image: skill.providers.users.profile_image || '/placeholder-user.jpg',
        rating: parseFloat(skill.providers.rating) || 0,
        businessName: skill.providers.business_name
      },
      createdAt: new Date(skill.created_at),
      updatedAt: new Date(skill.updated_at)
    }))

    return skills
  } catch (error) {
    console.error('Error in getAllSkills:', error)
    return []
  }
}

// Search and filter operations
export async function searchProviders(filters: {
  search?: string
  category?: string
  location?: string
  minRating?: number
  verified?: boolean
}): Promise<Provider[]> {
  try {
    let query = supabase
      .from('providers')
      .select(`
        *,
        users!inner(
          id,
          email,
          first_name,
          last_name,
          full_name,
          phone,
          profile_image,
          student_id,
          department,
          level,
          created_at,
          updated_at
        )
      `)
      .eq('verification_status', 'approved')

    // Apply filters
    if (filters.search) {
      query = query.or(`business_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.category && filters.category !== 'All Categories') {
      query = query.contains('specialization', [filters.category])
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    if (filters.minRating) {
      query = query.gte('rating', filters.minRating)
    }

    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) {
      console.error('Error searching providers:', error)
      throw error
    }

    // Transform the data (same transformation as getAllProviders)
    const providers: Provider[] = (data || []).map(provider => ({
      id: provider.users.id,
      email: provider.users.email,
      password: '',
      firstName: provider.users.first_name,
      lastName: provider.users.last_name,
      fullName: provider.users.full_name,
      phone: provider.users.phone,
      role: 'artisan' as const,
      profileImage: provider.users.profile_image,
      studentId: provider.users.student_id,
      department: provider.users.department,
      level: provider.users.level,
      businessName: provider.business_name,
      description: provider.description,
      specialization: provider.specialization || [],
      experience: provider.experience || 0,
      location: provider.location,
      rating: parseFloat(provider.rating) || 0,
      totalReviews: provider.total_reviews || 0,
      verified: provider.verified || false,
      verificationStatus: provider.verification_status as 'pending' | 'approved' | 'rejected',
      verificationEvidence: provider.verification_evidence || [],
      portfolio: [],
      skills: [],
      availability: {
        isAvailable: provider.availability_is_available || false,
        availableForWork: provider.availability_available_for_work || false,
        availableForLearning: provider.availability_available_for_learning || false,
        responseTime: provider.availability_response_time || 'Usually responds within 24 hours'
      },
      pricing: {
        baseRate: parseFloat(provider.pricing_base_rate) || undefined,
        learningRate: parseFloat(provider.pricing_learning_rate) || undefined,
        currency: provider.pricing_currency || 'NGN'
      },
      whatsappNumber: provider.whatsapp_number || provider.users.phone,
      createdAt: new Date(provider.users.created_at),
      updatedAt: new Date(provider.users.updated_at)
    }))

    return providers
  } catch (error) {
    console.error('Error in searchProviders:', error)
    return []
  }
}

// Database health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // First check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('ℹ️ Supabase not configured, using mock data')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing')
      console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
      return false
    }

    console.log('🔍 Testing database connection...')
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('❌ Database query failed:', error.message)
      console.error('Error details:', error)
      return false
    }

    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}
