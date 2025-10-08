import { ClinicForm } from "@/components/admin/clinic-form"

export default function NewClinicPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">إضافة عيادة جديدة</h1>
        <p className="text-purple-100">إنشاء عيادة جديدة وتحديد ساعات العمل</p>
      </div>

      {/* Form */}
      <ClinicForm />
    </div>
  )
}
