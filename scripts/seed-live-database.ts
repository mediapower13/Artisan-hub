import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for seeding')
}

// Create admin client for seeding
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
        // Seed categories first
    console.log('📂 Seeding categories...')
    const categories = [
      {
        id: randomUUID(),
        name: 'Fashion Design',
        description: 'Tailoring, sewing, and fashion-related skills',
        icon: 'scissors'
      },
      {
        id: randomUUID(),
        name: 'Electrical Work',
        description: 'Electrical installations and repairs',
        icon: 'zap'
      },
      {
        id: randomUUID(),
        name: 'Plumbing',
        description: 'Plumbing installations and repairs',
        icon: 'droplets'
      },
      {
        id: randomUUID(),
        name: 'Web Development',
        description: 'Website and web application development',
        icon: 'code'
      },
      {
        id: randomUUID(),
        name: 'Graphics Design',
        description: 'Logo design, branding, and visual content creation',
        icon: 'palette'
      }
    ]

    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from('categories')
      .upsert(categories, { onConflict: 'id' })

    if (categoryError) throw categoryError
    console.log('✅ Categories seeded successfully')

        // Seed users
    console.log('👥 Seeding users...')
    const users = [
      {
        id: randomUUID(),
        email: 'adeola.thompson@unilorin.edu.ng',
        password: '$2b$10$hashedpassword1', // Placeholder hashed password
        first_name: 'Adeola',
        last_name: 'Thompson',
        phone: '+2348012345678',
        role: 'artisan'
      },
      {
        id: randomUUID(),
        email: 'kemi.adeyemi@unilorin.edu.ng',
        password: '$2b$10$hashedpassword2', // Placeholder hashed password
        first_name: 'Kemi',
        last_name: 'Adeyemi',
        phone: '+2348012345679',
        role: 'artisan'
      },
      {
        id: randomUUID(),
        email: 'tunde.bakare@unilorin.edu.ng',
        password: '$2b$10$hashedpassword3', // Placeholder hashed password
        first_name: 'Tunde',
        last_name: 'Bakare',
        phone: '+2348012345680',
        role: 'artisan'
      },
      {
        id: randomUUID(),
        email: 'grace.okafor@unilorin.edu.ng',
        password: '$2b$10$hashedpassword4', // Placeholder hashed password
        first_name: 'Grace',
        last_name: 'Okafor',
        phone: '+2348012345681',
        role: 'artisan'
      },
      {
        id: randomUUID(),
        email: 'mike.adeyinka@unilorin.edu.ng',
        password: '$2b$10$hashedpassword5', // Placeholder hashed password
        first_name: 'Mike',
        last_name: 'Adeyinka',
        phone: '+2348012345682',
        role: 'artisan'
      }
    ]

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .upsert(users, { onConflict: 'id' })

    if (userError) throw userError
    console.log('✅ Users seeded successfully')

    // Store user IDs for reference
    const userIds = users.map(u => u.id)

    // Seed providers
    console.log('🏪 Seeding providers...')
    const providers = [
      {
        id: randomUUID(),
        user_id: userIds[0],
        business_name: 'Adeola\'s Fashion Hub',
        description: 'Professional tailoring and fashion design services. Specializing in traditional and modern clothing.',
        location: 'Ilorin, Kwara State',
        specialization: ['Fashion Design', 'Tailoring', 'Traditional Wear'],
        experience: 8,
        rating: 4.8,
        total_reviews: 45,
        verified: true,
        verification_status: 'approved',
        whatsapp_number: '+2348012345678',
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: true,
        availability_response_time: '2 hours',
        pricing_base_rate: 5000,
        pricing_learning_rate: 3000,
        pricing_currency: 'NGN'
      },
      {
        id: randomUUID(),
        user_id: userIds[1],
        business_name: 'Kemi\'s Couture',
        description: 'High-end fashion design and bespoke tailoring. Creating unique pieces for special occasions.',
        location: 'Ilorin, Kwara State',
        specialization: ['Fashion Design', 'Bespoke Tailoring', 'Wedding Gowns'],
        experience: 12,
        rating: 4.9,
        total_reviews: 67,
        verified: true,
        verification_status: 'approved',
        whatsapp_number: '+2348012345679',
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: false,
        availability_response_time: '1 hour',
        pricing_base_rate: 8000,
        pricing_learning_rate: 5000,
        pricing_currency: 'NGN'
      },
      {
        id: randomUUID(),
        user_id: userIds[2],
        business_name: 'Tunde Electrical Services',
        description: 'Professional electrical installations, repairs, and maintenance. Licensed electrician with 10+ years experience.',
        location: 'Ilorin, Kwara State',
        specialization: ['Electrical Work', 'Home Wiring', 'Generator Repair'],
        experience: 10,
        rating: 4.7,
        total_reviews: 38,
        verified: true,
        verification_status: 'approved',
        whatsapp_number: '+2348012345680',
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: true,
        availability_response_time: '3 hours',
        pricing_base_rate: 6000,
        pricing_learning_rate: 4000,
        pricing_currency: 'NGN'
      },
      {
        id: randomUUID(),
        user_id: userIds[3],
        business_name: 'Grace Graphics Studio',
        description: 'Creative graphics design services. Logo design, branding, and digital marketing materials.',
        location: 'Ilorin, Kwara State',
        specialization: ['Graphics Design', 'Logo Design', 'Branding'],
        experience: 6,
        rating: 4.6,
        total_reviews: 29,
        verified: true,
        verification_status: 'approved',
        whatsapp_number: '+2348012345681',
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: true,
        availability_response_time: '4 hours',
        pricing_base_rate: 4000,
        pricing_learning_rate: 2500,
        pricing_currency: 'NGN'
      },
      {
        id: randomUUID(),
        user_id: userIds[4],
        business_name: 'Mike Web Solutions',
        description: 'Full-stack web development and digital solutions. Building modern websites and web applications.',
        location: 'Ilorin, Kwara State',
        specialization: ['Web Development', 'Frontend Development', 'Backend Development'],
        experience: 7,
        rating: 4.8,
        total_reviews: 52,
        verified: true,
        verification_status: 'approved',
        whatsapp_number: '+2348012345682',
        availability_is_available: true,
        availability_available_for_work: true,
        availability_available_for_learning: true,
        availability_response_time: '2 hours',
        pricing_base_rate: 7000,
        pricing_learning_rate: 4500,
        pricing_currency: 'NGN'
      }
    ]

    const { data: providerData, error: providerError } = await supabaseAdmin
      .from('providers')
      .upsert(providers, { onConflict: 'id' })

    if (providerError) throw providerError
    console.log('✅ Providers seeded successfully')

    // Store provider IDs for reference
    const providerIds = providers.map(p => p.id)

    // Seed skills
    console.log('📚 Seeding skills...')
    const skills = [
      {
        id: randomUUID(),
        provider_id: providerIds[0],
        title: 'Basic Tailoring Techniques',
        description: 'Learn fundamental tailoring skills including measuring, cutting, and sewing basic garments.',
        category: 'Fashion Design',
        difficulty: 'beginner',
        duration: '4 weeks',
        price: 15000,
        max_students: 10,
        current_students: 3,
        syllabus: ['Measuring and marking', 'Fabric cutting', 'Basic stitching', 'Hemming techniques'],
        requirements: ['Sewing machine (optional)', 'Basic fabrics', 'Measuring tape', 'Commitment to practice']
      },
      {
        id: randomUUID(),
        provider_id: providerIds[1],
        title: 'Advanced Fashion Design',
        description: 'Master advanced fashion design techniques and create your own clothing line.',
        category: 'Fashion Design',
        difficulty: 'advanced',
        duration: '8 weeks',
        price: 35000,
        max_students: 5,
        current_students: 2,
        syllabus: ['Design sketching', 'Pattern making', 'Advanced sewing', 'Fashion marketing'],
        requirements: ['Basic tailoring knowledge', 'Design software', 'Portfolio materials', 'Business plan']
      },
      {
        id: randomUUID(),
        provider_id: providerIds[2],
        title: 'Home Electrical Wiring',
        description: 'Learn safe electrical wiring practices for residential installations.',
        category: 'Electrical Work',
        difficulty: 'intermediate',
        duration: '6 weeks',
        price: 25000,
        max_students: 8,
        current_students: 4,
        syllabus: ['Electrical safety', 'Circuit basics', 'Wiring techniques', 'Testing procedures'],
        requirements: ['Basic electrical knowledge', 'Safety equipment', 'Tools', 'Commitment to safety']
      },
      {
        id: randomUUID(),
        provider_id: providerIds[3],
        title: 'Logo Design Masterclass',
        description: 'Create professional logos and branding materials using modern design tools.',
        category: 'Graphics Design',
        difficulty: 'intermediate',
        duration: '5 weeks',
        price: 20000,
        max_students: 12,
        current_students: 6,
        syllabus: ['Design principles', 'Color theory', 'Typography', 'Brand identity'],
        requirements: ['Computer with design software', 'Creative mindset', 'Basic computer skills']
      },
      {
        id: randomUUID(),
        provider_id: providerIds[4],
        title: 'Full-Stack Web Development',
        description: 'Build complete web applications using modern technologies and best practices.',
        category: 'Web Development',
        difficulty: 'advanced',
        duration: '12 weeks',
        price: 50000,
        max_students: 6,
        current_students: 3,
        syllabus: ['HTML/CSS/JavaScript', 'React/Next.js', 'Node.js/Express', 'Database design', 'Deployment'],
        requirements: ['Basic programming knowledge', 'Computer with internet', 'Time commitment', 'Problem-solving skills']
      }
    ]

    const { data: skillData, error: skillError } = await supabaseAdmin
      .from('skills')
      .upsert(skills, { onConflict: 'id' })

    if (skillError) throw skillError
    console.log('✅ Skills seeded successfully')

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${categories.length} categories`)
    console.log(`   - ${users.length} users`)
    console.log(`   - ${providers.length} providers`)
    console.log(`   - ${skills.length} skills`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDatabase()
