import { getAllProviders, getAllCategories } from '../lib/database-operations.js'

async function testDatabase() {
  try {
    console.log('Testing database operations...')
    const providers = await getAllProviders()
    const categories = await getAllCategories()
    console.log(`Found ${providers.length} providers and ${categories.length} categories`)
    if (providers.length > 0) {
      console.log('Sample provider:', providers[0].businessName, 'from', providers[0].location)
    }
    if (categories.length > 0) {
      console.log('Sample category:', categories[0].name)
    }
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testDatabase()
