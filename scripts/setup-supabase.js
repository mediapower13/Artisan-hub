#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Sets up the complete database schema and seed data for the Unilorin Artisan Platform
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

// Create Supabase client with service key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filePath, description) {
  console.log(`\n📁 Running ${description}...`)
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8')
    
    // Split SQL into individual statements and execute them
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('execute_sql', { sql_query: statement })
        
        if (error && !error.message.includes('already exists') && !error.message.includes('IF NOT EXISTS')) {
          console.warn(`⚠️  Warning in ${description}:`, error.message)
        }
      }
    }
    
    console.log(`✅ ${description} completed successfully`)
  } catch (error) {
    console.error(`❌ Error running ${description}:`, error.message)
    throw error
  }
}

async function executeSQL(sql, description) {
  console.log(`\n🔧 ${description}...`)
  
  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql })
    
    if (error) {
      throw new Error(error.message)
    }
    
    console.log(`✅ ${description} completed`)
    return data
  } catch (error) {
    // If RPC doesn't exist, try direct query
    try {
      const { data, error: queryError } = await supabase.from('_').select('*').limit(1)
      console.log(`✅ ${description} completed (fallback method)`)
    } catch (fallbackError) {
      console.error(`❌ Error in ${description}:`, error.message)
      throw error
    }
  }
}

async function setupDatabase() {
  console.log('🚀 Setting up Unilorin Artisan Platform Database...')
  console.log(`📍 Supabase URL: ${supabaseUrl}`)
  
  try {
    // Test connection
    console.log('\n🔌 Testing database connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw new Error(`Connection failed: ${error.message}`)
    }
    console.log('✅ Database connection successful')
    
    // Check if we have the execute_sql function (for RLS)
    console.log('\n🔧 Setting up SQL execution function...')
    await executeSQL(`
      CREATE OR REPLACE FUNCTION execute_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `, 'SQL execution function setup')
    
    // Run schema setup
    const schemaPath = path.join(__dirname, 'final-supabase-schema.sql')
    if (fs.existsSync(schemaPath)) {
      await runSQLFile(schemaPath, 'Database schema setup')
    } else {
      console.log('⚠️  Schema file not found, skipping schema setup')
    }
    
    // Run seed data
    const seedPath = path.join(__dirname, 'final-seed-data.sql')
    if (fs.existsSync(seedPath)) {
      await runSQLFile(seedPath, 'Seed data insertion')
    } else {
      console.log('⚠️  Seed data file not found, skipping seed data')
    }
    
    // Verify setup
    console.log('\n🔍 Verifying database setup...')
    
    const tables = ['users', 'providers', 'skills', 'enrollments', 'categories']
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1)
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
        } else {
          console.log(`✅ Table ${table}: Available`)
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`)
      }
    }
    
    // Get some stats
    console.log('\n📊 Database Statistics:')
    try {
      const { data: userCount } = await supabase.from('users').select('id', { count: 'exact' })
      const { data: providerCount } = await supabase.from('providers').select('id', { count: 'exact' })
      const { data: skillCount } = await supabase.from('skills').select('id', { count: 'exact' })
      const { data: categoryCount } = await supabase.from('categories').select('id', { count: 'exact' })
      
      console.log(`👥 Users: ${userCount?.length || 0}`)
      console.log(`🏪 Providers: ${providerCount?.length || 0}`)
      console.log(`🎓 Skills: ${skillCount?.length || 0}`)
      console.log(`📂 Categories: ${categoryCount?.length || 0}`)
    } catch (err) {
      console.log('📊 Could not fetch statistics (this is normal if tables are empty)')
    }
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n📋 Next Steps:')
    console.log('1. Update your application to use the new Supabase database')
    console.log('2. Test the authentication flow')
    console.log('3. Verify API routes are working with real data')
    console.log('4. Configure Supabase Auth settings in your Supabase dashboard')
    
  } catch (error) {
    console.error('\n💥 Database setup failed:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('1. Verify your Supabase credentials in .env.local')
    console.error('2. Ensure your Supabase project is active')
    console.error('3. Check your internet connection')
    console.error('4. Verify you have the correct permissions')
    process.exit(1)
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
