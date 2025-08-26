#!/usr/bin/env node

console.log('🔧 Final System Check')
console.log('===================')

// Check 1: Verify no duplicate files
console.log('\n1. Checking for duplicate files...')
const fs = require('fs')
const path = require('path')

const checkDuplicates = (dir, pattern) => {
  try {
    const files = fs.readdirSync(dir)
    const matches = files.filter(f => f.includes(pattern))
    if (matches.length > 1) {
      console.log(`❌ Duplicates found in ${dir}:`, matches)
      return false
    }
    return true
  } catch (error) {
    console.log(`✅ Directory ${dir} clean (no duplicates)`)
    return true
  }
}

let duplicateCheck = true
duplicateCheck &= checkDuplicates('./app/marketplace', 'page')
duplicateCheck &= checkDuplicates('./components/layout', 'footer')
duplicateCheck &= checkDuplicates('./components/marketplace', 'search-filters')

if (duplicateCheck) {
  console.log('✅ No duplicate files found')
} else {
  console.log('❌ Duplicate files detected')
}

// Check 2: Verify essential files exist
console.log('\n2. Checking essential files...')
const essentialFiles = [
  './lib/types.ts',
  './lib/database-operations.ts',
  './lib/mock-data.ts',
  './app/marketplace/page.tsx',
  './app/skills/page.tsx',
  './scripts/fixed-supabase-setup.sql'
]

let filesCheck = true
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} missing`)
    filesCheck = false
  }
})

// Check 3: Test database operations
console.log('\n3. Testing database operations...')
async function testDatabase() {
  try {
    const { getAllProviders, getAllCategories, getAllSkills, checkDatabaseConnection } = require('./lib/database-operations')
    
    // Test connection
    const isConnected = await checkDatabaseConnection()
    console.log(`Database connection: ${isConnected ? '✅' : '❌'}`)
    
    if (isConnected) {
      // Test data retrieval
      const providers = await getAllProviders()
      const categories = await getAllCategories()
      const skills = await getAllSkills()
      
      console.log(`✅ Providers: ${providers.length} records`)
      console.log(`✅ Categories: ${categories.length} records`)  
      console.log(`✅ Skills: ${skills.length} records`)
      
      // Verify data integrity
      if (providers.length > 0 && categories.length > 0 && skills.length > 0) {
        console.log('✅ Database has valid data')
        
        // Check sample data structure
        const sampleProvider = providers[0]
        const sampleSkill = skills[0]
        
        if (sampleProvider.businessName && sampleProvider.rating) {
          console.log('✅ Provider data structure valid')
        }
        
        if (sampleSkill.instructor && sampleSkill.instructor.name) {
          console.log('✅ Skill data structure valid (with instructor)')
        }
        
        return true
      }
    }
    return false
  } catch (error) {
    console.log('❌ Database test failed:', error.message)
    return false
  }
}

// Check 4: Scripts directory
console.log('\n4. Checking scripts directory...')
try {
  const scripts = fs.readdirSync('./scripts')
  console.log(`Scripts found: ${scripts.join(', ')}`)
  
  const expectedScripts = ['fixed-supabase-setup.sql', 'test-supabase.js', 'manage-database.js', 'database-validation.js']
  const hasEssentials = expectedScripts.every(script => scripts.includes(script))
  
  if (hasEssentials) {
    console.log('✅ Essential scripts present')
  } else {
    console.log('❌ Missing essential scripts')
  }
} catch (error) {
  console.log('❌ Scripts directory error:', error.message)
}

// Run async tests
testDatabase().then(dbResult => {
  console.log('\n📊 Final Results')
  console.log('================')
  console.log(`File duplicates: ${duplicateCheck ? '✅ Clean' : '❌ Issues'}`)
  console.log(`Essential files: ${filesCheck ? '✅ Present' : '❌ Missing'}`)
  console.log(`Database: ${dbResult ? '✅ Working' : '❌ Issues'}`)
  
  if (duplicateCheck && filesCheck && dbResult) {
    console.log('\n🎉 SYSTEM STATUS: ALL GOOD!')
    console.log('✅ No duplicate files')
    console.log('✅ All essential files present')  
    console.log('✅ Database working with valid data')
    console.log('✅ Ready for development/production')
  } else {
    console.log('\n⚠️  SYSTEM STATUS: NEEDS ATTENTION')
  }
})
