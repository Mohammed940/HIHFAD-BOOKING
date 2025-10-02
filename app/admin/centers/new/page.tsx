import { requireSuperAdmin } from "@/lib/auth-utils"
import { CenterForm } from "@/components/admin/center-form"

export default async function NewCenterPage() {
  await requireSuperAdmin()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إضافة مركز طبي جديد</h1>
        <p className="text-muted-foreground">أدخل معلومات المركز الطبي الجديد</p>
      </div>

      <CenterForm />
    </div>
  )
}
