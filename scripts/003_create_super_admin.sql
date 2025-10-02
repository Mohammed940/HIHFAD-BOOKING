-- Create a super admin user
-- This script should be run after the first user registers

-- First, you need to get the user ID of the user you want to make super admin
-- You can find this in the Supabase Auth dashboard or by querying auth.users

-- Replace 'USER_ID_HERE' with the actual user ID
-- Example: INSERT INTO public.admin_roles (user_id, role) VALUES ('12345678-1234-1234-1234-123456789012', 'super_admin');

-- Uncomment and modify the line below with the actual user ID:
-- INSERT INTO public.admin_roles (user_id, role) VALUES ('USER_ID_HERE', 'super_admin');

-- For testing purposes, you can also create a test super admin account
-- But make sure to replace this with a real user ID in production

-- Note: This is a placeholder script. In a real deployment, you would:
-- 1. Register a user through the normal registration process
-- 2. Get their user ID from the auth.users table
-- 3. Insert a record into admin_roles table to make them super admin

SELECT 'Please replace USER_ID_HERE with actual user ID to create super admin' as instruction;
