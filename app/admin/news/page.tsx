import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Newspaper, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { DeleteNewsButton } from "@/components/admin/delete-news-button"
import { NewsActionsWrapper } from "@/components/admin/news-actions-wrapper"

export default async function AdminNews() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // Get all news articles
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة الأخبار</h1>
            <p className="text-blue-100">عرض وإدارة جميع الأخبار والمقالات</p>
          </div>
          <Link href="/admin/news/new">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="w-4 h-4 ml-2" />
              إضافة خبر جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news && news.length > 0 ? (
          news.map((article: any) => (
            <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{article.author}</p>
                  </div>
                  <Badge
                    variant={article.is_published ? "default" : "secondary"}
                    className={article.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {article.is_published ? "منشور" : "مسودة"}
                  </Badge>
                </div>
                {/* أزرار التحكم بالخبر */}
                <NewsActionsWrapper newsId={article.id} />
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>

                <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.created_at).toLocaleDateString("ar-SA")}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse pt-4 border-t">
                  <Link href={`/news/${article.id}`} target="_blank">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 ml-2" />
                      عرض
                    </Button>
                  </Link>
                  <Link href={`/admin/news/${article.id}/edit`}>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Button>
                  </Link>
                  <DeleteNewsButton newsId={article.id} newsTitle={article.title} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أخبار</h3>
                <p className="text-gray-600 mb-4">لم يتم إضافة أي أخبار بعد</p>
                <Link href="/admin/news/new">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة خبر جديد
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