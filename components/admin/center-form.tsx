"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CenterFormProps {
  center?: {
    id: string
    name: string
    description: string | null
    address: string
    phone: string | null
    email: string | null
    working_hours: any
    is_active: boolean
  }
}

export function CenterForm({ center }: CenterFormProps) {
  const [formData, setFormData] = useState({
    name: center?.name || "",
    description: center?.description || "",
    address: center?.address || "",
    phone: center?.phone || "",
    email: center?.email || "",
    is_active: center?.is_active ?? true,
    working_hours: center?.working_hours || {
      saturday: { start: "08:00", end: "22:00" },
      sunday: { start: "08:00", end: "22:00" },
      monday: { start: "08:00", end: "22:00" },
      tuesday: { start: "08:00", end: "22:00" },
      wednesday: { start: "08:00", end: "22:00" },
      thursday: { start: "08:00", end: "22:00" },
      friday: { closed: true },
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!center

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const centerData = {
        name: formData.name,
        description: formData.description || null,
        address: formData.address,
        phone: formData.phone || null,
        email: formData.email || null,
        working_hours: formData.working_hours,
        is_active: formData.is_active,
      }

      if (isEditing) {
        const { error } = await supabase.from("medical_centers").update(centerData).eq("id", center.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("medical_centers").insert(centerData)
        if (error) throw error
      }

      router.push("/admin/centers")
      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const days = [
    { key: "saturday", name: "السبت" },
    { key: "sunday", name: "الأحد" },
    { key: "monday", name: "الاثنين" },
    { key: "tuesday", name: "الثلاثاء" },
    { key: "wednesday", name: "الأربعاء" },
    { key: "thursday", name: "الخميس" },
    { key: "friday", name: "الجمعة" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm" className="bg-transparent">
          <Link href="/admin/centers">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للمراكز
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              المعلومات الأساسية
            </CardTitle>
            <CardDescription>أدخل المعلومات الأساسية للمركز الطبي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المركز *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="مستشفى الملك فهد"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+966 11 234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="info@hospital.sa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="الرياض، حي الملز، شارع الملك فهد"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="وصف المركز الطبي وخدماته..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="is_active">المركز نشط</Label>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>ساعات العمل</CardTitle>
            <CardDescription>حدد ساعات عمل المركز لكل يوم من أيام الأسبوع</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {days.map((day) => (
              <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-20">
                  <Label className="font-medium">{day.name}</Label>
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      checked={!formData.working_hours[day.key]?.closed}
                      onCheckedChange={(checked) => handleWorkingHoursChange(day.key, "closed", !checked)}
                    />
                    <Label className="text-sm">مفتوح</Label>
                  </div>
                  {!formData.working_hours[day.key]?.closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">من:</Label>
                        <Input
                          type="time"
                          value={formData.working_hours[day.key]?.start || "08:00"}
                          onChange={(e) => handleWorkingHoursChange(day.key, "start", e.target.value)}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">إلى:</Label>
                        <Input
                          type="time"
                          value={formData.working_hours[day.key]?.end || "22:00"}
                          onChange={(e) => handleWorkingHoursChange(day.key, "end", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            <Save className="w-4 h-4 ml-2" />
            {isLoading ? "جاري الحفظ..." : isEditing ? "تحديث المركز" : "إضافة المركز"}
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/admin/centers">إلغاء</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
