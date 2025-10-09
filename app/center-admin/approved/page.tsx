import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Phone, User, CheckCircle } from "lucide-react"
import { AppointmentStatusButtons } from "@/components/admin/appointment-status-buttons"

export default async function CenterAdminApprovedAppointments() {
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

  // First, get approved appointments for this center
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("*")
    .eq("medical_center_id", adminRole.medical_center_id)
    .eq("status", "approved")
    .order("appointment_date", { ascending: true })

  if (appointmentsError) {
    console.error("Error fetching appointments:", appointmentsError)
  }

  // Then get related user data
  let enrichedAppointments: any[] = []
  if (appointments && appointments.length > 0) {
    // Get unique user IDs
    const userIds = [...new Set(appointments.map(a => a.user_id))]

    // Fetch related user data
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, full_name, phone, date_of_birth, gender")
      .in("id", userIds)

    if (usersError) console.error("Error fetching users:", usersError)

    // Create lookup maps for efficient access
    const userMap: Record<string, any> = users?.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}) || {}

    // Enrich appointments with user data
    enrichedAppointments = appointments.map(appointment => ({
      ...appointment,
      profiles: userMap[appointment.user_id]
    }))
  }

  const getUserAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "غير محدد"
    const dob = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">المواعيد المقبولة</h1>
            <p className="text-green-100">المواعيد المؤكدة والمجدولة</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid gap-6">
        {enrichedAppointments && enrichedAppointments.length > 0 ? (
          enrichedAppointments.map((appointment: any) => (
            <Card
              key={appointment.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Patient Info */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {appointment.profiles?.full_name || "غير محدد"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getGenderLabel(appointment.profiles?.gender)} | {getUserAge(appointment.profiles?.date_of_birth)}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString("ar-SA")}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      {appointment.profiles?.phone && (
                        <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                          <Phone className="w-4 h-4 text-green-500" />
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

                  {/* Status */}
                  <div className="flex flex-col items-start lg:items-end space-y-3">
                    <Badge className="bg-green-100 text-green-800">مقبول</Badge>
                    <p className="text-xs text-gray-500">
                      تم القبول في {new Date(appointment.updated_at).toLocaleDateString("ar-SA")}
                    </p>
                    <AppointmentStatusButtons appointmentId={appointment.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد مقبولة</h3>
              <p className="text-gray-600">لم يتم قبول أي مواعيد بعد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}