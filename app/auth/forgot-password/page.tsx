"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) return
    
    // Check if this is the mock client (during build time)
    if (!('auth' in supabase)) {
      setSuccess(true)
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
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
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">تم إرسال الرابط</CardTitle>
                  <CardDescription className="text-base mt-2">تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-0">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong className="text-foreground">{email}</strong>. يرجى فتح بريدك الإلكتروني واتباع
                    التعليمات.
                  </p>
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
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
                <CardTitle className="text-2xl font-bold text-foreground">نسيت كلمة المرور؟</CardTitle>
                <CardDescription className="text-base mt-2">أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-xl animate-shake">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <>
                        إرسال رابط إعادة التعيين
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <Link href="/auth/login" className="text-primary hover:underline font-medium text-base">
                    العودة لتسجيل الدخول
                  </Link>
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