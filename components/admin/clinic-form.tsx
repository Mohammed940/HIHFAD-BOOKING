"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Save, Building2, Clock } from "lucide-react"

interface FixedTimeSlot {
  id: string
  day_of_week: number
  time_slot: string
  is_active: boolean
}

interface ClinicFormProps {
  initialData?: {
    id?: string
    name: string
    description?: string
    medical_center_id: string
    working_hours?: any
    use_fixed_time_slots?: boolean
    fixed_time_slots?: FixedTimeSlot[]
    is_active: boolean
  }
}

const DAYS = [
  { key: "sunday", name: "الأحد", index: 0 },
  { key: "monday", name: "الاثنين", index: 1 },
  { key: "tuesday", name: "الثلاثاء", index: 2 },
  { key: "wednesday", name: "الأربعاء", index: 3 },
  { key: "thursday", name: "الخميس", index: 4 },
  { key: "friday", name: "الجمعة", index: 5 },
  { key: "saturday", name: "السبت", index: 6 },
]

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
]

export function ClinicForm({ initialData }: ClinicFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(false)
  const [centers, setCenters] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    medical_center_id: initialData?.medical_center_id || "",
    is_active: initialData?.is_active ?? true,
    use_fixed_time_slots: initialData?.use_fixed_time_slots ?? false,
  })

  const [workingHours, setWorkingHours] = useState<any>(
    initialData?.working_hours ||
      DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day.key]: {
            is_open: false,
            start_time: "09:00",
            end_time: "17:00",
          },
        }),
        {},
      ),
  )

  const [fixedTimeSlots, setFixedTimeSlots] = useState<Array<{day: number, time: string}>>(
    initialData?.fixed_time_slots?.map(slot => ({
      day: slot.day_of_week,
      time: slot.time_slot
    })) || []
  )

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from("medical_centers")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

      if (error) throw error
      setCenters(data || [])
    } catch (error) {
      console.error("Error fetching centers:", error)
      toast.error("حدث خطأ في تحميل المراكز الطبية")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.medical_center_id) {
        toast.error("يرجى اختيار المركز الطبي")
        return
      }

      const clinicData = {
        ...formData,
        working_hours: formData.use_fixed_time_slots ? null : workingHours,
        updated_at: new Date().toISOString(),
      }

      let result: any
      if (initialData?.id) {
        // Update existing clinic
        result = await supabase.from("clinics").update(clinicData).eq("id", initialData.id)
      
        // Handle fixed time slots
        if (formData.use_fixed_time_slots) {
          // Delete existing fixed time slots for this clinic
          await supabase.from("fixed_time_slots").delete().eq("clinic_id", initialData.id)
        
          // Insert new fixed time slots
          if (fixedTimeSlots.length > 0) {
            const slotsToInsert = fixedTimeSlots.map(slot => ({
              clinic_id: initialData.id,
              day_of_week: slot.day,
              time_slot: slot.time,
              is_active: true,
            }))
          
            await supabase.from("fixed_time_slots").insert(slotsToInsert)
          }
        }
      } else {
        // Create new clinic
        const { data: insertData, error: insertError } = await supabase
          .from("clinics")
          .insert([{ ...clinicData, created_at: new Date().toISOString() }])
          .select()
      
        if (insertError) throw insertError
      
        // If using fixed time slots, insert them
        if (formData.use_fixed_time_slots && fixedTimeSlots.length > 0) {
          const newClinic = insertData && insertData.length > 0 ? insertData[0] : null
          const newClinicId = newClinic?.id
          if (newClinicId) {
            const slotsToInsert = fixedTimeSlots.map(slot => ({
              clinic_id: newClinicId,
              day_of_week: slot.day,
              time_slot: slot.time,
              is_active: true,
            }))
          
            await supabase.from("fixed_time_slots").insert(slotsToInsert)
          }
        }
      
        result = { data: insertData, error: insertError }
      }

      if (result.error) throw result.error

      toast.success(initialData?.id ? "تم تحديث العيادة بنجاح" : "تم إنشاء العيادة بنجاح")
      router.push("/admin/clinics")
      router.refresh()
    } catch (error) {
      console.error("Error saving clinic:", error)
      toast.error("حدث خطأ أثناء حفظ العيادة")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkingHoursChange = (day: string, field: string, value: string | boolean) => {
    setWorkingHours((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  // Function to add a fixed time slot
  const addFixedTimeSlot = (day: number, time: string) => {
    const newSlot = { day, time }
    setFixedTimeSlots(prev => [...prev, newSlot])
  }

  // Function to remove a fixed time slot
  const removeFixedTimeSlot = (index: number) => {
    setFixedTimeSlots(prev => prev.filter((_, i) => i !== index))
  }

  // Function to check if a time slot already exists
  const isTimeSlotExists = (day: number, time: string) => {
    return fixedTimeSlots.some(slot => slot.day === day && slot.time === time)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span>معلومات العيادة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clinic Name */}
          <div className="space-y-2">
            <Label htmlFor="name">اسم العيادة *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="مثال: عيادة القلب والأوعية الدموية"
              required
            />
          </div>

          {/* Medical Center */}
          <div className="space-y-2">
            <Label htmlFor="medical_center_id">المركز الطبي *</Label>
            <Select value={formData.medical_center_id} onValueChange={(value) => handleInputChange("medical_center_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المركز الطبي" />
              </SelectTrigger>
              <SelectContent>
                {centers.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">وصف العيادة</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="وصف مختصر عن العيادة والخدمات المقدمة"
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="is_active" className="text-base font-medium">
                العيادة نشطة
              </Label>
              <p className="text-sm text-gray-600">
                {formData.is_active ? "العيادة متاحة لحجز المواعيد" : "العيادة معطلة مؤقتاً"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking System */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>نظام الحجز</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
            <Switch
              id="use_fixed_time_slots"
              checked={formData.use_fixed_time_slots}
              onCheckedChange={(checked) => handleInputChange("use_fixed_time_slots", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="use_fixed_time_slots" className="text-base font-medium">
                استخدام أوقات محددة للحجز
              </Label>
              <p className="text-sm text-gray-600">
                عند التفعيل، يمكن تحديد أوقات محددة يمكن حجزها مرة واحدة فقط
              </p>
            </div>
          </div>

          {formData.use_fixed_time_slots && (
            <div className="space-y-4">
              <Label className="text-base font-medium">أوقات الحجز المحددة</Label>
              {DAYS.map((day) => (
                <div key={day.key} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">{day.name}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <Button
                        key={`${day.key}-${time}`}
                        type="button"
                        variant={isTimeSlotExists(day.index, time) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isTimeSlotExists(day.index, time)) {
                            const index = fixedTimeSlots.findIndex(slot => slot.day === day.index && slot.time === time)
                            if (index !== -1) removeFixedTimeSlot(index)
                          } else {
                            addFixedTimeSlot(day.index, time)
                          }
                        }}
                        className="bg-transparent"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              {fixedTimeSlots.length > 0 && (
                <div className="mt-4">
                  <Label className="text-base font-medium">الأوقات المحددة المختارة:</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {fixedTimeSlots.map((slot, index) => {
                      const day = DAYS.find(d => d.index === slot.day)
                      return (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="flex items-center gap-2 py-2 px-3 text-sm"
                        >
                          {day?.name} - {slot.time}
                          <button 
                            type="button"
                            onClick={() => removeFixedTimeSlot(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Working Hours */}
      {!formData.use_fixed_time_slots && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>ساعات العمل</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS.map((day) => (
              <div key={day.key} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                <div className="w-20">
                  <Switch
                    checked={workingHours[day.key]?.is_open || false}
                    onCheckedChange={(checked) => handleWorkingHoursChange(day.key, "is_open", checked)}
                  />
                </div>
                <div className="w-24 font-medium text-gray-700">{day.name}</div>
                {workingHours[day.key]?.is_open && (
                  <div className="flex items-center space-x-2 space-x-reverse flex-1">
                    <Select
                      value={workingHours[day.key]?.start_time || "09:00"}
                      onValueChange={(value) => handleWorkingHoursChange(day.key, "start_time", value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">إلى</span>
                    <Select
                      value={workingHours[day.key]?.end_time || "17:00"}
                      onValueChange={(value) => handleWorkingHoursChange(day.key, "end_time", value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex space-x-3 space-x-reverse">
        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
          {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          {initialData?.id ? "تحديث العيادة" : "إنشاء العيادة"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none">
          إلغاء
        </Button>
      </div>
    </form>
  )
}