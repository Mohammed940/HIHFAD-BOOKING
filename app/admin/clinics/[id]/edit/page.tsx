import { createServerClient } from "@/lib/supabase/server"
import { ClinicForm } from "@/components/admin/clinic-form"
import { notFound } from "next/navigation"

interface EditClinicPageProps {
  params: {
    id: string
  }
}

export default async function EditClinicPage({ params }: EditClinicPageProps) {
  const supabase = await createServerClient()

  // Get the clinic with fixed time slots
  const { data: clinic, error } = await supabase
    .from("clinics")
    .select(`
      *,
      fixed_time_slots(*)
    `)
    .eq("id", params.id)
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
      <ClinicForm initialData={clinicData} redirectPath="/admin/clinics" />
    </div>
  )
}