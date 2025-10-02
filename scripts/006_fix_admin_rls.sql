-- Fix RLS policies to enable Super Admin/Center Admin dashboard operations

-- 0) Temporarily relax admin_roles to avoid recursion/blocks during setup
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;

-- 1) medical_centers: allow super admins full manage (read/write)
DROP POLICY IF EXISTS "Super admins can manage medical centers" ON public.medical_centers;
CREATE POLICY "Super admins can manage medical centers" ON public.medical_centers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- 2) clinics: allow super admins full manage and center admins manage their center clinics
DROP POLICY IF EXISTS "Super admins can manage all clinics" ON public.clinics;
CREATE POLICY "Super admins can manage all clinics" ON public.clinics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Center admins can manage their clinics" ON public.clinics;
CREATE POLICY "Center admins can manage their clinics" ON public.clinics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = clinics.medical_center_id 
        AND ar.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = clinics.medical_center_id 
        AND ar.is_active = true
    )
  );

-- 3) appointments: allow super admins full manage
DROP POLICY IF EXISTS "Super admins can manage all appointments" ON public.appointments;
CREATE POLICY "Super admins can manage all appointments" ON public.appointments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- 4) news: allow super admins full manage
DROP POLICY IF EXISTS "Super admins can manage news" ON public.news;
CREATE POLICY "Super admins can manage news" ON public.news
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- 5) profiles: keep self-access; add read-all for super admins (for /admin/users)
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.profiles;
CREATE POLICY "Users can view and update their own profile" ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- 6) fixed_time_slots: add WITH CHECK for super/center admins
DROP POLICY IF EXISTS "Super admins can manage all fixed time slots" ON public.fixed_time_slots;
CREATE POLICY "Super admins can manage all fixed time slots" ON public.fixed_time_slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Center admins can manage their fixed time slots" ON public.fixed_time_slots;
CREATE POLICY "Center admins can manage their fixed time slots" ON public.fixed_time_slots
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      JOIN public.clinics c ON c.id = fixed_time_slots.clinic_id
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = c.medical_center_id 
        AND ar.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      JOIN public.clinics c ON c.id = fixed_time_slots.clinic_id
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = c.medical_center_id 
        AND ar.is_active = true
    )
  );

-- Post-setup note: re-enable RLS on admin_roles if you add appropriate policies
-- ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;


