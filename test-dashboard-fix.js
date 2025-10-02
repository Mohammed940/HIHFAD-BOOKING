const { createClient } = require('@supabase/supabase-js');

// Create a supabase client
const supabase = createClient(
  'https://zvcbgtnrlajbfjbelamp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM'
);

async function testDashboardData() {
  try {
    console.log('Testing dashboard data retrieval...');
    
    // Test fetching medical centers
    const { data: centers, error: centersError } = await supabase
      .from('medical_centers')
      .select('*')
      .eq('is_active', true);
    
    if (centersError) {
      console.log('Error fetching medical centers:', centersError.message);
    } else {
      console.log('Medical centers count:', centers?.length || 0);
    }
    
    // Test fetching clinics
    const { data: clinics, error: clinicsError } = await supabase
      .from('clinics')
      .select('*')
      .eq('is_active', true);
    
    if (clinicsError) {
      console.log('Error fetching clinics:', clinicsError.message);
    } else {
      console.log('Clinics count:', clinics?.length || 0);
    }
    
    // Test fetching appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*');
    
    if (appointmentsError) {
      console.log('Error fetching appointments:', appointmentsError.message);
    } else {
      console.log('Appointments count:', appointments?.length || 0);
    }
    
    // Test fetching users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*');
    
    if (usersError) {
      console.log('Error fetching users:', usersError.message);
    } else {
      console.log('Users count:', users?.length || 0);
    }
    
    // Test fetching admin roles
    const { data: adminRoles, error: adminRolesError } = await supabase
      .from('admin_roles')
      .select('*');
    
    if (adminRolesError) {
      console.log('Error fetching admin roles:', adminRolesError.message);
    } else {
      console.log('Admin roles count:', adminRoles?.length || 0);
    }
    
    console.log('Test completed successfully!');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testDashboardData();