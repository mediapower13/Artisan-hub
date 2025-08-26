const { getAllProviders, getAllCategories, checkDatabaseConnection } = require('./lib/database-operations.ts')

async function checkStatus() {
  console.log('🔍 Database Integration Status Check')
  console.log('===================================')
  
  try {
    // Test database connection
    console.log('\n1. Testing database connection...')
    const isConnected = await checkDatabaseConnection()
    console.log(`   Database connection: ${isConnected ? '✅ Working' : '❌ Failed'}`)
    
    if (isConnected) {
      // Test providers query
      console.log('\n2. Testing providers query...')
      const providers = await getAllProviders()
      console.log(`   Providers found: ${providers.length}`)
      
      if (providers.length > 0) {
        console.log('   Sample provider:', providers[0].businessName)
      }
      
      // Test categories query
      console.log('\n3. Testing categories query...')
      const categories = await getAllCategories()
      console.log(`   Categories found: ${categories.length}`)
      
      if (categories.length > 0) {
        console.log('   Sample category:', categories[0].name)
      }
      
      console.log('\n🎉 Database integration is working!')
      console.log('   Your marketplace will load data from Supabase.')
      console.log('\n📱 Next steps:')
      console.log('   1. Run: npm run dev')
      console.log('   2. Visit: http://localhost:3000/marketplace')
      console.log('   3. You should see real data from your Supabase database')
      
    } else {
      console.log('\n❌ Database connection failed.')
      console.log('   The app will fall back to mock data.')
      console.log('\n🔧 To fix:')
      console.log('   1. Check your Supabase project is active')
      console.log('   2. Verify your .env.local credentials')
      console.log('   3. Ensure database tables are created')
    }
    
  } catch (error) {
    console.error('\n❌ Status check failed:', error.message)
    console.log('   The app will use mock data as fallback.')
  }
}

checkStatus()
