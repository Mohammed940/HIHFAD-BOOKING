-- Add use_fixed_time_slots column to clinics table
-- This column will determine if a clinic uses fixed time slots or dynamic working hours

ALTER TABLE public.clinics 
ADD COLUMN IF NOT EXISTS use_fixed_time_slots BOOLEAN DEFAULT false;

-- Add a comment to explain the column purpose
COMMENT ON COLUMN public.clinics.use_fixed_time_slots IS 'When true, clinic uses fixed time slots instead of dynamic working hours';