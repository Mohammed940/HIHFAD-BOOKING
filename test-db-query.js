const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://zvcbgtnrlajbfjbelamp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM';

console.log('=== Testing Database Query for Admin Role ===\n');

async function testDbQuery() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    console.log('1. Signing in with admin credentials...');
    
    // Sign in with admin credentials
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
    
    console.log('\n2. Testing admin role query...');
    
    // Test the exact query used in requireAdmin function
    const { data: adminRole, error } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", signInData.user.id)
      .eq("is_active", true)
      .single();

    if (error) {
      console.log('❌ Admin role query failed:', error.message);
      
      if (error.message.includes('infinite recursion')) {
        console.log('\n🔧 CONFIRMED: RLS recursion issue');
        console.log('This is preventing the admin role verification');
        console.log('Solution: Run ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;');
      } else {
        console.log('\n❓ Unknown error - please check Supabase dashboard');
      }
    } else if (!adminRole) {
      console.log('❌ No admin role found for user');
      console.log('You need to assign the super_admin role');
    } else {
      console.log('✅ Admin role found:', adminRole.role);
      
      if (adminRole.role === 'super_admin') {
        console.log('🎉 User has super_admin role!');
        console.log('The issue might be elsewhere in the authentication flow');
      } else {
        console.log('⚠️ User has admin role but not super_admin');
      }
    }
    
    console.log('\n3. Testing alternative query (bypassing potential issues)...');
    
    // Try a more direct query
    const { data: allRoles, error: allRolesError } = await supabase
      .from("admin_roles")
      .select("*")
      .eq("user_id", signInData.user.id);

    if (allRolesError) {
      console.log('❌ All roles query failed:', allRolesError.message);
    } else if (allRoles && allRoles.length > 0) {
      console.log('✅ Found roles for user:');
      allRoles.forEach(role => {
        console.log(`   - Role: ${role.role}, Active: ${role.is_active}`);
      });
    } else {
      console.log('❌ No roles found for user');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testDbQuery();