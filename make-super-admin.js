const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://zvcbgtnrlajbfjbelamp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function makeSuperAdmin(email) {
  console.log(`Making ${email} a super admin...`);
  
  try {
    // First, we need to get the user ID by their email
    // Note: This requires service role key for production, but for development we can try this approach
    
    // Alternative approach: Sign in the user first to get their ID
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'password123456789'
    });

    if (signInError) {
      console.error('Error signing in:', signInError.message);
      console.log('Please sign in through the web interface first, then run this script again.');
      return;
    }

    const userId = signInData.user.id;
    console.log('User ID:', userId);

    // Now assign the super admin role
    const { data, error } = await supabase
      .from('admin_roles')
      .insert([
        {
          user_id: userId,
          role: 'super_admin'
        }
      ]);

    if (error) {
      // If insert fails because role already exists, try updating
      if (error.message.includes('duplicate key value')) {
        console.log('User already has an admin role. Updating to super_admin...');
        const { data: updateData, error: updateError } = await supabase
          .from('admin_roles')
          .update({ role: 'super_admin', is_active: true })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating admin role:', updateError.message);
          return;
        }
        
        console.log('Successfully updated user to super admin!');
      } else {
        console.error('Error assigning super admin role:', error.message);
        return;
      }
    } else {
      console.log('Successfully assigned super admin role!');
    }

    console.log('\nYou can now access the admin dashboard at http://localhost:3001/admin');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the function with the email you want to make super admin
makeSuperAdmin('mohammed.shaaban940@gmail.com');