import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ArrowLeft, Building, Stethoscope, Users } from "lucide-react"
import Link from "next/link"

// Define the type for center data
interface Center {
  id: string
  name: string
  description: string | null
  address: string | null
  phone: string | null
  clinics?: {
    count: number
  }[]
}

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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{centers?.length || 0}</p>
                  <p className="text-muted-foreground">مركز طبي</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {centers?.reduce((acc: number, center: Center) => acc + (center.clinics?.[0]?.count || 0), 0) || 0}
                  </p>
                  <p className="text-muted-foreground">عيادة متخصصة</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-muted-foreground">متاح للحجز</p>
                </div>
              </div>
            </div>
          </div>

          {/* Centers Grid */}
          {centers && centers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centers.map((center: Center) => (
                <Card 
                  key={center.id} 
                  className="overflow-hidden border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary"
                >
                  <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-5">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl font-bold text-foreground leading-tight">
                          {center.name}
                        </CardTitle>
                        <div className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                          <Users className="w-3.5 h-3.5 inline mr-1" />
                          {center.clinics?.[0]?.count || 0}
                        </div>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground mt-1">
                        عيادة متخصصة
                      </CardDescription>
                    </CardHeader>
                  </div>
                  
                  <CardContent className="space-y-4 pt-3">
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {center.description || "لا يوجد وصف متاح لهذا المركز"}
                      </p>

                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-start space-x-2.5 space-x-reverse">
                          <div className="mt-0.5">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">العنوان</p>
                            <p className="text-xs text-muted-foreground">{center.address || "غير متوفر"}</p>
                          </div>
                        </div>
                        
                        {center.phone && (
                          <div className="flex items-start space-x-2.5 space-x-reverse">
                            <div className="mt-0.5">
                              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">الهاتف</p>
                              <p className="text-xs text-muted-foreground">{center.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start space-x-2.5 space-x-reverse">
                          <div className="mt-0.5">
                            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">ساعات العمل</p>
                            <p className="text-xs text-muted-foreground">متاح للحجز على مدار الساعة</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <Button asChild className="w-full rounded-lg py-4.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground text-sm shadow-sm hover:shadow-md transition-all duration-300">
                        <Link href={`/centers/${center.id}`} className="flex items-center justify-center">
                          عرض التفاصيل
                          <ArrowLeft className="w-4 h-4 mr-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <Building className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1.5">لا توجد مراكز طبية</h3>
              <p className="text-muted-foreground text-sm">لا توجد مراكز طبية متاحة حالياً</p>
            </div>
          )}
        </div>
      </main>

      <Footer user={user} />
    </div>
  )
}