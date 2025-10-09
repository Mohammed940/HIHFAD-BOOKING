import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default async function CenterAdminDashboard() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get admin role and center info
  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("*, medical_centers(*)")
    .eq("user_id", user?.id)
    .eq("role", "center_admin")
    .single()

  if (!adminRole) return null

  const centerId = adminRole.medical_center_id

  // Get statistics
  const [
    { count: totalClinics },
    { count: totalAppointments },
    { count: pendingAppointments },
    { count: approvedAppointments },
    { count: rejectedAppointments },
    { data: recentAppointments },
  ] = await Promise.all([
    supabase.from("clinics").select("*", { count: "exact", head: true }).eq("medical_center_id", centerId),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("medical_center_id", centerId),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("medical_center_id", centerId)
      .eq("status", "pending"),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("medical_center_id", centerId)
      .eq("status", "approved"),
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("medical_center_id", centerId)
      .eq("status", "rejected"),
    supabase
      .from("appointments")
      .select(`
        *,
        profiles(full_name, phone),
        clinics(name)
      `)
      .eq("medical_center_id", centerId)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: "إجمالي العيادات",
      value: totalClinics || 0,
      icon: Building2,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "إجمالي المواعيد",
      value: totalAppointments || 0,
      icon: Calendar,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "المواعيد المعلقة",
      value: pendingAppointments || 0,
      icon: Clock,
      color: "bg-yellow-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
    },
    {
      title: "المواعيد المقبولة",
      value: approvedAppointments || 0,
      icon: CheckCircle,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
            <p className="text-blue-100 text-lg">{adminRole.medical_centers?.name}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Appointments */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>المواعيد الأخيرة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentAppointments && recentAppointments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentAppointments.map((appointment: any) => (
                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <h3 className="font-semibold text-gray-900">{appointment.profiles?.full_name || "غير محدد"}</h3>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">العيادة:</span> {appointment.clinics?.name}
                        </p>
                        <p>
                          <span className="font-medium">التاريخ:</span>{" "}
                          {new Date(appointment.appointment_date).toLocaleDateString("ar-SA")}
                        </p>
                        <p>
                          <span className="font-medium">الوقت:</span> {appointment.appointment_time}
                        </p>
                        {appointment.profiles?.phone && (
                          <p>
                            <span className="font-medium">الهاتف:</span> {appointment.profiles.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد مواعيد حديثة</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
