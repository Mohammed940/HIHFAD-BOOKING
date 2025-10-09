import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, User, Clock, Building2, Filter } from "lucide-react"
import { AppointmentStatusButtons } from "@/components/admin/appointment-status-buttons"
import { ExportCenterAppointmentsButton } from "@/components/admin/export-center-appointments-button"
import { AppointmentFilterButton } from "@/components/admin/appointment-filter-button"
import { CenterAppointmentFilter } from "@/components/center-admin/center-appointment-filter"
import { ApproveAllAppointmentsButton } from "@/components/admin/approve-all-appointments-button"

// Add searchParams to the component props
interface CenterAdminAppointmentsProps {
  searchParams: Promise<{
    status?: string;
    clinic?: string;
    date?: string;
  }>;
}

export default async function CenterAdminAppointments({ searchParams }: CenterAdminAppointmentsProps) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get admin role and center info
  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("medical_center_id")
    .eq("user_id", user?.id)
    .eq("role", "center_admin")
    .single()

  if (!adminRole) return null

  // Get filter parameters
  const { status, clinic, date } = await searchParams || {};

  // First, get appointments for this center with filters applied
  let appointmentsQuery = supabase
    .from("appointments")
    .select("*")
    .eq("medical_center_id", adminRole.medical_center_id)
    .order("created_at", { ascending: false })

  // Apply filters if they exist
  if (status) {
    appointmentsQuery = appointmentsQuery.eq("status", status)
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

  // Get clinics for this center
  const { data: clinics, error: clinicsError } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("medical_center_id", adminRole.medical_center_id)

  if (clinicsError) {
    console.error("Error fetching clinics:", clinicsError)
  }

  // Then get related data (users and clinics)
  let enrichedAppointments: any[] = []
  if (appointments && appointments.length > 0) {
    // Get unique user IDs
    const userIds = [...new Set(appointments.map((a: any) => a.user_id))]

    // Fetch related user data
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds)

    if (usersError) console.error("Error fetching users:", usersError)

    // Create lookup maps for efficient access
    const userMap: Record<string, any> = users?.reduce((acc: Record<string, any>, user: any) => ({ ...acc, [user.id]: user }), {}) || {}
    const clinicMap: Record<string, any> = clinics?.reduce((acc: Record<string, any>, clinic: any) => ({ ...acc, [clinic.id]: clinic }), {}) || {}

    // Enrich appointments with related data
    enrichedAppointments = appointments.map((appointment: any) => ({
      ...appointment,
      profiles: userMap[appointment.user_id],
      clinics: clinicMap[appointment.clinic_id]
    }))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة المواعيد</h1>
            <p className="text-blue-100">عرض وإدارة جميع مواعيد المركز الطبي</p>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <ApproveAllAppointmentsButton centerId={adminRole.medical_center_id} />
            <ExportCenterAppointmentsButton centerId={adminRole.medical_center_id} />
            <AppointmentFilterButton />
          </div>
        </div>
      </div>

      {/* Filter Section - Hidden by default */}
      <CenterAppointmentFilter 
        clinics={clinics || []} 
        status={status}
        clinicId={clinic}
        date={date}
      />

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
                        <span>{appointment.clinics?.name || "غير محدد"}</span>
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
                        <span className="font-medium text-gray-700">العيادة:</span> {appointment.clinics?.name || "غير محدد"}
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
              <p className="text-gray-600">لم يتم حجز أي مواعيد في هذا المركز بعد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}