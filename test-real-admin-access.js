const http = require('http');

console.log('=== Testing Real Admin Dashboard Access ===\n');

// Test if we can access the main page
console.log('1. Testing main page access...');
http.get('http://localhost:3001', (res) => {
  console.log(`✅ Main page status: ${res.statusCode}`);
  
  // Test if we can access the admin page
  console.log('\n2. Testing admin page access...');
  http.get('http://localhost:3001/admin', (res) => {
    console.log(`Status code: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Admin page is accessible');
      console.log('🎉 You should be able to access the admin dashboard!');
    } else if (res.statusCode === 307 || res.statusCode === 302) {
      console.log('⚠️  Admin page is redirecting');
      console.log('This might indicate an authentication issue');
    } else {
      console.log(`❌ Admin page returned status: ${res.statusCode}`);
    }
    
    // Test login page
    console.log('\n3. Testing login page access...');
    http.get('http://localhost:3001/auth/login', (res) => {
      console.log(`✅ Login page status: ${res.statusCode}`);
      
      console.log('\n=== ACCESS INSTRUCTIONS ===');
      console.log('If you cannot access the admin dashboard, follow these steps:');
      console.log('1. Go to: http://localhost:3001/auth/login');
      console.log('2. Log in with:');
      console.log('   - Email: mohammed.shaaban940@gmail.com');
      console.log('   - Password: password123456789');
      console.log('3. After login, manually navigate to: http://localhost:3001/admin');
      console.log('');
      console.log('Note: The login page does NOT automatically redirect to admin dashboard');
      console.log('You must manually go to /admin after logging in');
      
    }).on('error', (err) => {
      console.log('❌ Error accessing login page:', err.message);
    });
    
  }).on('error', (err) => {
    console.log('❌ Error accessing admin page:', err.message);
  });
  
}).on('error', (err) => {
  console.log('❌ Error accessing main page:', err.message);
  console.log('Please make sure the development server is running with "pnpm dev"');
});