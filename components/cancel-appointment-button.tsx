"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface CancelAppointmentButtonProps {
  appointmentId: string
}

export function CancelAppointmentButton({ appointmentId }: CancelAppointmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)
        .eq("status", "pending") // Only allow cancelling pending appointments

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent border-primary/30 text-primary hover:bg-primary/10 rounded-lg hover:shadow-md transition-all duration-300">
          <X className="w-4 h-4 ml-2" />
          إلغاء الموعد
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">إلغاء الموعد</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg border-primary/30 hover:bg-primary/10">تراجع</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancel} 
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isLoading ? "جاري الإلغاء..." : "نعم، إلغاء الموعد"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}