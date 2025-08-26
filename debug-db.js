// Quick database connection test
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Database Connection Debug')
console.log('============================')

// Check environment variables
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Environment Variables:')
console.log('- SUPABASE_URL:', url ? '✅ Set' : '❌ Missing')
console.log('- ANON_KEY:', anonKey ? '✅ Set' : '❌ Missing')
console.log('- SERVICE_KEY:', serviceKey ? '✅ Set' : '❌ Missing')

if (!url || !anonKey) {
  console.log('\n❌ Missing required environment variables!')
  console.log('This is why the connection is failing.')
  process.exit(1)
}

// Test connection
async function testConnection() {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)
    
    console.log('\nTesting connection...')
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      return false
    } else {
      console.log('✅ Connection successful!')
      return true
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ Database is working - check your app logic')
  } else {
    console.log('\n❌ Database connection failed - this explains the demo data fallback')
  }
})
