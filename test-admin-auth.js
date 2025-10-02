const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://zvcbgtnrlajbfjbelamp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM';

console.log('=== Admin Authentication Test ===\n');

async function testAdminAuth() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    console.log('1. Signing in with admin credentials...');
    
    // Sign in with the admin user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'mohammed.shaaban940@gmail.com',
      password: 'password123456789'
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
      return;
    }

    console.log('✅ Sign in successful');
    console.log('User ID:', signInData.user.id);
    
    console.log('\n2. Testing requireAuth function (simulated)...');
    
    // This simulates the requireAuth function
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ User not authenticated');
      return;
    }
    
    console.log('✅ User is authenticated');
    
    console.log('\n3. Testing requireAdmin function (simulated)...');
    
    // This simulates the requireAdmin function
    // We'll try a different approach to avoid the RLS recursion issue
    try {
      // Try to get admin role without using the problematic query
      const { data: adminRoles, error: adminError } = await supabase.rpc('get_admin_role', {
        user_id: user.id
      });
      
      if (adminError) {
        console.log('⚠️  Error calling get_admin_role function:', adminError.message);
        console.log('This function may not exist. Trying direct query...');
        
        // Try direct query with limited fields
        const { data: directRole, error: directError } = await supabase
          .from('admin_roles')
          .select('role, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1);
          
        if (directError) {
          console.log('❌ Direct query failed:', directError.message);
          console.log('This confirms the RLS recursion issue.');
        } else if (directRole && directRole.length > 0) {
          console.log('✅ Direct query successful');
          console.log('Role:', directRole[0].role);
          console.log('Active:', directRole[0].is_active);
          
          if (directRole[0].role === 'super_admin') {
            console.log('🎉 User has super_admin role!');
          } else {
            console.log('⚠️  User has admin role but not super_admin');
          }
        } else {
          console.log('❌ No active admin role found for user');
        }
      } else {
        console.log('✅ Admin role check successful');
        console.log('Role data:', adminRoles);
      }
    } catch (error) {
      console.log('❌ Admin role check failed:', error.message);
    }
    
    console.log('\n4. Summary:');
    console.log('-----------');
    console.log('✅ User can sign in successfully');
    console.log('✅ User is authenticated');
    console.log('⚠️  There may be an RLS policy issue preventing admin role verification');
    console.log('\nTo fix the RLS issue, please run these SQL commands in your Supabase dashboard:');
    console.log('\n-- Disable RLS temporarily for testing:');
    console.log('ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;');
    console.log('\n-- After testing, you can re-enable with a fixed policy:');
    console.log('-- ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAdminAuth();