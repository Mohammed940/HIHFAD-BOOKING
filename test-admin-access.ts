import { createClient } from '@supabase/supabase-js';

// Create a supabase client
const supabase = createClient(
  'https://zvcbgtnrlajbfjbelamp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM'
);

async function testAdminAccess() {
  try {
    // Test if we can access the admin_roles table
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .limit(5);

    if (error) {
      console.log('Error accessing admin_roles:', error.message);
      return;
    }

    console.log('Admin roles data:', data);
    
    // Check if there are any super_admin roles
    const superAdminRoles = data?.filter(role => role.role === 'super_admin');
    console.log('Super admin roles:', superAdminRoles);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testAdminAccess();