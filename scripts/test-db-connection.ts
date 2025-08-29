import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  console.log('URL:', supabaseUrl.substring(0, 30) + '...')

  try {
    // Test connection by fetching counts
    const tables = ['categories', 'users', 'providers', 'skills', 'enrollments']

    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ ${table}: Error - ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count} records`)
      }
    }

    console.log('🎉 Database connection test completed!')
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message)
  }
}

testDatabaseConnection()
