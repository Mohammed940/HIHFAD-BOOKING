import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 flex items-center justify-center">
                <img 
                  src="/hihfad-logo.png" 
                  alt="HIHFAD Logo" 
                  className="w-full h-full object-contain animate-fade-in"
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground mt-4">نظام المواعيد الطبية</h1>
              <p className="text-muted-foreground">HIHFAD</p>
            </div>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">تحقق من بريدك الإلكتروني</CardTitle>
                <CardDescription>تم إرسال رابط التفعيل إلى بريدك الإلكتروني</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>تم إنشاء حسابك بنجاح</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    يرجى فتح بريدك الإلكتروني والنقر على رابط التفعيل لتأكيد حسابك. قد تحتاج للتحقق من مجلد الرسائل غير
                    المرغوب فيها.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full hover-lift">
                    <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent hover-lift">
                    <Link href="/">العودة للرئيسية</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}