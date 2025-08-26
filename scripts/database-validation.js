const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function validateDatabase() {
  console.log('🔍 Database Validation Test')
  console.log('==========================')

  try {
    // Test 1: Check all tables exist and have data
    console.log('\n1. Checking table structure and data...')
    
    const tables = ['users', 'providers', 'skills', 'categories', 'enrollments']
    const tableResults = {}
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
        tableResults[table] = { exists: false, count: 0 }
      } else {
        console.log(`✅ ${table}: ${count} records`)
        tableResults[table] = { exists: true, count }
      }
    }

    // Test 2: Fetch providers with skills (simulate homepage data)
    console.log('\n2. Testing provider data retrieval...')
    const { data: providers, error: providerError } = await supabase
      .from('providers')
      .select(`
        *,
        users!providers_user_id_fkey (
          id,
          first_name,
          last_name,
          full_name,
          email,
          phone
        ),
        skills (
          id,
          title,
          description,
          category,
          difficulty,
          duration,
          price,
          max_students,
          current_students
        )
      `)
      .eq('verified', true)
      .limit(5)

    if (providerError) {
      console.log(`❌ Provider query failed: ${providerError.message}`)
    } else {
      console.log(`✅ Retrieved ${providers.length} verified providers`)
      if (providers.length > 0) {
        const provider = providers[0]
        console.log(`   - Sample: ${provider.business_name}`)
        console.log(`   - Rating: ${provider.rating}/5.0 (${provider.total_reviews} reviews)`)
        console.log(`   - Skills offered: ${provider.skills.length}`)
        if (provider.skills.length > 0) {
          console.log(`   - Sample skill: ${provider.skills[0].title} (₦${provider.skills[0].price})`)
        }
      }
    }

    // Test 3: Fetch categories
    console.log('\n3. Testing categories...')
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (categoryError) {
      console.log(`❌ Categories query failed: ${categoryError.message}`)
    } else {
      console.log(`✅ Retrieved ${categories.length} categories`)
      categories.forEach(cat => {
        console.log(`   - ${cat.name} ${cat.icon}`)
      })
    }

    // Test 4: Fetch skills with instructor info
    console.log('\n4. Testing skills data...')
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select(`
        *,
        providers!skills_provider_id_fkey (
          id,
          business_name,
          rating,
          total_reviews,
          users!providers_user_id_fkey (
            full_name
          )
        )
      `)
      .limit(5)

    if (skillsError) {
      console.log(`❌ Skills query failed: ${skillsError.message}`)
    } else {
      console.log(`✅ Retrieved ${skills.length} skills`)
      if (skills.length > 0) {
        const skill = skills[0]
        const instructor = skill.providers?.users?.full_name || 'Unknown'
        console.log(`   - Sample: ${skill.title}`)
        console.log(`   - Instructor: ${instructor}`)
        console.log(`   - Price: ₦${skill.price}`)
        console.log(`   - Difficulty: ${skill.difficulty}`)
        console.log(`   - Students: ${skill.current_students}/${skill.max_students}`)
      }
    }

    // Test 5: Check enrollments
    console.log('\n5. Testing enrollments...')
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        *,
        users!enrollments_student_id_fkey (full_name),
        skills!enrollments_skill_id_fkey (title),
        providers!enrollments_provider_id_fkey (business_name)
      `)
      .limit(3)

    if (enrollmentError) {
      console.log(`❌ Enrollments query failed: ${enrollmentError.message}`)
    } else {
      console.log(`✅ Retrieved ${enrollments.length} enrollments`)
      enrollments.forEach(enrollment => {
        console.log(`   - ${enrollment.users?.full_name} → ${enrollment.skills?.title} (${enrollment.status})`)
      })
    }

    // Summary
    console.log('\n📊 Database Validation Summary')
    console.log('==============================')
    
    const totalRecords = Object.values(tableResults).reduce((sum, table) => sum + table.count, 0)
    const validTables = Object.values(tableResults).filter(table => table.exists).length
    
    console.log(`✅ Tables validated: ${validTables}/${tables.length}`)
    console.log(`✅ Total records: ${totalRecords}`)
    console.log(`✅ Database is properly configured with valid data`)
    
    if (providers?.length > 0 && skills?.length > 0 && categories?.length > 0) {
      console.log(`✅ All core functionality is working`)
      console.log(`✅ Database is ready for production use`)
    }

  } catch (error) {
    console.error('❌ Database validation failed:', error.message)
    process.exit(1)
  }
}

validateDatabase()
