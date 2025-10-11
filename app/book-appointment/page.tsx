"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CalendarIcon, Clock, MapPin, User, CheckCircle, Stethoscope, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, isAfter, isBefore, startOfDay, getDay } from "date-fns"
import { ar } from "date-fns/locale"
import { validatePatientForClinic, getClinicType, getAgeRestrictions, getGenderRestriction } from "@/lib/clinic-utils"

interface MedicalCenter {
  id: string
  name: string
  address: string
}

interface Clinic {
  id: string
  name: string
  doctor_name: string
  working_hours: any
  use_fixed_time_slots?: boolean
}

interface Appointment {
  id: string
  user_id: string
  medical_center_id: string
  clinic_id: string
  appointment_date: string
  appointment_time: string
  status: string
  notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export default function BookAppointmentPage() {
  const [user, setUser] = useState<any>(null)
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedCenter, setSelectedCenter] = useState("")
  const [selectedClinic, setSelectedClinic] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Patient information fields
  const [patientName, setPatientName] = useState("")
  const [patientGender, setPatientGender] = useState("")
  const [patientAge, setPatientAge] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Get URL parameters
  const centerParam = searchParams.get("center")
  const clinicParam = searchParams.get("clinic")

  // Helper function to get age restrictions for a clinic
  const getAgeRestrictionsForClinic = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
      const clinicType = getClinicType(clinic.name);
      return getAgeRestrictions(clinicType);
    }
    return { minAge: 1, maxAge: 120 };
  };

  // Helper function to get age restriction message
  const getAgeRestrictionMessage = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
      const clinicType = getClinicType(clinic.name);
      const restrictions = getAgeRestrictions(clinicType);
      
      if (clinicType === 'pediatrics') {
        return `العمر المسموح: ${restrictions.minAge} - ${restrictions.maxAge} سنة (عيادة الأطفال)`;
      } else if (clinicType === 'internal') {
        return `العمر المسموح: ${restrictions.minAge} سنة فما فوق (عيادة الباطنية)`;
      } else if (clinicType === 'obstetrics') {
        return "الجنس المسموح: أنثى فقط (عيادة النساء)";
      }
    }
    return "العمر المسموح: 1-120 سنة";
  };

  useEffect(() => {
    checkUser()
    fetchCenters()
    
    // Set date to tomorrow automatically
    const tomorrow = addDays(new Date(), 1)
    setSelectedDate(tomorrow)
  }, [])

  useEffect(() => {
    if (centerParam) {
      setSelectedCenter(centerParam)
      fetchClinics(centerParam)
    }
  }, [centerParam])

  useEffect(() => {
    if (clinicParam && clinics.length > 0) {
      setSelectedClinic(clinicParam)
    }
  }, [clinicParam, clinics])

  useEffect(() => {
    if (selectedClinic && selectedDate) {
      generateAvailableTimes()
    }
  }, [selectedClinic, selectedDate])

  // Add this useEffect to refresh available times when a booking is successful
  useEffect(() => {
    if (bookingSuccess && selectedClinic && selectedDate) {
      generateAvailableTimes()
    }
  }, [bookingSuccess, selectedClinic, selectedDate])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }
    setUser(user)
  }

  const fetchCenters = async () => {
    const { data } = await supabase.from("medical_centers").select("id, name, address").eq("is_active", true)
    if (data) setCenters(data)
  }

  const fetchClinics = async (centerId: string) => {
    if (!centerId) return
    const { data } = await supabase
      .from("clinics")
      .select("id, name, doctor_name, working_hours, use_fixed_time_slots")
      .eq("medical_center_id", centerId)
      .eq("is_active", true)
      .eq("is_frozen", false)
    if (data) setClinics(data)
  }

  const generateAvailableTimes = async () => {
    if (!selectedClinic || !selectedDate) return

    const clinic = clinics.find((c) => c.id === selectedClinic)
    if (!clinic) return

    try {
      // If the clinic uses fixed time slots, fetch them for the selected day
      if (clinic.use_fixed_time_slots) {
        const dayIndex = getDay(selectedDate) // 0 = Sunday ... 6 = Saturday
        const { data: fixedSlots, error: fixedSlotsError } = await supabase
          .from("fixed_time_slots")
          .select("time_slot")
          .eq("clinic_id", selectedClinic)
          .eq("day_of_week", dayIndex)
          .eq("is_active", true)

        if (fixedSlotsError) {
          console.error("Error fetching fixed time slots:", fixedSlotsError)
          setAvailableTimes([])
          return
        }

        const candidateTimes = (fixedSlots || []).map((s: any) => String(s.time_slot).slice(0, 5))

        const { data: bookedAppointments, error: bookedAppointmentsError } = await supabase
          .from("appointments")
          .select("appointment_time")
          .eq("clinic_id", selectedClinic)
          .eq("appointment_date", format(selectedDate, "yyyy-MM-dd"))
          .in("status", ["pending", "approved"])

        if (bookedAppointmentsError) {
          console.error("Error fetching booked appointments:", bookedAppointmentsError)
          setAvailableTimes([])
          return
        }

        const bookedTimes = (bookedAppointments || []).map((apt: { appointment_time: string }) => String(apt.appointment_time).slice(0, 5))
        const free = candidateTimes.filter((t: string) => !bookedTimes.includes(t))
        setAvailableTimes(free)
        return
      }

      if (!clinic.working_hours) {
        setAvailableTimes([])
        return
      }

      // Get day name
      const dayName = format(selectedDate, "EEEE", { locale: ar }).toLowerCase()
      const dayMapping: { [key: string]: string } = {
        السبت: "saturday",
        الأحد: "sunday",
        الاثنين: "monday",
        الثلاثاء: "tuesday",
        الأربعاء: "wednesday",
        الخميس: "thursday",
        الجمعة: "friday",
      }

      const englishDay = dayMapping[dayName] || format(selectedDate, "EEEE").toLowerCase()
      const rawDaySchedule = clinic.working_hours[englishDay]
      // Support both shapes:
      // 1) { closed: boolean, start: "HH:mm", end: "HH:mm" }
      // 2) { is_open: boolean, start_time: "HH:mm", end_time: "HH:mm" }
      const daySchedule = !rawDaySchedule
        ? null
        : "is_open" in rawDaySchedule
          ? (rawDaySchedule.is_open
              ? { closed: false, start: rawDaySchedule.start_time, end: rawDaySchedule.end_time }
              : { closed: true, start: undefined, end: undefined })
          : rawDaySchedule

      if (!daySchedule || daySchedule.closed || !daySchedule.start || !daySchedule.end) {
        setAvailableTimes([])
        return
      }

      // Generate time slots (7-minute intervals)
      const times: string[] = []
      const startTime = daySchedule.start
      const endTime = daySchedule.end

      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
        for (let minute = 0; minute < 60; minute += 7) {
          if (hour === endHour && minute >= endMinute) break
          if (hour === startHour && minute < startMinute) continue

          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
          times.push(timeString)
        }
      }

      // Filter out already booked times with improved error handling
      // Only exclude appointments that are pending or approved (not cancelled or rejected)
      const { data: bookedAppointments, error: bookedAppointmentsError } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("clinic_id", selectedClinic)
        .eq("appointment_date", format(selectedDate, "yyyy-MM-dd"))
        .in("status", ["pending", "approved"])
        .order("appointment_time", { ascending: true })

      if (bookedAppointmentsError) {
        console.error("Error fetching booked appointments:", bookedAppointmentsError)
        setAvailableTimes([])
        return
      }

      // Log for debugging - remove in production
      console.log("Booked appointments:", bookedAppointments);
      console.log("Selected clinic:", selectedClinic);
      console.log("Selected date:", format(selectedDate, "yyyy-MM-dd"));

      const bookedTimes = bookedAppointments?.map((apt: { appointment_time: string }) => apt.appointment_time) || []
      const availableTimes = times.filter((time) => !bookedTimes.includes(time))

      // Log for debugging - remove in production
      console.log("Booked times:", bookedTimes);
      console.log("All times:", times);
      console.log("Available times:", availableTimes);

      setAvailableTimes(availableTimes)
    } catch (error) {
      console.error("Error generating available times:", error)
      setAvailableTimes([])
      setError("حدث خطأ أثناء تحميل الأوقات المتاحة. يرجى المحاولة مرة أخرى.")
    }
  }

  // Removed handleCenterChange since center selection should be frozen
  // Removed handleClinicChange since clinic selection should be frozen
  // Removed handleDateChange since date should be frozen to tomorrow

  const handleBookAppointment = async () => {
    if (!selectedCenter || !selectedClinic || !selectedDate || !selectedTime || !patientName || !patientGender || !patientAge) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    // Validate patient against clinic restrictions
    const clinic = clinics.find((c) => c.id === selectedClinic);
    if (clinic) {
      const patientAgeNum = parseInt(patientAge);
      const validation = validatePatientForClinic(clinic.name, patientAgeNum, patientGender as 'male' | 'female');
      
      if (!validation.isValid) {
        setError(validation.errorMessage || "عذرًا، لا يمكن حجز موعد لهذا المريض في هذه العيادة.");
        return;
      }
    }

    setIsBooking(true)
    setError(null)

    try {
      // First, check if there are any existing appointments for this time slot
      const { data: existingAppointments, error: checkError } = await supabase
        .from("appointments")
        .select("id, status")
        .eq("clinic_id", selectedClinic)
        .eq("appointment_date", format(selectedDate, "yyyy-MM-dd"))
        .eq("appointment_time", selectedTime)

      if (checkError) throw checkError

      // Log for debugging - remove in production
      console.log("All existing appointments for this slot:", existingAppointments);

      // Filter to only consider pending or approved appointments as conflicts
      const conflictingAppointments = existingAppointments?.filter((apt: { status: string }) => 
        apt.status === "pending" || apt.status === "approved"
      ) || [];

      // Log for debugging - remove in production
      console.log("Conflicting appointments (pending/approved only):", conflictingAppointments);

      // If a conflicting appointment already exists, inform the user
      if (conflictingAppointments.length > 0) {
        setError("عذرًا، هذا الوقت محجوز بالفعل. يرجى اختيار وقت آخر.")
        setIsBooking(false)
        // Refresh available times to show current bookings
        if (selectedClinic && selectedDate) {
          generateAvailableTimes()
        }
        return
      }

      // If there are cancelled appointments, we can reuse one of them
      const cancelledAppointments = existingAppointments?.filter((apt: { status: string }) => 
        apt.status === "cancelled"
      ) || [];

      // Log for debugging - remove in production
      console.log("Cancelled appointments for this slot:", cancelledAppointments);

      // Attempt to insert the appointment
      const appointmentData = {
        user_id: user.id,
        medical_center_id: selectedCenter,
        clinic_id: selectedClinic,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        notes: notes.trim() || null,
        status: "pending",
        patient_name: patientName,
        patient_gender: patientGender,
        patient_age: parseInt(patientAge)
      }

      let insertError;
      
      // If there are cancelled appointments, try to update one instead of inserting a new one
      if (cancelledAppointments.length > 0) {
        // Update the first cancelled appointment
        const { error: updateError } = await supabase
          .from("appointments")
          .update(appointmentData)
          .eq("id", cancelledAppointments[0].id)
        
        insertError = updateError;
      } else {
        // Insert a new appointment
        const { error } = await supabase
          .from("appointments")
          .insert(appointmentData)
        
        insertError = error;
      }

      // Handle specific database constraint violations
      if (insertError) {
        // Check for unique constraint violation
        if (insertError.code === '23505') {
          if (insertError.message.includes('appointments_clinic_id_appointment_date_appointment_time_key') || 
              insertError.message.includes('clinic_id') || 
              insertError.message.includes('unique')) {
            setError("عذرًا، هذا الوقت محجوز بالفعل. يرجى اختيار وقت آخر.")
            // Refresh the available times to show current availability
            if (selectedClinic && selectedDate) {
              await generateAvailableTimes()
            }
            return
          }
        }
        // Handle other database errors
        throw new Error(`فشل حجز الموعد: ${insertError.message}`)
      }

      // Success - refresh available times and show success message
      if (selectedClinic && selectedDate) {
        await generateAvailableTimes()
      }
      setBookingSuccess(true)
    } catch (error: any) {
      console.error("Error booking appointment:", error)
      if (error.message.includes("محجوز")) {
        setError(error.message)
      } else {
        setError("حدث خطأ غير متوقع أثناء حجز الموعد. يرجى المحاولة مرة أخرى.")
      }
    } finally {
      setIsBooking(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold">تم حجز الموعد بنجاح!</CardTitle>
                  <CardDescription className="text-base mt-1">سيتم مراجعة طلبك وإرسال إشعار بالموافقة</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-5">
                  <div className="space-y-3 bg-primary/5 p-4 rounded-xl">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span className="text-muted-foreground">تاريخ الموعد:</span>
                        <span className="font-medium text-foreground">{selectedDate && format(selectedDate, "dd MMMM yyyy", { locale: ar })}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-muted-foreground">وقت الموعد:</span>
                        <span className="font-medium text-foreground">{selectedTime}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button asChild className="w-full rounded-lg py-5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300">
                      <Link href="/appointments">عرض مواعيدي</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full rounded-lg py-5 bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transition-all duration-300">
                      <Link href="/">العودة للرئيسية</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer user={user} />
      </div>
    )
  }

  // Get age restrictions for the selected clinic
  const ageRestrictions = selectedClinic ? getAgeRestrictionsForClinic(selectedClinic) : { minAge: 1, maxAge: 120 };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
              <Button asChild variant="outline" size="sm" className="mb-4 bg-transparent border-primary text-primary hover:bg-primary/10 rounded-full px-5 py-1.5 text-sm shadow-sm hover:shadow-md transition-all">
                <Link href="/centers">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للمراكز
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                حجز موعد طبي
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">اختر المركز والعيادة والوقت المناسب لك</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Medical Center Selection - Frozen */}
                <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      اختر المركز الطبي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {centers.find((c) => c.id === selectedCenter)?.name || "جارٍ التحميل..."}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {centers.find((c) => c.id === selectedCenter)?.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Clinic Selection - Frozen */}
                {selectedCenter && (
                  <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        اختر العيادة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {clinics.find((c) => c.id === selectedClinic)?.name || "جارٍ التحميل..."}
                            </p>
                            {clinics.find((c) => c.id === selectedClinic)?.doctor_name && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {clinics.find((c) => c.id === selectedClinic)?.doctor_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Date Selection - Frozen to Tomorrow */}
                {selectedClinic && (
                  <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-primary" />
                        </div>
                        التاريخ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: ar }) : "جارٍ التحميل..."}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">تم تعيين التاريخ تلقائيًا لليوم التالي</p>
                          </div>
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            غدًا
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Time Selection */}
                {selectedDate && (
                  <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        اختر الوقت
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availableTimes.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="default"
                              onClick={() => setSelectedTime(time)}
                              className={`rounded-lg py-4 text-base font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md ${
                                selectedTime === time
                                  ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground shadow-sm"
                                  : "border-2 border-primary/30 hover:bg-primary/10"
                              }`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">العيادة غير متوفرة في هذا اليوم</h3>
                          <p className="text-muted-foreground text-sm">
                            يرجى اختيار تاريخ آخر لحجز موعدك
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {selectedTime && (
                  <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-foreground">ملاحظات إضافية (اختياري)</CardTitle>
                      <CardDescription className="text-sm">أضف أي ملاحظات أو معلومات إضافية...</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="مثلاً: أشعر بألم في الجانب الأيسر من البطن..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="border-2 border-primary/30 focus:ring-2 focus:ring-primary rounded-xl p-4 text-sm"
                      />
                    </CardContent>
                  </Card>
                )}
                
                {/* Patient Information */}
                {selectedTime && (
                  <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-foreground">معلومات المريض</CardTitle>
                      <CardDescription className="text-sm">أدخل معلومات المريض الذي سيحضر الموعد</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="patientName" className="text-base font-medium">اسم المريض *</Label>
                        <Input
                          id="patientName"
                          value={patientName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientName(e.target.value)}
                          placeholder="أدخل اسم المريض"
                          required
                          className="border-2 border-primary/30 focus:ring-2 focus:ring-primary rounded-xl p-4 text-base"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientGender" className="text-base font-medium">الجنس *</Label>
                          <Select value={patientGender} onValueChange={setPatientGender}>
                            <SelectTrigger className="border-2 border-primary/30 focus:ring-2 focus:ring-primary rounded-xl p-4 text-base h-auto">
                              <SelectValue placeholder="اختر الجنس" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">ذكر</SelectItem>
                              <SelectItem value="female">أنثى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="patientAge" className="text-base font-medium">العمر *</Label>
                          <Input
                            id="patientAge"
                            type="number"
                            value={patientAge}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientAge(e.target.value)}
                            placeholder="العمر"
                            min={ageRestrictions.minAge}
                            max={ageRestrictions.maxAge}
                            required
                            className="border-2 border-primary/30 focus:ring-2 focus:ring-primary rounded-xl p-4 text-base"
                          />
                          {selectedClinic && (
                            <p className="text-sm text-muted-foreground">
                              {getAgeRestrictionMessage(selectedClinic)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-foreground">ملخص الموعد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-4">
                      {selectedCenter && (
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <Label className="text-xs font-medium text-muted-foreground">المركز الطبي</Label>
                          <p className="text-base font-semibold text-foreground mt-1">{centers.find((c) => c.id === selectedCenter)?.name}</p>
                        </div>
                      )}

                      {selectedClinic && (
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <Label className="text-xs font-medium text-muted-foreground">العيادة</Label>
                          <p className="text-base font-semibold text-foreground mt-1">{clinics.find((c) => c.id === selectedClinic)?.name}</p>
                          {clinics.find((c) => c.id === selectedClinic)?.doctor_name && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {clinics.find((c) => c.id === selectedClinic)?.doctor_name}
                            </p>
                          )}
                        </div>
                      )}

                      {selectedDate && (
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <Label className="text-xs font-medium text-muted-foreground">التاريخ</Label>
                          <p className="text-base font-semibold text-foreground mt-1">{format(selectedDate, "dd MMMM yyyy", { locale: ar })}</p>
                        </div>
                      )}

                      {selectedTime && (
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <Label className="text-xs font-medium text-muted-foreground">الوقت</Label>
                          <p className="text-base font-semibold text-foreground mt-1">{selectedTime}</p>
                        </div>
                      )}
                      
                      {/* Patient Information Summary */}
                      {patientName && (
                        <div className="bg-primary/5 p-4 rounded-xl">
                          <Label className="text-xs font-medium text-muted-foreground">معلومات المريض</Label>
                          <p className="text-base font-semibold text-foreground mt-1">{patientName}</p>
                          {patientGender && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {patientGender === 'male' ? 'ذكر' : 'أنثى'} - {patientAge} سنة
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleBookAppointment}
                      disabled={!selectedCenter || !selectedClinic || !selectedDate || !selectedTime || !patientName || !patientGender || !patientAge || isBooking}
                      className="w-full rounded-xl py-5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground text-base font-bold shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isBooking ? "جاري الحجز..." : "تأكيد الحجز"}
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Appointment Tips */}
                <Card className="border-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl shadow-md">
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-bold text-foreground mb-3">نصائح مهمة</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        <span>يرجى الحضور قبل 15 دقيقة من الموعد المحدد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        <span>احضر بطاقة الهوية الشخصية</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        <span>يمكنك إلغاء الموعد قبل 24 ساعة من موعده</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  )
}