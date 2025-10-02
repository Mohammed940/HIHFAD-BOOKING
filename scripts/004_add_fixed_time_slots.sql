-- Add fixed time slots table for clinics
-- This table allows clinics to define specific time slots that can be booked only once

-- Create fixed_time_slots table
CREATE TABLE IF NOT EXISTS public.fixed_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 1 = Monday, etc.
  time_slot TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, day_of_week, time_slot)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fixed_time_slots_clinic_id ON public.fixed_time_slots(clinic_id);
CREATE INDEX IF NOT EXISTS idx_fixed_time_slots_day_time ON public.fixed_time_slots(day_of_week, time_slot);
CREATE INDEX IF NOT EXISTS idx_fixed_time_slots_active ON public.fixed_time_slots(is_active);

-- Add RLS policies for fixed_time_slots
ALTER TABLE public.fixed_time_slots ENABLE ROW LEVEL SECURITY;

-- Allow super admins to manage all fixed time slots
CREATE POLICY "Super admins can manage all fixed time slots" ON public.fixed_time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- Allow center admins to manage their center's fixed time slots
CREATE POLICY "Center admins can manage their fixed time slots" ON public.fixed_time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar
      JOIN public.clinics c ON c.id = fixed_time_slots.clinic_id
      WHERE ar.user_id = auth.uid() 
      AND ar.role = 'center_admin' 
      AND ar.medical_center_id = c.medical_center_id 
      AND ar.is_active = true
    )
  );

-- Allow public read access to active fixed time slots (for booking)
CREATE POLICY "Anyone can view active fixed time slots" ON public.fixed_time_slots
  FOR SELECT USING (is_active = true);