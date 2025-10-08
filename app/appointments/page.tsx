import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { requireAuth } from "@/lib/auth-utils"
import { NotificationHandler } from "@/components/notification-handler"
import { AppointmentsList } from "@/components/appointments-list"

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
      <NotificationHandler userId={user?.id || null} />
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

            {/* Appointments List - Now using the client component */}
            <AppointmentsList initialAppointments={appointments || []} userId={user.id} />
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  )
}