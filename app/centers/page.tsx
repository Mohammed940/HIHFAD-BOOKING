import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CentersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch all active medical centers with their clinics
  const { data: centers } = await supabase
    .from("medical_centers")
    .select(`
      *,
      clinics:clinics(count)
    `)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              المراكز الطبية
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              اختر من بين أفضل المراكز والمستشفيات المتخصصة للحصول على أفضل رعاية صحية
            </p>
          </div>

          {/* Centers Grid */}
          {centers && centers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {centers.map((center) => (
                <Card 
                  key={center.id} 
                  className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-balance text-foreground">{center.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary font-medium">{center.clinics?.[0]?.count || 0} عيادة متخصصة</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {center.description || "لا يوجد وصف متاح لهذا المركز"}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 space-x-reverse text-sm text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{center.address}</span>
                      </div>
                      {center.phone && (
                        <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground">
                          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-foreground">{center.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">متاح للحجز</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button asChild className="flex-1 rounded-lg py-5 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
                        <Link href={`/centers/${center.id}`} className="flex items-center justify-center">
                          عرض التفاصيل
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">لا توجد مراكز طبية متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}