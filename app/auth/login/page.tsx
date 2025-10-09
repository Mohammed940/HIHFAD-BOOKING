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
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
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
                <CardTitle className="text-2xl font-bold text-foreground">تسجيل الدخول</CardTitle>
                <CardDescription className="text-base mt-2">أدخل بياناتك للوصول إلى حسابك</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleLogin} className="space-y-6">
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

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-base font-medium">كلمة المرور</Label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline font-medium">
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
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
                        جاري تسجيل الدخول...
                      </div>
                    ) : (
                      <>
                        تسجيل الدخول
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <span className="text-muted-foreground text-base">ليس لديك حساب؟ </span>
                  <Link href="/auth/register" className="text-primary hover:underline font-medium text-base">
                    إنشاء حساب جديد
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