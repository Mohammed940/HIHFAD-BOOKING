"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

interface ApproveAllAppointmentsButtonProps {
  centerId?: string // For center admins, to limit to their center
  onApproveAll?: () => void
}

export function ApproveAllAppointmentsButton({ 
  centerId,
  onApproveAll
}: ApproveAllAppointmentsButtonProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const approveAllPendingAppointments = async () => {
    if (!confirm("هل أنت متأكد من الموافقة على جميع المواعيد المعلقة؟")) return
    
    setLoading(true)
    try {
      // Build the query based on whether we're filtering by center
      let query = supabase
        .from("appointments")
        .update({ status: "approved" })
        .eq("status", "pending")
      
      // If centerId is provided, filter by that center
      if (centerId) {
        query = query.eq("medical_center_id", centerId)
      }
      
      const { error } = await query

      if (error) throw error

      toast.success("تم الموافقة على جميع المواعيد المعلقة")
      
      // Refresh the page or call the callback
      if (onApproveAll) {
        onApproveAll()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error approving all appointments:", error)
      toast.error("حدث خطأ أثناء الموافقة على جميع المواعيد")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="default" 
      className="bg-green-600 hover:bg-green-700 text-white"
      onClick={approveAllPendingAppointments}
      disabled={loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
      ) : (
        <CheckCircle className="w-4 h-4 ml-2" />
      )}
      الموافقة على الكل
    </Button>
  )
}