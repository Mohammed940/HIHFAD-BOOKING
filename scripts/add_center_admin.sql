-- ترقية مستخدم إلى آدمن مركز
INSERT INTO public.admin_roles (user_id, role, medical_center_id, is_active)
VALUES ('2da92fca-b29c-47c5-ab67-cce3580444e9', 'center_admin', '2e5b55a7-4039-4d01-92db-ef94e247c8cc', true)
ON CONFLICT (user_id, medical_center_id) DO UPDATE SET role = 'center_admin', is_active = true;
-- بعد تنفيذ هذا السكريبت في لوحة تحكم Supabase، سيكون المستخدم آدمن لهذا المركز.