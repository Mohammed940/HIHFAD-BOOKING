"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Shield, Users, ArrowLeft, Stethoscope, Heart, Award, Building } from "lucide-react"
import Link from "next/link"
import { NewsImageHandler } from "@/components/news-image-handler"
import { useState, useEffect } from "react"
import { useAnimation } from "@/hooks/use-animation"

// Define types for our data
type User = any // You can replace this with a proper User type if available
type NewsItem = {
  id: string
  title: string
  summary: string
  content: string
  published_at: string
  image_url: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [centersCount, setCentersCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const heroVisible = useAnimation()
  const featuresVisible = useAnimation(200)
  const statsVisible = useAnimation(400)
  const newsVisible = useAnimation(600)
  const ctaVisible = useAnimation(800)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserClient()
        
        // Check if Supabase is properly initialized
        if (!supabase) {
          console.error("Supabase client not initialized")
          setIsLoading(false)
          return
        }
        
        // Get user data
        const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
        if (userError) {
          console.error("Error fetching user data:", userError)
        }
        setUser(userData || null)

        // Fetch latest news
        const { data: newsData, error: newsError } = await supabase
          .from("news")
          .select("id, title, summary, content, published_at, image_url")
          .eq("is_published", true)
          .order("published_at", { ascending: false })
          .limit(3)
        
        if (newsError) {
          console.error("Error fetching news:", newsError)
        } else {
          setNews(newsData || [])
        }

        // Fetch medical centers count
        const { count: centersCountData, error: countError } = await supabase
          .from("medical_centers")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true)
        
        if (countError) {
          console.error("Error fetching centers count:", countError)
        } else {
          setCentersCount(centersCountData || 0)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Features data with consistent icon sizing and spacing
  const features = [
    {
      icon: <Calendar className="w-10 h-10 text-primary" />,
      title: "حجز سهل وسريع",
      description: "احجز موعدك في دقائق معدودة من خلال واجهة بسيطة وسهلة الاستخدام"
    },
    {
      icon: <Clock className="w-10 h-10 text-primary" />,
      title: "متاح 24/7",
      description: "احجز موعدك في أي وقت من اليوم، النظام متاح على مدار الساعة"
    },
    {
      icon: <Shield className="w-10 h-10 text-primary" />,
      title: "آمن ومحمي",
      description: "بياناتك الشخصية والطبية محمية بأعلى معايير الأمان والخصوصية"
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "أطباء متخصصون",
      description: "احجز مع أفضل الأطباء والمتخصصين في جميع المجالات الطبية"
    }
  ]

  // Stats data with consistent styling
  const stats = [
    { value: centersCount || 0, label: "مركز ومستشفى", icon: <Building className="w-8 h-8 text-primary" /> },
    { value: "50+", label: "عيادة متخصصة", icon: <Stethoscope className="w-8 h-8 text-primary" /> },
    { value: "1000+", label: "مريض راضٍ", icon: <Heart className="w-8 h-8 text-primary" /> },
    { value: "99%", label: "رضا العملاء", icon: <Award className="w-8 h-8 text-primary" /> }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-3xl animate-pulse-slow delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className={`max-w-4xl mx-auto space-y-8 text-center transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-pop-in">
                احجز موعدك الطبي
                <span className="text-secondary block mt-2 bg-gradient-to-r from-secondary to-green-600 bg-clip-text text-transparent animate-slide-in-up">
                  بسهولة وأمان
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
                نظام شامل لحجز المواعيد الطبية في أفضل المراكز والمستشفيات. احجز موعدك الآن واحصل على أفضل رعاية صحية.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
                <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover-lift bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 text-secondary-foreground">
                  <Link href="/centers">
                    احجز موعدك الآن
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
                {!user && (
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full bg-transparent backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift">
                    <Link href="/auth/register">إنشاء حساب جديد</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-primary/10 blur-xl animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-24 h-24 rounded-full bg-secondary/10 blur-xl animate-float delay-500"></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className={`text-center mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-in-up">لماذا تختار نظامنا؟</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-300">
                نقدم لك تجربة حجز مواعيد طبية متطورة وآمنة مع أفضل الخدمات
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className={`transition-all duration-1000 delay-100 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-glow">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                      {features[0].icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{features[0].title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {features[0].description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className={`transition-all duration-1000 delay-200 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-glow">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                      {features[1].icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{features[1].title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {features[1].description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className={`transition-all duration-1000 delay-300 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-glow">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                      {features[2].icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{features[2].title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {features[2].description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
              <div className={`transition-all duration-1000 delay-400 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-glow">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-500 hover:scale-110">
                      {features[3].icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{features[3].title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-muted-foreground">
                      {features[3].description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className={`bg-card backdrop-blur-sm p-8 rounded-2xl border border-border shadow-sm transition-all duration-1000 delay-100 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift hover-scale`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 animate-pop-in">
                  {stats[0].icon}
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary animate-count-up" style={{ animationDelay: '0ms' }}>
                    {stats[0].value}
                  </div>
                  <p className="text-lg text-muted-foreground">{stats[0].label}</p>
                </div>
              </div>
              <div className={`bg-card backdrop-blur-sm p-8 rounded-2xl border border-border shadow-sm transition-all duration-1000 delay-200 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift hover-scale`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 animate-pop-in">
                  {stats[1].icon}
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary animate-count-up" style={{ animationDelay: '200ms' }}>
                    {stats[1].value}
                  </div>
                  <p className="text-lg text-muted-foreground">{stats[1].label}</p>
                </div>
              </div>
              <div className={`bg-card backdrop-blur-sm p-8 rounded-2xl border border-border shadow-sm transition-all duration-1000 delay-300 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift hover-scale`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 animate-pop-in">
                  {stats[2].icon}
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary animate-count-up" style={{ animationDelay: '400ms' }}>
                    {stats[2].value}
                  </div>
                  <p className="text-lg text-muted-foreground">{stats[2].label}</p>
                </div>
              </div>
              <div className={`bg-card backdrop-blur-sm p-8 rounded-2xl border border-border shadow-sm transition-all duration-1000 delay-400 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift hover-scale`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 animate-pop-in">
                  {stats[3].icon}
                </div>
                <div className="space-y-3">
                  <div className="text-4xl font-bold text-primary animate-count-up" style={{ animationDelay: '600ms' }}>
                    {stats[3].value}
                  </div>
                  <p className="text-lg text-muted-foreground">{stats[3].label}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        {news && news.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className={`text-center mb-16 transition-all duration-1000 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-in-up">آخر الأخبار</h2>
                <p className="text-xl text-muted-foreground animate-fade-in-up delay-300">تابع آخر الأخبار والتطورات في المراكز الطبية</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`transition-all duration-1000 delay-100 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-tilt">
                    {/* News Image Preview */}
                    {news[0] && news[0].image_url && (
                      <div className="h-48 overflow-hidden">
                        <NewsImageHandler
                          src={news[0].image_url}
                          alt={news[0].title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg line-clamp-2">{news[0]?.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {news[0] && new Date(news[0].published_at).toLocaleDateString("ar-SA")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {news[0]?.summary || news[0]?.content?.substring(0, 150) + "..."}
                      </p>
                      <Button asChild variant="link" className="p-0 mt-6 hover:no-underline group">
                        <Link href={`/news/${news[0]?.id}`} className="flex items-center">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className={`transition-all duration-1000 delay-200 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-tilt">
                    {/* News Image Preview */}
                    {news[1] && news[1].image_url && (
                      <div className="h-48 overflow-hidden">
                        <NewsImageHandler
                          src={news[1].image_url}
                          alt={news[1].title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg line-clamp-2">{news[1]?.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {news[1] && new Date(news[1].published_at).toLocaleDateString("ar-SA")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {news[1]?.summary || news[1]?.content?.substring(0, 150) + "..."}
                      </p>
                      <Button asChild variant="link" className="p-0 mt-6 hover:no-underline group">
                        <Link href={`/news/${news[1]?.id}`} className="flex items-center">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className={`transition-all duration-1000 delay-300 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-card backdrop-blur-sm rounded-2xl hover-lift hover-tilt">
                    {/* News Image Preview */}
                    {news[2] && news[2].image_url && (
                      <div className="h-48 overflow-hidden">
                        <NewsImageHandler
                          src={news[2].image_url}
                          alt={news[2].title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg line-clamp-2">{news[2]?.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {news[2] && new Date(news[2].published_at).toLocaleDateString("ar-SA")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {news[2]?.summary || news[2]?.content?.substring(0, 150) + "..."}
                      </p>
                      <Button asChild variant="link" className="p-0 mt-6 hover:no-underline group">
                        <Link href={`/news/${news[2]?.id}`} className="flex items-center">
                          اقرأ المزيد
                          <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className={`text-center mt-12 transition-all duration-1000 delay-300 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 hover:shadow-lg transition-all hover-lift bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 text-secondary-foreground border-0">
                  <Link href="/news">عرض جميع الأخبار</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-primary-foreground relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-white/5 blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-white/5 blur-3xl animate-pulse-slow delay-1000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className={`max-w-3xl mx-auto space-y-8 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance animate-pop-in">ابدأ رحلتك الصحية معنا اليوم</h2>
              <p className="text-xl md:text-2xl opacity-90 text-pretty leading-relaxed animate-fade-in-up delay-300">
                انضم إلى آلاف المرضى الذين يثقون بنظامنا للحصول على أفضل رعاية صحية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
                <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover-lift bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 text-secondary-foreground">
                  <Link href="/auth/register">
                    إنشاء حساب مجاني
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
                >
                  <Link href="/centers">تصفح المراكز الطبية</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer user={user} />
    </div>
  )
}