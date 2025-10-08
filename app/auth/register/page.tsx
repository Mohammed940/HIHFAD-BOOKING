"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      })
      if (error) throw error
      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
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
                <CardTitle className="text-2xl font-bold text-foreground">إنشاء حساب جديد</CardTitle>
                <CardDescription className="text-base mt-2">أدخل بياناتك لإنشاء حساب جديد</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base font-medium">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="أدخل اسمك الكامل"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">رقم الهاتف (اختياري)</Label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+966 50 123 4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pr-12 py-6 text-base rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
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
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                        جاري إنشاء الحساب...
                      </div>
                    ) : (
                      <>
                        إنشاء حساب
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <span className="text-muted-foreground text-base">لديك حساب بالفعل؟ </span>
                  <Link href="/auth/login" className="text-primary hover:underline font-medium text-base">
                    تسجيل الدخول
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