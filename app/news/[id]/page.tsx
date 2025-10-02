import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { NewsImageHandler } from "@/components/news-image-handler"

interface NewsPageProps {
  params: { id: string }
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // First, fetch the news article
  const { data: article, error } = await supabase
    .from("news")
    .select("id, title, content, summary, image_url, published_at, created_at, created_by")
    .eq("id", params.id)
    .single()

  console.log("Fetching article with ID:", params.id)
  console.log("Article data:", article)
  console.log("Error:", error)

  if (error || !article) {
    console.log("Article not found, returning 404")
    notFound()
  }

  // Then, fetch the author profile separately
  let authorProfile = null
  if (article.created_by) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", article.created_by)
      .single()
    
    if (!profileError && profile) {
      authorProfile = profile
    }
  }

  // Determine if image_url is a URL or Base64 data
  const isImageUrl = article.image_url && (article.image_url.startsWith('http') || article.image_url.startsWith('data:image'))

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/news">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للأخبار
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {article.published_at 
                    ? new Date(article.published_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date(article.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                </span>
              </div>
              {authorProfile?.full_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{authorProfile.full_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Image */}
          <div className="mb-8">
            {isImageUrl ? (
              <div className="h-64 md:h-96 overflow-hidden rounded-lg">
                <NewsImageHandler
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">لا توجد صورة</span>
              </div>
            )}
          </div>

          {/* Article Summary */}
          {article.summary && (
            <div className="mb-8 p-6 bg-muted/50 rounded-lg border-r-4 border-primary">
              <p className="text-lg text-muted-foreground leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</div>
          </div>

          {/* Related Actions */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/centers">
                  تصفح المراكز الطبية
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/news">عرض المزيد من الأخبار</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}