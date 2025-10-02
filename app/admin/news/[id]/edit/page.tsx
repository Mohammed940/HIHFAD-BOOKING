import { createServerClient } from "@/lib/supabase/server"
import { NewsForm } from "@/components/admin/news-form"
import { notFound } from "next/navigation"

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const supabase = await createServerClient()

  // Get the news article
  const { data: news, error } = await supabase.from("news").select("*").eq("id", params.id).single()

  if (error || !news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">تعديل الخبر</h1>
        <p className="text-green-100">تحديث محتوى ومعلومات الخبر</p>
      </div>

      {/* Form */}
      <NewsForm initialData={news} />
    </div>
  )
}
