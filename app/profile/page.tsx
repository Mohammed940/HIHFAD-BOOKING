"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, Calendar, MapPin, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import ProtectedRoute from "@/components/protected-route"

interface Profile {
  id: string
  full_name: string
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  address: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      setSupabase(createClient())
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchProfile(user.id)
    }
  }, [user])

  const fetchProfile = async (userId: string) => {
    if (!supabase) {
      setIsLoading(false)
      return
    }
    
    // Check if this is the mock client (during build time)
    if (!('from' in supabase) || typeof supabase.from !== 'function') {
      setIsLoading(false)
      return
    }
    
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setProfile(data)
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: userId,
          full_name: user?.user_metadata?.full_name || "",
          phone: user?.user_metadata?.phone || null,
          date_of_birth: null,
          gender: null,
          address: null,
        }
        setProfile(newProfile)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      [field]: value || null,
    })
  }

  const handleSave = async () => {
    if (!profile || !user || !supabase) return

    // Check if this is the mock client (during build time)
    if (!('from' in supabase) || typeof supabase.from !== 'function') {
      return
    }

    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        address: profile.address,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle loading states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center">جاري التحميل...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header user={user} />

        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">الملف الشخصي</h1>
                <p className="text-xl text-muted-foreground">إدارة معلوماتك الشخصية</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    المعلومات الشخصية
                  </CardTitle>
                  <CardDescription>قم بتحديث معلوماتك الشخصية لتحسين تجربة الحجز</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={profile?.full_name || ""}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" value={user?.email || ""} disabled className="pr-10 bg-muted" />
                    </div>
                    <p className="text-xs text-muted-foreground">لا يمكن تغيير البريد الإلكتروني</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile?.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+966 50 123 4567"
                        className="pr-10"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile?.date_of_birth || ""}
                        onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">الجنس</Label>
                    <Select value={profile?.gender || ""} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجنس" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        value={profile?.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="أدخل عنوانك الكامل"
                        rows={3}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  {/* Messages */}
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-green-800 bg-green-100 border border-green-200 rounded-md">
                      تم حفظ المعلومات بنجاح!
                    </div>
                  )}

                  {/* Save Button */}
                  <Button onClick={handleSave} disabled={isSaving || !profile?.full_name} className="w-full">
                    <Save className="w-4 h-4 ml-2" />
                    {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}