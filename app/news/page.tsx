import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { NewsImageHandler } from "@/components/news-image-handler"

export default async function NewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all published news with image_url
  const { data: news } = await supabase
    .from("news")
    .select("id, title, summary, content, published_at, image_url")
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">الأخبار والتحديثات</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              تابع آخر الأخبار والتطورات في المراكز الطبية والخدمات الصحية
            </p>
          </div>

          {/* News Grid */}
          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  {/* News Image Preview */}
                  {article.image_url && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <NewsImageHandler
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2 text-balance">{article.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.published_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                      {article.summary || article.content.substring(0, 200) + "..."}
                    </p>

                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href={`/news/${article.id}`}>
                        اقرأ المزيد
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">لا توجد أخبار متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}