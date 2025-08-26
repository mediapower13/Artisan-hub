#!/usr/bin/env node

/**
 * Simple Database Connection Test for Unilorin Artisan Platform
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Testing Supabase Database Connection')
console.log('=====================================')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('URL found:', !!supabaseUrl)
  console.error('Service Key found:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('🔍 Testing basic connection...')
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' }).limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.log('\n💡 This usually means:')
      console.log('1. The database tables haven\'t been created yet')
      console.log('2. Run the complete-database-setup.sql script in your Supabase SQL Editor')
      console.log('3. Make sure your Supabase project is active')
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log(`📊 Users table has ${data?.length || 0} records`)
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

async function checkTables() {
  console.log('\n📋 Checking required tables...')
  const requiredTables = ['users', 'providers', 'categories', 'skills', 'enrollments']
  
  for (const table of requiredTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(0)
      
      if (error) {
        console.log(`   ❌ ${table}: Missing or error - ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: Found (${count || 0} records)`)
      }
    } catch (err) {
      console.log(`   ❌ ${table}: Error - ${err.message}`)
    }
  }
}

async function seedSampleData() {
  console.log('\n🌱 Checking if sample data is needed...')
  
  try {
    // Check if we have any categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('count', { count: 'exact' })
    
    if (catError) {
      console.log('❌ Cannot check categories:', catError.message)
      return
    }
    
    if (!categories || categories.length === 0) {
      console.log('📝 No categories found. Adding sample categories...')
      
      const sampleCategories = [
        { name: 'Fashion & Tailoring', description: 'Learn clothing design, tailoring, and fashion creation', icon: '👗' },
        { name: 'Technology & Repairs', description: 'Phone repairs, computer maintenance, and tech skills', icon: '📱' },
        { name: 'Beauty & Wellness', description: 'Hair styling, makeup, skincare, and wellness services', icon: '💄' },
        { name: 'Food & Catering', description: 'Cooking, baking, catering, and food business', icon: '🍳' },
        { name: 'Arts & Crafts', description: 'Painting, sculpture, crafts, and creative arts', icon: '🎨' },
        { name: 'Construction & Trades', description: 'Carpentry, plumbing, electrical work, and building trades', icon: '🔨' }
      ]
      
      for (const category of sampleCategories) {
        const { error } = await supabase.from('categories').insert(category)
        if (error && !error.message.includes('already exists')) {
          console.log(`   ⚠️ Error adding ${category.name}:`, error.message)
        } else {
          console.log(`   ✅ Added category: ${category.name}`)
        }
      }
    } else {
      console.log('✅ Categories already exist, skipping seed')
    }
    
  } catch (err) {
    console.log('❌ Error seeding data:', err.message)
  }
}

async function main() {
  const connected = await testConnection()
  
  if (connected) {
    await checkTables()
    await seedSampleData()
    
    console.log('\n🎉 Database is ready!')
    console.log('💡 You can now run your development server:')
    console.log('   npm run dev')
    console.log('\n📱 Your marketplace will load data from Supabase!')
  } else {
    console.log('\n❌ Setup incomplete. Please:')
    console.log('1. Go to your Supabase project: https://flkiudofmowhctfplqub.supabase.co')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the script: scripts/complete-database-setup.sql')
    console.log('4. Run this test again: node scripts/test-supabase.js')
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
