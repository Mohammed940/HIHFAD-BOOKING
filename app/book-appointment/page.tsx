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
import { ArrowLeft, CalendarIcon, Clock, MapPin, User, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays, isAfter, isBefore, startOfDay, getDay } from "date-fns"
import { ar } from "date-fns/locale"

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

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Get URL parameters
  const centerParam = searchParams.get("center")
  const clinicParam = searchParams.get("clinic")

  useEffect(() => {
    checkUser()
    fetchCenters()
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

    // If the clinic uses fixed time slots, fetch them for the selected day
    if (clinic.use_fixed_time_slots) {
      const dayIndex = getDay(selectedDate) // 0 = Sunday ... 6 = Saturday
      const { data: fixedSlots } = await supabase
        .from("fixed_time_slots")
        .select("time_slot")
        .eq("clinic_id", selectedClinic)
        .eq("day_of_week", dayIndex)
        .eq("is_active", true)

      const candidateTimes = (fixedSlots || []).map((s: any) => String(s.time_slot).slice(0, 5))

      const { data: bookedAppointments } = await supabase
        .from("appointments")
        .select("appointment_time")
        .eq("clinic_id", selectedClinic)
        .eq("appointment_date", format(selectedDate, "yyyy-MM-dd"))
        .in("status", ["pending", "approved"])

      const bookedTimes = (bookedAppointments || []).map((apt: any) => String(apt.appointment_time).slice(0, 5))
      const free = candidateTimes.filter((t) => !bookedTimes.includes(t))
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

    // Generate time slots (30-minute intervals)
    const times: string[] = []
    const startTime = daySchedule.start
    const endTime = daySchedule.end

    const [startHour, startMinute] = startTime.split(":").map(Number)
    const [endHour, endMinute] = endTime.split(":").map(Number)

    for (let hour = startHour; hour < endHour || (hour === endHour && startMinute < endMinute); hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute >= endMinute) break
        if (hour === startHour && minute < startMinute) continue

        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        times.push(timeString)
      }
    }

    // Filter out already booked times
    const { data: bookedAppointments } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("clinic_id", selectedClinic)
      .eq("appointment_date", format(selectedDate, "yyyy-MM-dd"))
      .in("status", ["pending", "approved"])

    const bookedTimes = bookedAppointments?.map((apt) => apt.appointment_time) || []
    const availableTimes = times.filter((time) => !bookedTimes.includes(time))

    setAvailableTimes(availableTimes)
  }

  const handleCenterChange = (centerId: string) => {
    setSelectedCenter(centerId)
    setSelectedClinic("")
    setClinics([])
    setSelectedDate(undefined)
    setSelectedTime("")
    setAvailableTimes([])
    fetchClinics(centerId)
  }

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinic(clinicId)
    setSelectedDate(undefined)
    setSelectedTime("")
    setAvailableTimes([])
  }

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime("")
    setAvailableTimes([])
  }

  const handleBookAppointment = async () => {
    if (!selectedCenter || !selectedClinic || !selectedDate || !selectedTime) {
      setError("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setIsBooking(true)
    setError(null)

    try {
      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        medical_center_id: selectedCenter,
        clinic_id: selectedClinic,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        notes: notes.trim() || null,
        status: "pending",
      })

      if (error) throw error

      setBookingSuccess(true)
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء حجز الموعد")
    } finally {
      setIsBooking(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">تم حجز الموعد بنجاح!</CardTitle>
                  <CardDescription>سيتم مراجعة طلبك وإرسال إشعار بالموافقة</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>تاريخ الموعد: {selectedDate && format(selectedDate, "dd MMMM yyyy", { locale: ar })}</p>
                    <p>وقت الموعد: {selectedTime}</p>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/appointments">عرض مواعيدي</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/">العودة للرئيسية</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button asChild variant="outline" size="sm" className="mb-4 bg-transparent border-primary text-primary hover:bg-primary/10">
                <Link href="/centers">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للمراكز
                </Link>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                حجز موعد طبي
              </h1>
              <p className="text-xl text-muted-foreground">اختر المركز والعيادة والوقت المناسب لك</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <div className="space-y-6">
                {/* Medical Center Selection */}
                <Card className="border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-5 h-5 text-primary" />
                      اختر المركز الطبي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedCenter} onValueChange={handleCenterChange}>
                      <SelectTrigger className="border-primary/30 focus:ring-primary">
                        <SelectValue placeholder="اختر المركز الطبي" />
                      </SelectTrigger>
                      <SelectContent>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Clinic Selection */}
                {selectedCenter && (
                  <Card className="border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <User className="w-5 h-5 text-primary" />
                        اختر العيادة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={selectedClinic} onValueChange={handleClinicChange}>
                        <SelectTrigger className="border-primary/30 focus:ring-primary">
                          <SelectValue placeholder="اختر العيادة" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinics.map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              <div>
                                <div className="font-medium">{clinic.name}</div>
                                {clinic.doctor_name && (
                                  <div className="text-sm text-muted-foreground">{clinic.doctor_name}</div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {/* Date Selection */}
                {selectedClinic && (
                  <Card className="border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        اختر التاريخ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          isBefore(date, startOfDay(new Date())) || isAfter(date, addDays(new Date(), 30))
                        }
                        locale={ar}
                        className="rounded-2xl border border-primary/20 p-4 bg-background/50 backdrop-blur-sm"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center",
                          caption_label: "text-sm font-medium text-foreground",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full",
                          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                          day_disabled: "text-muted-foreground opacity-50",
                          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          day_hidden: "invisible",
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Time Selection */}
                {selectedDate && availableTimes.length > 0 && (
                  <Card className="border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Clock className="w-5 h-5 text-primary" />
                        اختر الوقت
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-lg py-5 transition-all duration-300 ${
                              selectedTime === time
                                ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-md"
                                : "border-primary/30 hover:bg-primary/10 hover:shadow-md"
                            }`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes */}
                {selectedTime && (
                  <Card className="border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-foreground">ملاحظات إضافية (اختياري)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="أضف أي ملاحظات أو معلومات إضافية..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="border-primary/30 focus:ring-primary rounded-lg"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <Card className="sticky top-4 border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-foreground">ملخص الموعد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedCenter && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">المركز الطبي</Label>
                        <p className="text-foreground font-medium">{centers.find((c) => c.id === selectedCenter)?.name}</p>
                      </div>
                    )}

                    {selectedClinic && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">العيادة</Label>
                        <p className="text-foreground font-medium">{clinics.find((c) => c.id === selectedClinic)?.name}</p>
                        {clinics.find((c) => c.id === selectedClinic)?.doctor_name && (
                          <p className="text-sm text-muted-foreground">
                            {clinics.find((c) => c.id === selectedClinic)?.doctor_name}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedDate && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">التاريخ</Label>
                        <p className="text-foreground font-medium">{format(selectedDate, "dd MMMM yyyy", { locale: ar })}</p>
                      </div>
                    )}

                    {selectedTime && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">الوقت</Label>
                        <p className="text-foreground font-medium">{selectedTime}</p>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleBookAppointment}
                      disabled={!selectedCenter || !selectedClinic || !selectedDate || !selectedTime || isBooking}
                      className="w-full rounded-lg py-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isBooking ? "جاري الحجز..." : "تأكيد الحجز"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}