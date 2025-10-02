import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Calendar, Users, TrendingUp, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { QuickLinkCard } from "@/components/admin/quick-link-card"

export default async function AdminDashboard() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [
    { count: centersCount },
    { count: clinicsCount },
    { count: appointmentsCount },
    { count: usersCount },
    { data: recentAppointments },
    { data: pendingAppointments },
    { data: recentClinics },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("medical_centers").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("clinics").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("appointments").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select(`
        *,
        medical_center:medical_centers(name),
        clinic:clinics(name),
        user:profiles(full_name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("clinics")
      .select(`
        *,
        medical_center:medical_centers(name)
      `)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: "المراكز الطبية",
      value: centersCount || 0,
      icon: Building2,
      description: "إجمالي المراكز النشطة",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "العيادات",
      value: clinicsCount || 0,
      icon: Stethoscope,
      description: "إجمالي العيادات النشطة",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "المواعيد",
      value: appointmentsCount || 0,
      icon: Calendar,
      description: "إجمالي المواعيد",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "المستخدمين",
      value: usersCount || 0,
      icon: Users,
      description: "إجمالي المستخدمين المسجلين",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "approved":
        return "مؤكد"
      case "rejected":
        return "مرفوض"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "approved":
        return "text-green-600 bg-green-100"
      case "rejected":
        return "text-red-600 bg-red-100"
      case "cancelled":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم الرئيسية</h1>
        <p className="text-muted-foreground">نظرة عامة على النظام والإحصائيات</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              آخر المواعيد
            </CardTitle>
            <CardDescription>أحدث 5 مواعيد تم حجزها</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments && recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{appointment.user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{appointment.medical_center?.name}</p>
                      <p className="text-xs text-muted-foreground">{appointment.clinic?.name}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground">{appointment.appointment_date}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusBadge(appointment.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">لا توجد مواعيد حديثة</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Appointments Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              المواعيد المعلقة
            </CardTitle>
            <CardDescription>المواعيد التي تحتاج إلى مراجعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingAppointments || 0}</div>
              <p className="text-muted-foreground">موعد في انتظار الموافقة</p>
              {(pendingAppointments && pendingAppointments.length > 0) && <p className="text-sm text-yellow-600 mt-2">يحتاج إلى مراجعة عاجلة</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clinics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            آخر العيادات المضافة
          </CardTitle>
          <CardDescription>أحدث 5 عيادات تم إضافتها</CardDescription>
        </CardHeader>
        <CardContent>
          {recentClinics && recentClinics.length > 0 ? (
            <div className="space-y-4">
              {recentClinics.map((clinic) => (
                <div key={clinic.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground">{clinic.medical_center?.name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={clinic.is_active ? "default" : "secondary"}>
                      {clinic.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لا توجد عيادات حديثة</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            آخر المستخدمين المسجلين
          </CardTitle>
          <CardDescription>أحدث 5 مستخدمين قاموا بالتسجيل</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{user.full_name || "غير محدد"}</p>
                  </div>
                  <div className="text-right">
                    <a href={`/admin/users`} className="text-xs text-primary hover:underline">
                      عرض التفاصيل
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">لا توجد مستخدمين حديثين</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickLinkCard 
          href="/admin/centers" 
          title="إدارة المراكز الطبية" 
          icon={<Building2 className="w-4 h-4" />} 
        />
        <QuickLinkCard 
          href="/admin/clinics" 
          title="إدارة العيادات" 
          icon={<Stethoscope className="w-4 h-4" />} 
        />
        <QuickLinkCard 
          href="/admin/appointments" 
          title="إدارة المواعيد" 
          icon={<Calendar className="w-4 h-4" />} 
        />
        <QuickLinkCard 
          href="/admin/users" 
          title="إدارة المستخدمين" 
          icon={<Users className="w-4 h-4" />} 
        />
      </div>
    </div>
  )
}