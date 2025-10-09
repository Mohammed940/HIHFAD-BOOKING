const http = require('http');

console.log('Checking if the development server is running properly...');

// Check if we can access the main page
http.get('http://localhost:3001', (res) => {
  console.log(`Main page status code: ${res.statusCode}`);
  
  // Check if we can access the admin page
  http.get('http://localhost:3001/admin', (res) => {
    console.log(`Admin page status code: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('Admin route is accessible, but you might be getting redirected due to authentication');
    } else if (res.statusCode === 307) {
      console.log('Admin route is redirecting (likely to login page)');
    } else {
      console.log(`Admin route returned status: ${res.statusCode}`);
    }
    
    // Check if we can access the login page
    http.get('http://localhost:3001/auth/login', (res) => {
      console.log(`Login page status code: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log('Error accessing login page:', err.message);
    });
    
  }).on('error', (err) => {
    console.log('Error accessing admin page:', err.message);
  });
  
}).on('error', (err) => {
  console.log('Error accessing main page:', err.message);
  console.log('Please make sure the development server is running with "pnpm dev"');
});