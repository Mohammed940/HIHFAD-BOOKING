console.log('=== DEEP TROUBLESHOOTING: Admin Dashboard Access ===\n');

console.log('Since you\'ve tried all steps but still can\'t access the admin dashboard,');
console.log('let\'s check for less obvious issues:\n');

console.log('🔍 DETAILED TROUBLESHOOTING CHECKLIST:\n');

console.log('✅ 1. VERIFY SERVER IS RUNNING ON CORRECT PORT');
console.log('   Command: pnpm dev');
console.log('   Expected: Server running on http://localhost:3001');
console.log('   Check: Open browser and go to http://localhost:3001\n');

console.log('✅ 2. VERIFY USER ACCOUNT EXISTS AND HAS SUPER_ADMIN ROLE');
console.log('   Go to Supabase Dashboard and run this query:');
console.log('   SELECT id, email FROM auth.users WHERE email = \'mohammed.shaaban940@gmail.com\';');
console.log('   Then run:');
console.log('   SELECT user_id, role, is_active FROM public.admin_roles WHERE user_id = \'[USER_ID_FROM_ABOVE]\';\n');

console.log('✅ 3. VERIFY RLS IS DISABLED');
console.log('   Run this in Supabase SQL editor:');
console.log('   SHOW ALL;');
console.log('   Look for row_security setting\n');

console.log('✅ 4. TRY DIFFERENT ACCESS METHODS');
console.log('   Method A: Direct access');
console.log('   1. Open incognito window');
console.log('   2. Go directly to http://localhost:3001/admin');
console.log('   3. See if it prompts for login\n');

console.log('   Method B: Login flow');
console.log('   1. Open incognito window');
console.log('   2. Go to http://localhost:3001/auth/login');
console.log('   3. Login with credentials');
console.log('   4. After redirect to home page, manually go to http://localhost:3001/admin\n');

console.log('✅ 5. CHECK BROWSER DEVELOPER TOOLS');
console.log('   1. Press F12 to open developer tools');
console.log('   2. Go to Network tab');
console.log('   3. Try to access http://localhost:3001/admin');
console.log('   4. Look for any failed requests or redirects\n');

console.log('✅ 6. CLEAR ALL COOKIES AND CACHE');
console.log('   1. Open browser settings');
console.log('   2. Clear all cookies and cache for localhost:3001');
console.log('   3. Restart browser\n');

console.log('✅ 7. TRY DIFFERENT BROWSER');
console.log('   1. Try Chrome, Firefox, Edge, or Safari');
console.log('   2. Make sure no extensions are blocking requests\n');

console.log('✅ 8. CHECK FOR JAVASCRIPT ERRORS');
console.log('   1. Open developer tools (F12)');
console.log('   2. Go to Console tab');
console.log('   3. Look for any error messages when accessing admin page\n');

console.log('✅ 9. VERIFY DATABASE CONNECTION');
console.log('   Check your .env.local file:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=https://zvcbgtnrlajbfjbelamp.supabase.co');
console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Y2JndG5ybGFqYmZqYmVsYW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTM0ODUsImV4cCI6MjA3NDIyOTQ4NX0.H1rm5m6dPTEeiWVBTigw-5xFH0ilyrICneiplTJWNGM\n');

console.log('✅ 10. CHECK AUTH UTILS FUNCTIONS');
console.log('   Temporarily modify lib/auth-utils.ts to add debugging:');
console.log('   Add console.log statements to see where it\'s failing\n');

console.log('🚨 EMERGENCY SOLUTION:');
console.log('If nothing else works, try this temporary bypass:');
console.log('1. In lib/auth-utils.ts, modify requireSuperAdmin function:');
console.log('   export async function requireSuperAdmin() {');
console.log('     // const { user, role } = await requireAdmin()');
console.log('     // if (role !== "super_admin") { redirect("/") }');
console.log('     // return user');
console.log('     const user = await requireAuth()');
console.log('     return user');
console.log('   }');
console.log('2. REMEMBER to revert this change after testing!\n');

console.log('📞 NEXT STEPS:');
console.log('Please run through this checklist and let me know which step');
console.log('reveals the issue. This will help us identify the exact problem.');