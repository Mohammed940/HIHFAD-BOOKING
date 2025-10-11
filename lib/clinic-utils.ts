// Utility functions for clinic type identification and validation

/**
 * Identify clinic type based on clinic name
 * @param clinicName The name of the clinic
 * @returns The clinic type: 'pediatrics', 'internal', 'obstetrics', or 'general'
 */
export function getClinicType(clinicName: string): 'pediatrics' | 'internal' | 'obstetrics' | 'general' {
  const name = clinicName.toLowerCase();
  
  // Check for pediatrics clinic (أطفال)
  if (name.includes('أطفال') || name.includes('طفل') || name.includes('أطفالية') || name.includes('pediatric') || name.includes('child')) {
    return 'pediatrics';
  }
  
  // Check for obstetrics/gynecology clinic (نسائية)
  if (name.includes('نسائية') || name.includes('نساء') || name.includes('توليد') || name.includes('gyn') || name.includes('obstetric')) {
    return 'obstetrics';
  }
  
  // Check for internal medicine clinic (داخلية)
  if (name.includes('داخلية') || name.includes('باطنية') || name.includes('internal') || name.includes('medicine')) {
    return 'internal';
  }
  
  // Default to general if no specific type is identified
  return 'general';
}

/**
 * Get age restrictions for a clinic type
 * @param clinicType The type of clinic
 * @returns Object with minAge and maxAge restrictions
 */
export function getAgeRestrictions(clinicType: 'pediatrics' | 'internal' | 'obstetrics' | 'general'): { minAge: number; maxAge: number } {
  switch (clinicType) {
    case 'pediatrics': // أطفال
      return { minAge: 1, maxAge: 17 };
    case 'internal': // داخلية
      return { minAge: 18, maxAge: 120 };
    case 'obstetrics': // نسائية
    case 'general': // عامة (no specific restrictions)
    default:
      return { minAge: 1, maxAge: 120 };
  }
}

/**
 * Get gender restrictions for a clinic type
 * @param clinicType The type of clinic
 * @returns Required gender or null if no restriction
 */
export function getGenderRestriction(clinicType: 'pediatrics' | 'internal' | 'obstetrics' | 'general'): 'male' | 'female' | null {
  switch (clinicType) {
    case 'obstetrics': // نسائية
      return 'female';
    case 'pediatrics': // أطفال
    case 'internal': // داخلية
    case 'general': // عامة
    default:
      return null; // No gender restriction
  }
}

/**
 * Validate patient information against clinic restrictions
 * @param clinicName The name of the clinic
 * @param patientAge The patient's age
 * @param patientGender The patient's gender
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePatientForClinic(
  clinicName: string,
  patientAge: number,
  patientGender: 'male' | 'female'
): { isValid: boolean; errorMessage?: string } {
  const clinicType = getClinicType(clinicName);
  const ageRestrictions = getAgeRestrictions(clinicType);
  const genderRestriction = getGenderRestriction(clinicType);
  
  // Check age restrictions
  if (patientAge < ageRestrictions.minAge || patientAge > ageRestrictions.maxAge) {
    if (clinicType === 'pediatrics') {
      return {
        isValid: false,
        errorMessage: `عذرًا، عيادة الأطفال مخصصة للأطفال من عمر 1 إلى 17 سنة فقط. عمر المريض ${patientAge} سنة.`
      };
    } else if (clinicType === 'internal') {
      return {
        isValid: false,
        errorMessage: `عذرًا، العيادة الداخلية مخصصة للبالغين من عمر 18 سنة فما فوق. عمر المريض ${patientAge} سنة.`
      };
    }
  }
  
  // Check gender restrictions
  if (genderRestriction && patientGender !== genderRestriction) {
    if (clinicType === 'obstetrics') {
      return {
        isValid: false,
        errorMessage: "عذرًا، عيادة النساء مخصصة للنساء فقط."
      };
    }
  }
  
  return { isValid: true };
}