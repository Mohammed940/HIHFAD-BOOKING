import { requireSuperAdmin } from "@/lib/auth-utils"
import { createServerClient } from "@/lib/supabase/server"
import { CenterForm } from "@/components/admin/center-form"
import { notFound } from "next/navigation"

interface EditCenterPageProps {
  params: {
    id: string
  }
}

export default async function EditCenterPage({ params }: EditCenterPageProps) {
  await requireSuperAdmin()
  const supabase = await createServerClient()

  // Fetch the medical center
  const { data: center, error } = await supabase
    .from("medical_centers")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !center) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">تعديل المركز الطبي</h1>
        <p className="text-muted-foreground">تحديث معلومات المركز الطبي</p>
      </div>

      <CenterForm center={center} />
    </div>
  )
}