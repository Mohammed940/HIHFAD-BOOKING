import { createServerClient } from "@/lib/supabase/server"
import { ClinicForm } from "@/components/admin/clinic-form"
import { notFound, redirect } from "next/navigation"

interface EditClinicPageProps {
  params: {
    id: string
  }
}

export default async function CenterAdminEditClinicPage({ params }: EditClinicPageProps) {
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

  if (!adminRole) {
    redirect("/")
  }

  // Get the clinic and verify it belongs to this center admin's center
  const { data: clinic, error } = await supabase
    .from("clinics")
    .select(`
      *,
      fixed_time_slots(*)
    `)
    .eq("id", params.id)
    .eq("medical_center_id", adminRole.medical_center_id) // Ensure clinic belongs to admin's center
    .single()

  if (error || !clinic) {
    notFound()
  }

  // Transform the clinic data to match the form's expected structure
  const clinicData = {
    ...clinic,
    fixed_time_slots: clinic.fixed_time_slots || []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">تعديل العيادة</h1>
        <p className="text-purple-100">تحديث معلومات وساعات عمل العيادة</p>
      </div>

      {/* Form */}
      <ClinicForm initialData={clinicData} redirectPath="/center-admin/clinics" />
    </div>
  )
}