-- Add patient information columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS patient_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS patient_age INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN appointments.patient_name IS 'Name of the patient for the appointment';
COMMENT ON COLUMN appointments.patient_gender IS 'Gender of the patient (male/female)';
COMMENT ON COLUMN appointments.patient_age IS 'Age of the patient';