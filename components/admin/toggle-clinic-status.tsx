"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Power, PowerOff, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ToggleClinicStatusProps {
  clinicId: string
  currentStatus: boolean
}

export function ToggleClinicStatus({ clinicId, currentStatus }: ToggleClinicStatusProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const toggleStatus = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("clinics")
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clinicId)

      if (error) throw error

      toast.success(currentStatus ? "تم تعطيل العيادة بنجاح" : "تم تفعيل العيادة بنجاح")

      router.refresh()
    } catch (error) {
      console.error("Error toggling clinic status:", error)
      toast.error("حدث خطأ أثناء تحديث حالة العيادة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={toggleStatus}
      disabled={loading}
      size="sm"
      variant={currentStatus ? "destructive" : "default"}
      className={currentStatus ? "" : "bg-green-600 hover:bg-green-700"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin ml-2" />
      ) : currentStatus ? (
        <PowerOff className="w-4 h-4 ml-2" />
      ) : (
        <Power className="w-4 h-4 ml-2" />
      )}
      {currentStatus ? "تعطيل" : "تفعيل"}
    </Button>
  )
}
