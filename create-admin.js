const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://zvcbgtnrlajbfjbelamp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  console.log('Creating admin user...');
  
  try {
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'mohammed.shaaban940@gmail.com',
      password: 'password123456789',
      options: {
        data: {
          full_name: 'Admin User',
          phone: '+1234567890'
        }
      }
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return;
    }

    console.log('Admin user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
    
    console.log('\nNext steps:');
    console.log('1. Go to https://supabase.com/dashboard/project/zvcbgtnrlajbfjbelamp/sql');
    console.log('2. Run the following SQL to make this user a super admin:');
    console.log(`   INSERT INTO public.admin_roles (user_id, role) VALUES ('${data.user.id}', 'super_admin');`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdminUser();