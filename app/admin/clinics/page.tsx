import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Clock, Plus, Settings, MapPin } from "lucide-react"
import Link from "next/link"
import { DeleteClinicButton } from "@/components/admin/delete-clinic-button"
import { ClinicToggleButton } from "@/components/admin/clinic-toggle-button"

export default async function AdminClinics() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Get all clinics
  const { data: clinics, error: clinicsError } = await supabase
    .from("clinics")
    .select("*")
    .order("created_at", { ascending: false })
    
  if (clinicsError) {
    console.error("Error fetching clinics:", clinicsError)
  }

  // Get medical centers for clinics
  let enrichedClinics: any[] = []
  if (clinics && clinics.length > 0) {
    // Get unique medical center IDs
    const centerIds = [...new Set(clinics.map(c => c.medical_center_id))]
    
    // Fetch medical centers
    const { data: centers, error: centersError } = await supabase
      .from("medical_centers")
      .select("id, name")
      .in("id", centerIds)
      
    if (centersError) {
      console.error("Error fetching medical centers:", centersError)
    }
    
    // Create lookup map for medical centers
    const centerMap: Record<string, any> = centers?.reduce((acc, center) => ({ ...acc, [center.id]: center }), {}) || {}
    
    // Enrich clinics with medical center data
    enrichedClinics = clinics.map(clinic => ({
      ...clinic,
      medical_centers: centerMap[clinic.medical_center_id]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة العيادات</h1>
            <p className="text-blue-100">عرض وإدارة جميع العيادات في النظام</p>
          </div>
          <Link href="/admin/clinics/new">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="w-4 h-4 ml-2" />
              إضافة عيادة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrichedClinics && enrichedClinics.length > 0 ? (
          enrichedClinics.map((clinic: any) => (
            <Card
              key={clinic.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse mb-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span>{clinic.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{clinic.medical_centers?.name}</span>
                    </div>
                  </div>
                  <Badge
                    variant={clinic.is_active ? "default" : "secondary"}
                    className={clinic.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {clinic.is_active ? "نشط" : "معطل"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {clinic.description && <p className="text-sm text-gray-600 line-clamp-2">{clinic.description}</p>}

                {/* Working Hours Summary */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span>ساعات العمل</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {clinic.working_hours ? (
                      <div className="space-y-1">
                        {Object.entries(clinic.working_hours)
                          .filter(([_, hours]: [string, any]) => hours.is_open)
                          .slice(0, 2)
                          .map(([day, hours]: [string, any]) => (
                            <div key={day} className="flex justify-between">
                              <span className="font-medium">{getDayName(day)}:</span>
                              <span>
                                {hours.start_time} - {hours.end_time}
                              </span>
                            </div>
                          ))}
                        {Object.values(clinic.working_hours).filter((hours: any) => hours.is_open).length > 2 && (
                          <p className="text-xs text-gray-500">وأيام أخرى...</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">لم يتم تحديد ساعات العمل</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse pt-4 border-t">
                  <Link href={`/admin/clinics/${clinic.id}/edit`}>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Settings className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <DeleteClinicButton clinicId={clinic.id} clinicName={clinic.name} />
                  {/* زر تفعيل/تعطيل العيادة */}
                  <ClinicToggleButton 
                    clinicId={clinic.id} 
                    isActive={clinic.is_active} 
                  />
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
                <p className="text-gray-600 mb-4">لم يتم إضافة أي عيادات بعد</p>
                <Link href="/admin/clinics/new">
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