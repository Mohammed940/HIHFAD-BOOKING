"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function ExportAppointmentsButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const exportToExcel = async () => {
    setLoading(true)
    try {
      // First, get all appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false })

      if (appointmentsError) throw appointmentsError

      if (!appointments || appointments.length === 0) {
        toast.error("لا توجد مواعيد للتصدير")
        setLoading(false)
        return
      }

      // Get unique user IDs, clinic IDs, and medical center IDs
      const userIds = [...new Set(appointments.map((a: any) => a.user_id))]
      const clinicIds = [...new Set(appointments.map((a: any) => a.clinic_id))]
      const centerIds = [...new Set(appointments.map((a: any) => a.medical_center_id))]

      // Fetch related data in parallel
      const [
        { data: users, error: usersError },
        { data: clinics, error: clinicsError },
        { data: centers, error: centersError }
      ] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, date_of_birth, gender").in("id", userIds),
        supabase.from("clinics").select("id, name").in("id", clinicIds),
        supabase.from("medical_centers").select("id, name").in("id", centerIds)
      ])

      if (usersError) throw usersError
      if (clinicsError) throw clinicsError
      if (centersError) throw centersError

      // Create lookup maps for efficient access
      const userMap: Record<string, any> = users?.reduce((acc: Record<string, any>, user: any) => ({ ...acc, [user.id]: user }), {}) || {}
      const clinicMap: Record<string, any> = clinics?.reduce((acc: Record<string, any>, clinic: any) => ({ ...acc, [clinic.id]: clinic }), {}) || {}
      const centerMap: Record<string, any> = centers?.reduce((acc: Record<string, any>, center: any) => ({ ...acc, [center.id]: center }), {}) || {}

      // Enrich appointments with related data
      const enrichedAppointments = appointments.map((appointment: any) => ({
        ...appointment,
        profiles: userMap[appointment.user_id],
        clinics: clinicMap[appointment.clinic_id],
        medical_centers: centerMap[appointment.medical_center_id]
      }))

      // Prepare data for CSV
      const csvData = enrichedAppointments.map((appointment: any) => ({
        "اسم المريض": appointment.patient_name || appointment.profiles?.full_name || "",
        "رقم الهاتف": appointment.profiles?.phone || "",
        "الجنس": getGenderInArabic(appointment.patient_gender || appointment.profiles?.gender),
        "العمر": getUserAge(appointment.patient_age),
        "المركز الطبي": appointment.medical_centers?.name || "",
        "العيادة": appointment.clinics?.name || "",
        "تاريخ الموعد": new Date(appointment.appointment_date).toLocaleDateString("en-CA"), // Gregorian date format
        "وقت الموعد": appointment.appointment_time,
        "الحالة": getStatusInArabic(appointment.status),
        "الملاحظات": appointment.notes || "",
        "تاريخ الحجز": new Date(appointment.created_at).toLocaleDateString("en-CA"), // Gregorian date format
      }))

      // Convert to CSV
      const headers = Object.keys(csvData[0])
      const csvContent = [
        headers.join(","),
        ...csvData.map((row: any) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
      ].join("\n")

      // Create and download file
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `appointments_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("تم تصدير المواعيد بنجاح")
    } catch (error: any) {
      console.error("Error exporting appointments:", error)
      toast.error("حدث خطأ أثناء تصدير المواعيد: " + (error.message || ""))
    } finally {
      setLoading(false)
    }
  }

  const getStatusInArabic = (status: string) => {
    switch (status) {
      case "pending":
        return "معلق"
      case "approved":
        return "مقبول"
      case "rejected":
        return "مرفوض"
      default:
        return "غير محدد"
    }
  }

  const getGenderInArabic = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "ذكر"
      case "female":
        return "أنثى"
      default:
        return "غير محدد"
    }
  }

  const getUserAge = (age: number | null) => {
    if (!age) return "غير محدد"
    return `${age} سنة`
  }

  return (
    <Button
      onClick={exportToExcel}
      disabled={loading}
      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Download className="w-4 h-4 ml-2" />}
      تصدير Excel
    </Button>
  )
}