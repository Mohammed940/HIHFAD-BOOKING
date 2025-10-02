const { createClient } = require('@supabase/supabase-js');

// Supabase credentials from environment variables
require('dotenv').config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initDatabase() {
  console.log('Initializing database...');
  
  try {
    // Read the SQL files
    const fs = require('fs');
    const path = require('path');
    
    // Run schema creation script
    const schemaSql = fs.readFileSync(path.join(__dirname, 'scripts', '001_create_database_schema.sql'), 'utf8');
    console.log('Creating database schema...');
    
    // Note: Supabase JS client doesn't support running raw SQL directly
    // We'll need to use the Supabase dashboard or CLI for this
    console.log('Please run the SQL scripts in the Supabase SQL editor:');
    console.log('1. scripts/001_create_database_schema.sql');
    console.log('2. scripts/002_seed_sample_data.sql');
    console.log('3. scripts/003_create_super_admin.sql (after registering a user)');
    
    console.log('\nTo access the Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Sign in to your account');
    console.log('3. Select your project (zvcbgtnrlajbfjbelamp)');
    console.log('4. Go to SQL Editor in the left sidebar');
    console.log('5. Run the SQL scripts mentioned above');
    
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
}

initDatabase();