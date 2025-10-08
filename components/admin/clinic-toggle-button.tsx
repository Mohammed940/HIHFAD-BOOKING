"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ClinicToggleButtonProps {
  clinicId: string
  isActive: boolean
  onToggle?: () => void
}

export function ClinicToggleButton({ 
  clinicId,
  isActive,
  onToggle
}: ClinicToggleButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const toggleClinicStatus = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("clinics")
        .update({ is_active: !isActive })
        .eq("id", clinicId)

      if (error) throw error

      toast.success(isActive ? "تم تعطيل العيادة" : "تم تفعيل العيادة")
      
      // Call the callback or refresh the page
      if (onToggle) {
        onToggle()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error toggling clinic status:", error)
      toast.error("حدث خطأ أثناء تغيير حالة العيادة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant={isActive ? "secondary" : "default"}
      className={isActive ? "bg-red-600 text-white" : "bg-green-600 text-white"}
      onClick={toggleClinicStatus}
      disabled={loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
      ) : null}
      {isActive ? "تعطيل" : "تفعيل"}
    </Button>
  )
}