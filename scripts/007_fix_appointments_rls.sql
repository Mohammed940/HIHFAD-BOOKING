-- Fix appointments RLS to allow center admins to view and manage their appointments

-- 1) First ensure appointments table has RLS enabled
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2) Add policy for center admins to manage appointments for their centers
DROP POLICY IF EXISTS "Center admins can manage their center appointments" ON public.appointments;
CREATE POLICY "Center admins can manage their center appointments" ON public.appointments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = appointments.medical_center_id
        AND ar.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      WHERE ar.user_id = auth.uid() 
        AND ar.role = 'center_admin' 
        AND ar.medical_center_id = appointments.medical_center_id
        AND ar.is_active = true
    )
  );

-- 3) Verify super admin policy exists and recreate if needed
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

-- 4) Add policy for patients to view their own appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT
  USING (auth.uid() = user_id);