"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface AppointmentStatusButtonsProps {
  appointmentId: string
  onStatusChange?: () => void
}

export function AppointmentStatusButtons({ 
  appointmentId,
  onStatusChange
}: AppointmentStatusButtonsProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const updateStatus = async (status: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointmentId)

      if (error) throw error

      toast.success(`تم تحديث حالة الموعد إلى: ${getStatusLabel(status)}`)
      
      // Refresh the page or call the callback
      if (onStatusChange) {
        onStatusChange()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast.error("حدث خطأ أثناء تحديث حالة الموعد")
    } finally {
      setLoading(false)
    }
  }

  const deleteAppointment = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الموعد نهائياً؟")) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentId)

      if (error) throw error

      toast.success("تم حذف الموعد بنجاح")
      
      // Refresh the page or call the callback
      if (onStatusChange) {
        onStatusChange()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.error("حدث خطأ أثناء حذف الموعد")
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved": return "موافقة"
      case "rejected": return "رفض"
      case "pending": return "تعليق"
      default: return status
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button 
        size="sm" 
        variant="default" 
        className="bg-green-600 text-white"
        onClick={() => updateStatus("approved")}
        disabled={loading}
      >
        {loading && "approved" === getStatusLabel("approved") ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        موافقة
      </Button>
      <Button 
        size="sm" 
        variant="default" 
        className="bg-red-600 text-white"
        onClick={() => updateStatus("rejected")}
        disabled={loading}
      >
        {loading && "rejected" === getStatusLabel("rejected") ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        رفض
      </Button>
      <Button 
        size="sm" 
        variant="default" 
        className="bg-yellow-600 text-white"
        onClick={() => updateStatus("pending")}
        disabled={loading}
      >
        {loading && "pending" === getStatusLabel("pending") ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        تعليق
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-transparent mt-2"
        onClick={deleteAppointment}
        disabled={loading}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        حذف نهائي
      </Button>
    </div>
  )
}