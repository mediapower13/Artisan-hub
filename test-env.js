// Test environment variables specifically
require('dotenv').config({ path: '.env.local' })

console.log('🔍 Environment Variable Test')
console.log('============================')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('URL:', url ? url.substring(0, 30) + '...' : 'MISSING')
console.log('ANON KEY:', key ? key.substring(0, 30) + '...' : 'MISSING')
console.log('SERVICE KEY:', serviceKey ? serviceKey.substring(0, 30) + '...' : 'MISSING')

// Test the same logic as isSupabaseConfigured
const isConfigured = !!(url && key && url !== 'your-supabase-url' && key !== 'your-supabase-anon-key')
console.log('\nConfiguration Check:', isConfigured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED')

if (!isConfigured) {
  console.log('❌ This is why database connection is failing!')
  console.log('The app thinks Supabase is not configured.')
} else {
  console.log('✅ Environment looks good - testing actual connection...')
  
  // Test actual connection
  async function testConnection() {
    try {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(url, key)
      
      const { data, error } = await supabase
        .from('users')
        .select('count', { count: 'exact' })
        .limit(1)
      
      if (error) {
        console.log('❌ Database query failed:', error.message)
        console.log('This explains the fallback to demo data!')
      } else {
        console.log('✅ Database connection successful!')
        console.log('The issue might be elsewhere in your app.')
      }
    } catch (error) {
      console.log('❌ Connection error:', error.message)
    }
  }
  
  testConnection()
}
