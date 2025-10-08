import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Phone, User, Clock, Building2, Filter } from "lucide-react"
import { ExportAppointmentsButton } from "@/components/admin/export-appointments-button"
import { AppointmentStatusButtons } from "@/components/admin/appointment-status-buttons"
import { AppointmentFilterButton } from "@/components/admin/appointment-filter-button"

// Add searchParams to the component props
interface AdminAppointmentsProps {
  searchParams: Promise<{
    status?: string;
    center?: string;
    clinic?: string;
    date?: string;
  }>;
}

export default async function AdminAppointments({ searchParams }: AdminAppointmentsProps) {
  await requireSuperAdmin()
  const supabase = await createClient()
  
  // Get filter parameters
  const { status, center, clinic, date } = await searchParams || {};

  // First, get appointments with filters applied
  let appointmentsQuery = supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false })

  // Apply filters if they exist
  if (status) {
    appointmentsQuery = appointmentsQuery.eq("status", status)
  }
  
  if (center) {
    appointmentsQuery = appointmentsQuery.eq("medical_center_id", center)
  }
  
  if (clinic) {
    appointmentsQuery = appointmentsQuery.eq("clinic_id", clinic)
  }
  
  if (date) {
    appointmentsQuery = appointmentsQuery.eq("appointment_date", date)
  }

  const { data: appointments, error: appointmentsError } = await appointmentsQuery

  if (appointmentsError) {
    console.error("Error fetching appointments:", appointmentsError)
  }

  // Then get related data
  let enrichedAppointments: any[] = []
  if (appointments && appointments.length > 0) {
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
      supabase.from("profiles").select("id, full_name, phone").in("id", userIds),
      supabase.from("clinics").select("id, name").in("id", clinicIds),
      supabase.from("medical_centers").select("id, name").in("id", centerIds)
    ])

    if (usersError) console.error("Error fetching users:", usersError)
    if (clinicsError) console.error("Error fetching clinics:", clinicsError)
    if (centersError) console.error("Error fetching centers:", centersError)

    // Create lookup maps for efficient access
    const userMap: Record<string, any> = users?.reduce((acc: Record<string, any>, user: any) => ({ ...acc, [user.id]: user }), {}) || {}
    const clinicMap: Record<string, any> = clinics?.reduce((acc: Record<string, any>, clinic: any) => ({ ...acc, [clinic.id]: clinic }), {}) || {}
    const centerMap: Record<string, any> = centers?.reduce((acc: Record<string, any>, center: any) => ({ ...acc, [center.id]: center }), {}) || {}

    // Enrich appointments with related data
    enrichedAppointments = appointments.map((appointment: any) => ({
      ...appointment,
      profiles: userMap[appointment.user_id],
      clinics: clinicMap[appointment.clinic_id],
      medical_centers: centerMap[appointment.medical_center_id]
    }))
  }

  // Get statistics (filtered statistics would be more complex to implement)
  const [
    { count: totalAppointments, error: totalError },
    { count: pendingAppointments, error: pendingError },
    { count: approvedAppointments, error: approvedError },
    { count: rejectedAppointments, error: rejectedError },
  ] = await Promise.all([
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ])

  if (totalError) console.error("Error fetching total appointments:", totalError)
  if (pendingError) console.error("Error fetching pending appointments:", pendingError)
  if (approvedError) console.error("Error fetching approved appointments:", approvedError)
  if (rejectedError) console.error("Error fetching rejected appointments:", rejectedError)

  const stats = [
    {
      title: "إجمالي المواعيد",
      value: totalAppointments || 0,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "المواعيد المعلقة",
      value: pendingAppointments || 0,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      title: "المواعيد المقبولة",
      value: approvedAppointments || 0,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "المواعيد المرفوضة",
      value: rejectedAppointments || 0,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            معلق
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            مقبول
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            مرفوض
          </Badge>
        )
      default:
        return <Badge variant="secondary">غير محدد</Badge>
    }
  }

  const getUserAge = (age: number | null) => {
    if (!age) return "غير محدد"
    return `${age} سنة`
  }

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case "male":
        return "ذكر"
      case "female":
        return "أنثى"
      default:
        return "غير محدد"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة المواعيد</h1>
            <p className="text-blue-100">عرض وإدارة جميع المواعيد في النظام</p>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <ExportAppointmentsButton />
            <AppointmentFilterButton />
          </div>
        </div>
      </div>

      {/* Filter Section - Hidden by default */}
      <div id="filter-section" className="hidden">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <form 
              method="GET"
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select 
                  name="status"
                  className="w-full border rounded-md px-3 py-2"
                  defaultValue={status || ""}
                >
                  <option value="">جميع الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="approved">مقبول</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المركز الطبي</label>
                <select 
                  name="center"
                  className="w-full border rounded-md px-3 py-2"
                  defaultValue={center || ""}
                >
                  <option value="">جميع المراكز</option>
                  {/* Will be populated dynamically */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">العيادة</label>
                <select 
                  name="clinic"
                  className="w-full border rounded-md px-3 py-2"
                  defaultValue={clinic || ""}
                >
                  <option value="">جميع العيادات</option>
                  {/* Will be populated dynamically */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الموعد</label>
                <input 
                  type="date" 
                  name="date"
                  className="w-full border rounded-md px-3 py-2"
                  defaultValue={date || ""}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  type="submit"
                  className="w-full"
                >
                  تطبيق التصفية
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <div className={`w-6 h-6 ${stat.color} rounded`}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Appointments List */}
      <div className="grid gap-6">
        {enrichedAppointments && enrichedAppointments.length > 0 ? (
          enrichedAppointments.map((appointment: any) => (
            <Card key={appointment.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {appointment.patient_name || appointment.profiles?.full_name || "غير محدد"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getGenderLabel(appointment.patient_gender)} | {getUserAge(appointment.patient_age)}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString("ar-SA")}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <span>{appointment.medical_centers?.name}</span>
                      </div>
                      {appointment.profiles?.phone && (
                        <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                          <Phone className="w-4 h-4 text-orange-500" />
                          <span>{appointment.profiles.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Clinic and Notes */}
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-gray-700">العيادة:</span> {appointment.clinics?.name}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm">
                          <span className="font-medium text-gray-700">ملاحظات:</span> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-start lg:items-end space-y-3">
                    {getStatusBadge(appointment.status)}
                    <AppointmentStatusButtons appointmentId={appointment.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد</h3>
              <p className="text-gray-600">لم يتم حجز أي مواعيد بعد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}