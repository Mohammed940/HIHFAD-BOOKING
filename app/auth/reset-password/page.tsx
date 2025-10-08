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
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
      if (!supabase) return
      
      // Check if this is the mock client (during build time)
      if (!('auth' in supabase)) {
        setError("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية")
        return
      }
      
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        setError("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية")
      }
    }

    checkSession()
  }, [supabase])

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

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور")
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
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">تم تغيير كلمة المرور</CardTitle>
                  <CardDescription className="text-base mt-2">تم إعادة تعيين كلمة المرور بنجاح</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-0">
                  <p className="text-base text-muted-foreground">يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة</p>
                  <Button asChild className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/auth/login">تسجيل الدخول</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isValidSession && error) {
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
                  <CardTitle className="text-2xl font-bold text-foreground">رابط غير صالح</CardTitle>
                  <CardDescription className="text-base mt-2">رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-0">
                  <p className="text-base text-muted-foreground">يرجى طلب رابط جديد لإعادة تعيين كلمة المرور</p>
                  <div className="space-y-4">
                    <Button asChild className="w-full py-6 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      <Link href="/auth/forgot-password">طلب رابط جديد</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full py-6 text-lg font-bold rounded-xl bg-transparent border-2 border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
                      <Link href="/auth/login">تسجيل الدخول</Link>
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
                <CardTitle className="text-2xl font-bold text-foreground">إعادة تعيين كلمة المرور</CardTitle>
                <CardDescription className="text-base mt-2">أدخل كلمة المرور الجديدة</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base font-medium">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
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
                    disabled={isLoading || !isValidSession}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                        جاري التحديث...
                      </div>
                    ) : (
                      <>
                        تحديث كلمة المرور
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