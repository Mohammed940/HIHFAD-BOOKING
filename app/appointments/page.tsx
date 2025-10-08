import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CancelAppointmentButton } from "@/components/cancel-appointment-button"
import { requireAuth } from "@/lib/auth-utils"

// Define the type for appointment data
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
  medical_center?: {
    name: string
    address: string
  }
  clinic?: {
    name: string
    doctor_name: string
  }
}

export default async function AppointmentsPage() {
  const { user, supabase } = await requireAuth()

  // Fetch user's appointments with related data, excluding cancelled appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      medical_center:medical_centers(name, address),
      clinic:clinics(name, doctor_name)
    `)
    .eq("user_id", user.id)
    .neq("status", "cancelled") // Exclude cancelled appointments
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">في الانتظار</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">مؤكد</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">مرفوض</Badge>
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-t-4 border-yellow-500"
      case "approved":
        return "border-t-4 border-green-500"
      case "rejected":
        return "border-t-4 border-red-500"
      default:
        return "border-t-4 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  مواعيدي
                </h1>
                <p className="text-xl text-muted-foreground">إدارة ومتابعة مواعيدك الطبية</p>
              </div>
              <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-secondary-foreground">
                <Link href="/centers">
                  <Plus className="w-5 h-5 ml-2" />
                  حجز موعد جديد
                </Link>
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {appointments?.filter((a: Appointment) => a.status === "approved").length || 0}
                    </p>
                    <p className="text-muted-foreground">مواعيد مؤكدة</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {appointments?.filter((a: Appointment) => a.status === "pending").length || 0}
                    </p>
                    <p className="text-muted-foreground">قيد الانتظار</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {appointments?.length || 0}
                    </p>
                    <p className="text-muted-foreground">إجمالي المواعيد</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            {appointments && appointments.length > 0 ? (
              <div className="space-y-6">
                {appointments.map((appointment: Appointment) => (
                  <Card 
                    key={appointment.id} 
                    className={`medical-card hover-lift ${getStatusColor(appointment.status)}`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl font-semibold text-foreground">{appointment.medical_center?.name}</CardTitle>
                          <CardDescription className="text-base text-primary font-medium">{appointment.clinic?.name}</CardDescription>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <span className="text-sm text-muted-foreground">التاريخ:</span>
                              <span className="font-medium text-foreground mr-2">
                                {format(new Date(appointment.appointment_date), "dd MMMM yyyy", { locale: ar })}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                            <div>
                              <span className="text-sm text-muted-foreground">الوقت:</span>
                              <span className="font-medium text-foreground mr-2">{appointment.appointment_time}</span>
                            </div>
                          </div>
                          {appointment.clinic?.doctor_name && (
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-primary flex-shrink-0" />
                              <div>
                                <span className="text-sm text-muted-foreground">الطبيب:</span>
                                <span className="font-medium text-foreground mr-2">{appointment.clinic.doctor_name}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-sm text-muted-foreground block">العنوان:</span>
                              <span className="text-sm text-foreground">{appointment.medical_center?.address}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-sm text-muted-foreground block">ملاحظات:</span>
                                <span className="text-sm text-foreground">{appointment.notes}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {appointment.admin_notes && (
                        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium text-primary">ملاحظات الإدارة:</span>
                          </div>
                          <span className="text-sm text-foreground">{appointment.admin_notes}</span>
                        </div>
                      )}

                      {appointment.status === "pending" && (
                        <div className="flex gap-3 pt-4">
                          <CancelAppointmentButton appointmentId={appointment.id} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مواعيد</h3>
                <p className="text-muted-foreground mb-6">لم تقم بحجز أي مواعيد بعد</p>
                <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-secondary-foreground">
                  <Link href="/centers">
                    <Plus className="w-5 h-5 ml-2" />
                    احجز موعدك الأول
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  )
}