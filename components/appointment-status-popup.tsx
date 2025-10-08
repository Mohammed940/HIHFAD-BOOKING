'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface Appointment {
  id: string
  user_id: string
  medical_center_id: string
  clinic_id: string
  appointment_date: string
  appointment_time: string
  status: string
  notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
  medical_center?: {
    name: string
    address: string
  }
  clinic?: {
    name: string
    doctor_name: string
  }
}

interface AppointmentStatusPopupProps {
  appointments: Appointment[]
  onClose: () => void
}

export function AppointmentStatusPopup({ appointments, onClose }: AppointmentStatusPopupProps) {
  const [open, setOpen] = useState(true)
  
  // Get appointments with recent status changes (updated in the last 24 hours)
  const recentAppointments = appointments.filter(appointment => {
    const updatedAt = new Date(appointment.updated_at)
    const now = new Date()
    const diffHours = Math.abs(now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60)
    return diffHours <= 24
  })

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "approved":
        return "تمت الموافقة على موعدك"
      case "rejected":
        return "تم رفض موعدك"
      case "pending":
        return "تم تعليق موعدك"
      default:
        return "تم تحديث حالة موعدك"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "approved":
        return "يمكنك الآن الذهاب إلى الموعد في الوقت المحدد"
      case "rejected":
        return "يمكنك حجز موعد جديد إذا لزم الأمر"
      case "pending":
        return "سيتم مراجعة طلبك قريباً"
      default:
        return "يرجى مراجعة تفاصيل الموعد"
    }
  }

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  if (recentAppointments.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            تحديث حالة المواعيد
          </DialogTitle>
          <DialogDescription className="text-center">
            هناك تحديثات على مواعيدك الطبية
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {recentAppointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="border border-border rounded-lg p-4 bg-card"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {appointment.medical_center?.name}
                  </h3>
                  <p className="text-primary font-medium">
                    {appointment.clinic?.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(appointment.appointment_date), "dd MMMM yyyy", { locale: ar })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.appointment_time}</span>
                  </div>
                  {appointment.medical_center?.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{appointment.medical_center.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === "approved" 
                      ? "bg-green-100 text-green-800" 
                      : appointment.status === "rejected" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {getStatusMessage(appointment.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {getStatusDescription(appointment.status)}
                  </p>
                </div>
              </div>
              
              {appointment.admin_notes && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">ملاحظات الإدارة:</span> {appointment.admin_notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center pt-2">
          <Button onClick={handleClose} className="w-full max-w-xs">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}