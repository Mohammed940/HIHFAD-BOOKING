import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, MapPin, Phone, Mail, Edit } from "lucide-react"
import Link from "next/link"
import { DeleteCenterButton } from "@/components/admin/delete-center-button"

export default async function AdminCentersPage() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Fetch all medical centers with clinic count
  const { data: centers } = await supabase
    .from("medical_centers")
    .select(`
      *,
      clinics:clinics(count)
    `)
    .order("name")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المراكز الطبية</h1>
          <p className="text-muted-foreground">إضافة وتعديل وحذف المراكز الطبية</p>
        </div>
        <Button asChild>
          <Link href="/admin/centers/new">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مركز جديد
          </Link>
        </Button>
      </div>

      {/* Centers Grid */}
      {centers && centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <Card key={center.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{center.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={center.is_active ? "default" : "secondary"}>
                        {center.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                      <Badge variant="outline">{center.clinics?.[0]?.count || 0} عيادة</Badge>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">{center.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{center.address}</span>
                  </div>
                  {center.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{center.phone}</span>
                    </div>
                  )}
                  {center.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{center.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/admin/centers/${center.id}/edit`}>
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Link>
                  </Button>
                  <DeleteCenterButton centerId={center.id} centerName={center.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مراكز طبية</h3>
          <p className="text-muted-foreground mb-6">ابدأ بإضافة أول مركز طبي</p>
          <Button asChild size="lg">
            <Link href="/admin/centers/new">
              <Plus className="w-5 h-5 ml-2" />
              إضافة مركز جديد
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
