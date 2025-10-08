"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AppointmentActionsProps {
  appointmentId: string
  currentStatus: string
  patientEmail?: string
  patientName?: string
}

export function AppointmentActions({
  appointmentId,
  currentStatus,
  patientEmail,
  patientName,
}: AppointmentActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  const updateAppointmentStatus = async (status: "approved" | "rejected") => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId)

      if (error) throw error

      // Create notification for the patient
      if (patientEmail) {
        await supabase.from("notifications").insert({
          user_email: patientEmail,
          title: status === "approved" ? "تم قبول موعدك" : "تم رفض موعدك",
          message:
            status === "approved"
              ? `تم قبول موعدك. يرجى الحضور في الوقت المحدد.`
              : `نعتذر، تم رفض موعدك. يمكنك حجز موعد آخر.`,
          type: status === "approved" ? "success" : "error",
        })
      }

      toast.success(status === "approved" ? "تم قبول الموعد بنجاح" : "تم رفض الموعد")

      router.refresh()
    } catch (error) {
      console.error("Error updating appointment:", error)
      toast.error("حدث خطأ أثناء تحديث الموعد")
    } finally {
      setLoading(false)
    }
  }

  if (currentStatus !== "pending") {
    return null
  }

  return (
    <div className="flex space-x-2 space-x-reverse">
      <Button
        onClick={() => updateAppointmentStatus("approved")}
        disabled={loading}
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <CheckCircle className="w-4 h-4 ml-2" />}
        قبول
      </Button>
      <Button onClick={() => updateAppointmentStatus("rejected")} disabled={loading} size="sm" variant="destructive">
        {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <XCircle className="w-4 h-4 ml-2" />}
        رفض
      </Button>
    </div>
  )
}
