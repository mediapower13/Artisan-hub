const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Database Integration Status Check')
console.log('===================================')

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ Environment variables missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStatus() {
  try {
    console.log('\n1. Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`)
      console.log('\n💡 Possible issues:')
      console.log('   - Database tables not created yet')
      console.log('   - RLS policies preventing access')
      console.log('   - Network connectivity issues')
      return
    }
    
    console.log('   ✅ Basic connection working')
    
    // Test providers query (same as marketplace uses)
    console.log('\n2. Testing providers query...')
    const { data: providers, error: providerError } = await supabase
      .from('providers')
      .select(`
        *,
        users!inner(
          id,
          first_name,
          last_name,
          full_name,
          phone,
          profile_image
        )
      `)
      .eq('verification_status', 'approved')
      .order('rating', { ascending: false })
    
    if (providerError) {
      console.log(`   ❌ Providers query failed: ${providerError.message}`)
    } else {
      console.log(`   ✅ Providers query successful: ${providers?.length || 0} providers found`)
      if (providers && providers.length > 0) {
        console.log(`   📋 Sample: ${providers[0].business_name}`)
      }
    }
    
    // Test categories query
    console.log('\n3. Testing categories query...')
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (categoryError) {
      console.log(`   ❌ Categories query failed: ${categoryError.message}`)
    } else {
      console.log(`   ✅ Categories query successful: ${categories?.length || 0} categories found`)
      if (categories && categories.length > 0) {
        console.log(`   📋 Sample: ${categories[0].name}`)
      }
    }
    
    // Summary
    const hasProviders = providers && providers.length > 0
    const hasCategories = categories && categories.length > 0
    
    console.log('\n📊 Database Status Summary:')
    console.log('==========================')
    console.log(`Connection: ✅ Working`)
    console.log(`Providers: ${hasProviders ? '✅' : '⚠️'} ${providers?.length || 0} found`)
    console.log(`Categories: ${hasCategories ? '✅' : '⚠️'} ${categories?.length || 0} found`)
    
    if (hasProviders && hasCategories) {
      console.log('\n🎉 Database is fully functional!')
      console.log('   Your marketplace will load real data from Supabase.')
    } else {
      console.log('\n⚠️ Database needs data population.')
      console.log('   The marketplace will show "No data" until providers/categories are added.')
    }
    
    console.log('\n📱 Next steps:')
    console.log('   1. Run: npm run dev')
    console.log('   2. Visit: http://localhost:3000/marketplace')
    console.log('   3. Check the status indicator at the top of the page')
    
  } catch (error) {
    console.error('\n❌ Status check failed:', error.message)
    console.log('   The app will use mock data as fallback.')
  }
}

checkStatus()
