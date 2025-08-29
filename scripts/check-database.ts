import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  const tables = ['categories', 'users', 'providers', 'skills', 'enrollments']

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })

      if (error) {
        console.log(`${table}: Error - ${error.message}`)
      } else {
        console.log(`${table}: ${count} records`)
        if (data && data.length > 0) {
          console.log(`  Sample: ${JSON.stringify(data[0], null, 2)}`)
        }
      }
    } catch (err) {
      console.log(`${table}: Error - ${err}`)
    }
  }
}

checkDatabase()
