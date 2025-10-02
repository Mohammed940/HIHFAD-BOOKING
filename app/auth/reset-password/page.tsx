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
import { Lock, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidSession, setIsValidSession] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have a valid session for password reset
    const checkSession = async () => {
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
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
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
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">تم تغيير كلمة المرور</CardTitle>
                  <CardDescription>تم إعادة تعيين كلمة المرور بنجاح</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة</p>
                  <Button asChild className="w-full hover-lift">
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
                  <CardTitle className="text-2xl">رابط غير صالح</CardTitle>
                  <CardDescription>رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">يرجى طلب رابط جديد لإعادة تعيين كلمة المرور</p>
                  <div className="space-y-2">
                    <Button asChild className="w-full hover-lift">
                      <Link href="/auth/forgot-password">طلب رابط جديد</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full bg-transparent hover-lift">
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
                <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
                <CardDescription>أدخل كلمة المرور الجديدة</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10 focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md animate-shake">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full hover-lift" disabled={isLoading || !isValidSession}>
                    {isLoading ? "جاري التحديث..." : (
                      <>
                        تحديث كلمة المرور
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}