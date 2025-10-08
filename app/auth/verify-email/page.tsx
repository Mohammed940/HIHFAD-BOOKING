import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div className="mx-auto w-28 h-28 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4 shadow-lg">
                <img 
                  src="/hihfad-logo.png" 
                  alt="HIHFAD Logo" 
                  className="w-full h-full object-contain animate-fade-in"
                />
              </div>
              <h1 className="text-3xl font-bold text-foreground mt-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                نظام المواعيد الطبية
              </h1>
              <p className="text-muted-foreground mt-2">HIHFAD</p>
            </div>
            
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">تحقق من بريدك الإلكتروني</CardTitle>
                <CardDescription className="text-base mt-2">تم إرسال رابط التفعيل إلى بريدك الإلكتروني</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6 pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 text-base text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>تم إنشاء حسابك بنجاح</span>
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    يرجى فتح بريدك الإلكتروني والنقر على رابط التفعيل لتأكيد حسابك. قد تحتاج للتحقق من مجلد الرسائل غير
                    المرغوب فيها.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button asChild className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/auth/login">العودة لتسجيل الدخول</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full py-6 text-lg font-bold rounded-xl bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
                    <Link href="/">العودة للرئيسية</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center">
              <Link href="/" className="text-muted-foreground hover:text-primary text-sm flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 ml-1" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}