import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Clock, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { ToggleClinicStatus } from "@/components/admin/toggle-clinic-status"

export default async function CenterAdminClinics() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get admin role and center info
  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("medical_center_id, medical_centers(name)")
    .eq("user_id", user?.id)
    .eq("role", "center_admin")
    .single()

  if (!adminRole) return null

  // Get all clinics for this center
  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .eq("medical_center_id", adminRole.medical_center_id)
    .order("name")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة العيادات</h1>
            <p className="text-blue-100">عرض وإدارة عيادات {adminRole.medical_centers?.name}</p>
          </div>
          <Link href="/center-admin/clinics/new">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عيادة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics && clinics.length > 0 ? (
          clinics.map((clinic: any) => (
            <Card key={clinic.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>{clinic.name}</span>
                  </CardTitle>
                  <Badge
                    variant={clinic.is_active ? "default" : "secondary"}
                    className={clinic.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {clinic.is_active ? "نشط" : "معطل"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {clinic.description && <p className="text-sm text-gray-600">{clinic.description}</p>}

                {/* Working Hours */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>ساعات العمل</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {clinic.working_hours ? (
                      Object.entries(clinic.working_hours).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{getDayName(day)}:</span>
                          <span>{hours.is_open ? `${hours.start_time} - ${hours.end_time}` : "مغلق"}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">لم يتم تحديد ساعات العمل</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse pt-4 border-t">
                  <ToggleClinicStatus clinicId={clinic.id} currentStatus={clinic.is_active} />
                  <Link href={`/center-admin/clinics/${clinic.id}/edit`}>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عيادات</h3>
                <p className="text-gray-600 mb-4">لم يتم إضافة أي عيادات لهذا المركز بعد</p>
                <Link href="/center-admin/clinics/new">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة عيادة جديدة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function getDayName(day: string): string {
  const dayNames: { [key: string]: string } = {
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  }
  return dayNames[day] || day
}
