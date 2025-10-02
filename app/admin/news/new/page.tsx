import { NewsForm } from "@/components/admin/news-form"

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">إضافة خبر جديد</h1>
        <p className="text-green-100">إنشاء مقال أو خبر جديد لعرضه على الموقع</p>
      </div>

      {/* Form */}
      <NewsForm />
    </div>
  )
}
