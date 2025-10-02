console.log('=== Cleanup Admin Roles ===\n');

console.log('Based on our analysis, you have duplicate admin roles which is causing the .single() query to fail.');
console.log('Here\'s how to fix it:\n');

console.log('🔧 SOLUTION 1: Run this SQL command in your Supabase dashboard to remove duplicates:');
console.log('');
console.log('-- First, check what duplicate roles you have:');
console.log('SELECT user_id, role, medical_center_id, COUNT(*) FROM public.admin_roles GROUP BY user_id, role, medical_center_id HAVING COUNT(*) > 1;');
console.log('');
console.log('-- Then, remove duplicates (keeping only the first one):');
console.log('DELETE FROM public.admin_roles a USING public.admin_roles b WHERE a.id < b.id AND a.user_id = b.user_id AND a.role = b.role AND COALESCE(a.medical_center_id, \'00000000-0000-0000-0000-000000000000\') = COALESCE(b.medical_center_id, \'00000000-0000-0000-0000-000000000000\');');
console.log('');
console.log('🔧 SOLUTION 2: If you want to be more specific to your user:');
console.log('');
console.log('-- Check your specific duplicates:');
console.log('SELECT id, user_id, role, medical_center_id, is_active FROM public.admin_roles WHERE user_id = \'2da92fca-b29c-47c5-ab67-cce3580444e9\';');
console.log('');
console.log('-- Delete all except one (replace ID_TO_KEEP with the ID you want to keep):');
console.log('DELETE FROM public.admin_roles WHERE user_id = \'2da92fca-b29c-47c5-ab67-cce3580444e9\' AND id != \'ID_TO_KEEP\';');
console.log('');
console.log('After running these commands, try accessing the admin dashboard again.');
console.log('The issue should now be resolved!');