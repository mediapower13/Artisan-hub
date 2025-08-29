import {
  getProviders,
  getProviderById,
  getSkills,
  getSkillById,
  getCategories,
  getCategoryById,
  createProvider,
  createSkill,
  createCategory
} from './supabase'
import type { Artisan, Category, Skill } from './types'

// Re-export types from the main types file
export type { Artisan, Category, Skill } from './types'

// Database connection check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Try to fetch a small amount of data to test connection
    await getAllCategories()
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Provider operations
export async function getAllProviders(): Promise<Artisan[]> {
  try {
    const providers = await getProviders()

    // Transform providers to match the Artisan interface
    return providers.map((provider: any) => ({
      id: provider.id,
      email: provider.user?.email || '',
      password: '', // Not returned from database for security
      firstName: provider.user?.first_name || '',
      lastName: provider.user?.last_name || '',
      fullName: provider.user ? `${provider.user.first_name} ${provider.user.last_name}` : provider.business_name,
      phone: provider.user?.phone || '',
      role: 'artisan' as const,
      profileImage: provider.user?.profile_image || '/placeholder-user.jpg',
      businessName: provider.business_name,
      description: provider.description,
      specialization: provider.specialization || [],
      experience: provider.experience,
      location: provider.location,
      rating: provider.rating || 0,
      totalReviews: provider.total_reviews || 0,
      verified: provider.verified || false,
      verificationStatus: provider.verification_status || 'pending',
      portfolio: [], // Will be populated separately if needed
      skills: provider.skills || [],
      availability: {
        isAvailable: provider.availability_is_available || false,
        availableForWork: provider.availability_available_for_work || false,
        availableForLearning: provider.availability_available_for_learning || false,
        responseTime: provider.availability_response_time || '24h'
      },
      pricing: {
        baseRate: provider.pricing_base_rate || 0,
        learningRate: provider.pricing_learning_rate || 0,
        currency: provider.pricing_currency || 'NGN'
      },
      whatsappNumber: provider.whatsapp_number,
      createdAt: new Date(provider.created_at),
      updatedAt: new Date(provider.updated_at)
    }))
  } catch (error) {
    console.error('Error fetching providers:', error)
    throw new Error('Failed to fetch providers')
  }
}
// Category operations
export async function getAllCategories(): Promise<Category[]> {
  try {
    const categories = await getCategories()

    // Transform categories to match the Category interface
    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon || 'default-icon',
      skillCount: category.skill_count || 0,
      providerCount: category.provider_count || 0,
      artisanCount: category.provider_count || 0, // For compatibility
      skills: category.skills || []
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}

// Skills operations
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const skills = await getSkills()

    // Transform skills to match the Skill interface
    return skills.map((skill: any) => ({
      id: skill.id,
      artisanId: skill.provider_id,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      difficulty: skill.difficulty,
      duration: skill.duration,
      price: skill.price,
      maxStudents: skill.max_students,
      currentStudents: skill.current_students || 0,
      images: skill.images || [],
      syllabus: skill.syllabus || [],
      requirements: skill.requirements || [],
      instructor: skill.provider ? {
        id: skill.provider.id,
        name: skill.provider.user ? `${skill.provider.user.first_name} ${skill.provider.user.last_name}` : skill.provider.business_name,
        image: skill.provider.user?.profile_image || '/placeholder-user.jpg',
        rating: skill.provider.rating || 0,
        businessName: skill.provider.business_name
      } : {
        id: '',
        name: 'Unknown Instructor',
        image: '/placeholder-user.jpg',
        rating: 0,
        businessName: 'Unknown'
      },
      createdAt: skill.created_at,
      updatedAt: skill.updated_at
    }))
  } catch (error) {
    console.error('Error fetching skills:', error)
    throw new Error('Failed to fetch skills')
  }
}

// Search providers
export async function searchProviders(query: string): Promise<Artisan[]> {
  try {
    if (!query || query.trim() === '') {
      return await getAllProviders()
    }

    const searchTerm = query.toLowerCase().trim()

    // Get all providers and filter client-side for now
    const allProviders = await getAllProviders()

    const filteredProviders = allProviders.filter(provider =>
      provider.firstName.toLowerCase().includes(searchTerm) ||
      provider.lastName.toLowerCase().includes(searchTerm) ||
      provider.businessName.toLowerCase().includes(searchTerm) ||
      provider.specialization.some(spec => spec.toLowerCase().includes(searchTerm)) ||
      (provider.description && provider.description.toLowerCase().includes(searchTerm))
    )

    return filteredProviders
  } catch (error) {
    console.error('Error searching providers:', error)
    throw new Error('Failed to search providers')
  }
}

// Additional helper functions for completeness
export async function getProviderById(id: string): Promise<Artisan | null> {
  try {
    const providers = await getAllProviders()
    return providers.find(provider => provider.id === id) || null
  } catch (error) {
    console.error('Error fetching provider by ID:', error)
    throw new Error('Failed to fetch provider')
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    const skills = await getAllSkills()
    return skills.find(skill => skill.id === id) || null
  } catch (error) {
    console.error('Error fetching skill by ID:', error)
    throw new Error('Failed to fetch skill')
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const categories = await getAllCategories()
    return categories.find(category => category.id === id) || null
  } catch (error) {
    console.error('Error fetching category by ID:', error)
    throw new Error('Failed to fetch category')
  }
}
