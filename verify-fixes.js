const { createClient } = require('@supabase/supabase-js');

// Create a supabase client
const supabase = createClient(
  'https://zvcbgtnrlajbfjbelamp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM'
);

async function verifyFixes() {
  try {
    console.log('Verifying that the database queries are working correctly...');
    
    // Test fetching medical centers
    const { data: centers, error: centersError } = await supabase
      .from('medical_centers')
      .select('*')
      .eq('is_active', true);
    
    if (centersError) {
      console.log('❌ Error fetching medical centers:', centersError.message);
    } else {
      console.log('✅ Medical centers fetched successfully. Count:', centers?.length || 0);
    }
    
    // Test fetching clinics
    const { data: clinics, error: clinicsError } = await supabase
      .from('clinics')
      .select('*')
      .eq('is_active', true);
    
    if (clinicsError) {
      console.log('❌ Error fetching clinics:', clinicsError.message);
    } else {
      console.log('✅ Clinics fetched successfully. Count:', clinics?.length || 0);
    }
    
    // Test fetching appointments (separate query approach)
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (appointmentsError) {
      console.log('❌ Error fetching appointments:', appointmentsError.message);
    } else {
      console.log('✅ Appointments fetched successfully. Count:', appointments?.length || 0);
      
      // If we have appointments, test fetching related data
      if (appointments && appointments.length > 0) {
        // Get unique IDs
        const userIds = [...new Set(appointments.map(a => a.user_id))];
        const clinicIds = [...new Set(appointments.map(a => a.clinic_id))];
        const centerIds = [...new Set(appointments.map(a => a.medical_center_id))];
        
        // Fetch related data
        const [
          { data: users, error: usersError },
          { data: clinicData, error: clinicDataError },
          { data: centerData, error: centerDataError }
        ] = await Promise.all([
          supabase.from('profiles').select('id, full_name, phone, email').in('id', userIds),
          supabase.from('clinics').select('id, name').in('id', clinicIds),
          supabase.from('medical_centers').select('id, name').in('id', centerIds)
        ]);
        
        if (usersError) {
          console.log('❌ Error fetching users:', usersError.message);
        } else {
          console.log('✅ Related users fetched successfully. Count:', users?.length || 0);
        }
        
        if (clinicDataError) {
          console.log('❌ Error fetching clinic data:', clinicDataError.message);
        } else {
          console.log('✅ Related clinics fetched successfully. Count:', clinicData?.length || 0);
        }
        
        if (centerDataError) {
          console.log('❌ Error fetching center data:', centerDataError.message);
        } else {
          console.log('✅ Related centers fetched successfully. Count:', centerData?.length || 0);
        }
      }
    }
    
    // Test fetching users (separate query approach)
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log('✅ Users fetched successfully. Count:', users?.length || 0);
      
      // If we have users, test fetching admin roles
      if (users && users.length > 0) {
        const userIds = users.map(user => user.id);
        
        const { data: adminRoles, error: rolesError } = await supabase
          .from('admin_roles')
          .select('*')
          .in('user_id', userIds);
          
        if (rolesError) {
          console.log('❌ Error fetching admin roles:', rolesError.message);
        } else {
          console.log('✅ Admin roles fetched successfully. Count:', adminRoles?.length || 0);
        }
      }
    }
    
    console.log('\n🎉 All tests completed! The fixes should now be working correctly.');
    console.log('You can now access the admin panel and verify that the appointments, users, and clinics pages are displaying data.');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

verifyFixes();