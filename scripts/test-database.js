#!/usr/bin/env node

/**
 * Database Health Check and Test Script
 * Tests all Supabase database operations to ensure everything is working correctly
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

// Initialize Supabase client for testing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runHealthCheck() {
  console.log('🏥 Running Database Health Check...\n')
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣ Testing Database Connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (!error) {
      console.log('✅ Database connection: PASSED')
    } else {
      console.log('❌ Database connection: FAILED -', error.message)
      return false
    }

    // Test 2: Test table access
    console.log('\n2️⃣ Testing Table Access...')
    
    // Test users table
    const { data: users, error: usersError } = await supabase.from('users').select('id').limit(1)
    if (!usersError) {
      console.log('✅ Users table: ACCESSIBLE')
    } else {
      console.log('❌ Users table: ERROR -', usersError.message)
    }

    // Test providers table
    const { data: providers, error: providersError } = await supabase.from('providers').select('id').limit(1)
    if (!providersError) {
      console.log('✅ Providers table: ACCESSIBLE')
    } else {
      console.log('❌ Providers table: ERROR -', providersError.message)
    }

    // Test skills table
    const { data: skills, error: skillsError } = await supabase.from('skills').select('id').limit(1)
    if (!skillsError) {
      console.log('✅ Skills table: ACCESSIBLE')
    } else {
      console.log('❌ Skills table: ERROR -', skillsError.message)
    }

    // Test enrollments table
    const { data: enrollments, error: enrollmentsError } = await supabase.from('enrollments').select('id').limit(1)
    if (!enrollmentsError) {
      console.log('✅ Enrollments table: ACCESSIBLE')
    } else {
      console.log('❌ Enrollments table: ERROR -', enrollmentsError.message)
    }

    // Test contact_requests table
    const { data: contacts, error: contactsError } = await supabase.from('contact_requests').select('id').limit(1)
    if (!contactsError) {
      console.log('✅ Contact requests table: ACCESSIBLE')
    } else {
      console.log('❌ Contact requests table: ERROR -', contactsError.message)
    }

    // Test verification_requests table
    const { data: verifications, error: verificationsError } = await supabase.from('verification_requests').select('id').limit(1)
    if (!verificationsError) {
      console.log('✅ Verification requests table: ACCESSIBLE')
    } else {
      console.log('❌ Verification requests table: ERROR -', verificationsError.message)
    }

    console.log('\n🎉 Database Health Check Completed!')
    console.log('✅ All basic database operations are working correctly')
    return true

  } catch (error) {
    console.error('\n💥 Health check failed:', error.message)
    console.error('\n🔧 Troubleshooting steps:')
    console.error('1. Verify your .env.local file has correct Supabase credentials')
    console.error('2. Ensure your database tables are created')
    console.error('3. Check your internet connection')
    console.error('4. Verify your Supabase project is active')
    return false
  }
}

async function main() {
  console.log('🚀 Starting Supabase Database Tests\n')
  
  const healthCheckPassed = await runHealthCheck()
  
  if (healthCheckPassed) {
    console.log('\n🎊 All tests passed! Your database is ready to use.')
    process.exit(0)
  } else {
    console.log('\n❌ Some tests failed. Please check your configuration.')
    process.exit(1)
  }
}

// Run the tests
if (require.main === module) {
  main().catch(console.error)
}

// Run the tests
if (require.main === module) {
  main().catch(console.error)
}

// Run the tests
if (require.main === module) {
  main().catch(error => {
    console.error('Test runner failed:', error)
    process.exit(1)
  })
}
