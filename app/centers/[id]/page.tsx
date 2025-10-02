import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, User, ArrowLeft, Calendar } from "lucide-react"
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

  // Fetch clinics for this center
  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .eq("medical_center_id", id)
    .eq("is_active", true)
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
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Button asChild variant="outline" size="sm" className="rounded-lg hover:shadow-md transition-all border-primary text-primary hover:bg-primary/10">
                <Link href="/centers">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة للمراكز
                </Link>
              </Button>
            </div>

            <div className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-2xl p-8 shadow-sm border border-primary/20">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {center.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{center.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{center.address}</span>
                </div>
                {center.phone && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{center.phone}</span>
                  </div>
                )}
                {center.email && (
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{center.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours */}
          {center.working_hours && (
            <Card className="mb-12 rounded-2xl border-t-4 border-primary bg-background/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  ساعات العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">{formatWorkingHours(center.working_hours)}</p>
              </CardContent>
            </Card>
          )}

          {/* Clinics Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              العيادات المتاحة
            </h2>

            {clinics && clinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clinics.map((clinic) => (
                  <Card 
                    key={clinic.id} 
                    className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-primary bg-background/80 backdrop-blur-sm rounded-2xl overflow-hidden"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-balance text-foreground">{clinic.name}</CardTitle>
                          {clinic.doctor_name && (
                            <CardDescription className="flex items-center gap-2 mt-2">
                              <User className="w-4 h-4 text-primary" />
                              <span className="text-foreground">{clinic.doctor_name}</span>
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="secondary" className="rounded-full px-3 py-1 bg-primary/10 text-primary border-primary/20">
                          متاح
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      {clinic.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">{clinic.description}</p>
                      )}

                      {clinic.working_hours && (
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">ساعات العمل:</span>
                          </div>
                          <p className="text-xs">{formatWorkingHours(clinic.working_hours)}</p>
                        </div>
                      )}

                      <Button asChild className="w-full rounded-lg py-5 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700">
                        <Link href={user ? `/book-appointment?center=${center.id}&clinic=${clinic.id}` : "/auth/login"} className="flex items-center justify-center">
                          <Calendar className="w-4 h-4 ml-2" />
                          احجز موعد
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">لا توجد عيادات متاحة حالياً في هذا المركز</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}