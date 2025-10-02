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
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">تم إرسال الرابط</CardTitle>
                  <CardDescription>تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>. يرجى فتح بريدك الإلكتروني واتباع
                    التعليمات.
                  </p>
                  <div className="space-y-2">
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
                <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
                <CardDescription>أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-shake">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full hover-lift" disabled={isLoading}>
                    {isLoading ? "جاري الإرسال..." : (
                      <>
                        إرسال رابط إعادة التعيين
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    العودة لتسجيل الدخول
                  </Link>
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