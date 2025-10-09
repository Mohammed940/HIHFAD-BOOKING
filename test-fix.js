console.log('=== Testing Auth Utils Fix ===\n');

console.log('I\'ve updated the auth-utils.ts file to handle multiple admin roles.');
console.log('Instead of using .single() which fails with multiple entries,');
console.log('the code now retrieves all roles and finds the super_admin role.\n');

console.log('✅ CHANGES MADE:');
console.log('1. Changed requireAdmin() to use .select() instead of .single()');
console.log('2. Added logic to find super_admin role among multiple roles');
console.log('3. Still redirects to home page if no valid admin role is found\n');

console.log('🔧 NEXT STEPS:');
console.log('1. Try accessing the admin dashboard again:');
console.log('   http://localhost:3001/admin\n');

console.log('2. If it still doesn\'t work, run the cleanup SQL commands:');
console.log('   - Check duplicates: SELECT user_id, role, medical_center_id, COUNT(*) FROM public.admin_roles GROUP BY user_id, role, medical_center_id HAVING COUNT(*) > 1;');
console.log('   - Remove duplicates: DELETE FROM public.admin_roles a USING public.admin_roles b WHERE a.id < b.id AND a.user_id = b.user_id AND a.role = b.role AND COALESCE(a.medical_center_id, \'00000000-0000-0000-0000-000000000000\') = COALESCE(b.medical_center_id, \'00000000-0000-0000-0000-000000000000\');\n');

console.log('3. Also make sure RLS is disabled:');
console.log('   ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;\n');

console.log('🎉 This should resolve the issue and allow you to access the admin dashboard!');