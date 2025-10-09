import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, User, ArrowLeft, Calendar, Stethoscope } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CenterPageProps {
  params: Promise<{ id: string }>
}

export default async function CenterPage({ params }: CenterPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch medical center details
  const { data: center } = await supabase
    .from("medical_centers")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!center) {
    notFound()
  }

  // Fetch clinics for this center (both active and inactive)
  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .eq("medical_center_id", id)
    .eq("is_frozen", false)
    .order("name")

  const formatWorkingHours = (hours: any) => {
    if (!hours) return "غير محدد"

    const days = {
      saturday: "السبت",
      sunday: "الأحد",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
    }

    const workingDays = Object.entries(hours)
      .filter(([_, schedule]: [string, any]) => !schedule.closed)
      .map(([day, schedule]: [string, any]) => `${days[day as keyof typeof days]}: ${schedule.start} - ${schedule.end}`)

    return workingDays.length > 0 ? workingDays.join("، ") : "مغلق"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Center Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <Button asChild variant="outline" size="sm" className="rounded-lg hover:shadow-sm transition-all border-primary text-primary hover:bg-primary/10 text-sm px-4 py-1.5">
                <Link href="/centers">
                  <ArrowLeft className="w-3.5 h-3.5 ml-1.5" />
                  العودة للمراكز
                </Link>
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl p-6 shadow-sm border border-primary/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-5">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    {center.name}
                  </h1>
                  <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">{center.description}</p>
                </div>
                <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-full text-base font-semibold">
                  <Stethoscope className="w-5 h-5 inline mr-2" />
                  مركز طبي معتمد
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-primary/10">
                <div className="flex items-start space-x-3.5 space-x-reverse p-3.5 bg-card/50 rounded-lg hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">العنوان</p>
                    <p className="text-foreground font-medium text-sm">{center.address}</p>
                  </div>
                </div>
                
                {center.phone && (
                  <div className="flex items-start space-x-3.5 space-x-reverse p-3.5 bg-card/50 rounded-lg hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">الهاتف</p>
                      <p className="text-foreground font-medium text-sm">{center.phone}</p>
                    </div>
                  </div>
                )}
                
                {center.email && (
                  <div className="flex items-start space-x-3.5 space-x-reverse p-3.5 bg-card/50 rounded-lg hover:shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">البريد الإلكتروني</p>
                      <p className="text-foreground font-medium text-sm">{center.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours */}
          {center.working_hours && (
            <Card className="mb-8 rounded-2xl border-t-4 border-primary bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2.5 text-xl text-foreground">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  ساعات العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-primary/5 p-4 rounded-xl">
                  <p className="text-base text-foreground font-medium">{formatWorkingHours(center.working_hours)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clinics Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                العيادات المتاحة
              </h2>
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                {clinics?.length || 0} عيادة
              </div>
            </div>

            {clinics && clinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map((clinic: any) => (
                  <Card 
                    key={clinic.id} 
                    className={`overflow-hidden transition-all duration-300 hover:-translate-y-1 rounded-2xl shadow-md hover:shadow-lg border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm ${
                      clinic.is_active 
                        ? "border-t-4 border-t-primary" 
                        : "opacity-80 border-t-4 border-t-gray-300"
                    }`}
                  >
                    <div className={`p-5 ${clinic.is_active ? "bg-gradient-to-r from-primary/5 to-secondary/5" : "bg-gray-100/50 dark:bg-gray-800/50"}`}>
                      <CardHeader className="p-0 pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-bold text-foreground leading-tight">
                              {clinic.name}
                            </CardTitle>
                            {clinic.doctor_name && (
                              <CardDescription className="flex items-center gap-2 mt-2.5">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="text-foreground font-medium text-sm">{clinic.doctor_name}</span>
                              </CardDescription>
                            )}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`rounded-full px-2.5 py-1.5 text-xs font-medium border ${
                              clinic.is_active 
                                ? "bg-primary/10 text-primary border-primary/20" 
                                : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {clinic.is_active ? "متاح" : "غير متاح"}
                          </Badge>
                        </div>
                      </CardHeader>
                    </div>
                    
                    <CardContent className="space-y-4 pt-4">
                      {clinic.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{clinic.description}</p>
                      )}

                      {clinic.working_hours && (
                        <div className="bg-primary/5 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium text-foreground text-sm">ساعات العمل:</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatWorkingHours(clinic.working_hours)}</p>
                        </div>
                      )}

                      <Button 
                        asChild 
                        className={`w-full rounded-lg py-4.5 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 ${
                          clinic.is_active 
                            ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-primary-foreground" 
                            : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                        }`}
                        disabled={!clinic.is_active}
                      >
                        <Link 
                          href={user && clinic.is_active ? `/book-appointment?center=${center.id}&clinic=${clinic.id}` : "#"} 
                          className="flex items-center justify-center"
                        >
                          <Calendar className="w-4 h-4 ml-1.5" />
                          {clinic.is_active ? "احجز موعد" : "غير متاح للحجز"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Stethoscope className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1.5">لا توجد عيادات</h3>
                <p className="text-base text-muted-foreground">لا توجد عيادات متاحة في هذا المركز حالياً</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer user={user} />
    </div>
  )
}