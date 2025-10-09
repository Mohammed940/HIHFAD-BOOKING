'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, FileText } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CancelAppointmentButton } from "@/components/cancel-appointment-button"
import { showAppointmentStatusNotification } from '@/lib/notification-service'
import { AppointmentStatusPopup } from '@/components/appointment-status-popup'

// Define the type for appointment data
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

// Define the type for Supabase payload
interface SupabasePayload {
  new: Appointment
  old: Appointment
}

interface AppointmentsListProps {
  initialAppointments: Appointment[]
  userId: string
}

export function AppointmentsList({ initialAppointments, userId }: AppointmentsListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [showPopup, setShowPopup] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    // Subscribe to real-time appointment changes
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${userId}`
        },
        (payload: SupabasePayload) => {
          console.log('Appointment updated:', payload)
          
          const updatedAppointment = payload.new
          const oldAppointment = payload.old
          
          // Update the appointment in the state
          setAppointments(prev => 
            prev.map(app => 
              app.id === updatedAppointment.id ? updatedAppointment : app
            )
          )
          
          // Show notification if status changed
          if (updatedAppointment.status !== oldAppointment.status) {
            showAppointmentStatusNotification(
              updatedAppointment.status,
              updatedAppointment.medical_center?.name || 'المركز الطبي',
              updatedAppointment.appointment_date,
              updatedAppointment.appointment_time
            )
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">في الانتظار</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">مؤكد</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">مرفوض</Badge>
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">{status}</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "border-t-4 border-yellow-500"
      case "approved":
        return "border-t-4 border-green-500"
      case "rejected":
        return "border-t-4 border-red-500"
      default:
        return "border-t-4 border-gray-300"
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  return (
    <>
      {/* Show popup for recent appointment status changes */}
      {showPopup && (
        <AppointmentStatusPopup 
          appointments={appointments} 
          onClose={handleClosePopup} 
        />
      )}
      
      <div className="space-y-6">
        {appointments && appointments.length > 0 ? (
          appointments
            // Filter out cancelled appointments
            .filter(appointment => appointment.status !== "cancelled")
            // Sort by date and time (newest first)
            .sort((a, b) => {
              // Sort by date descending
              if (a.appointment_date !== b.appointment_date) {
                return b.appointment_date.localeCompare(a.appointment_date)
              }
              // If dates are equal, sort by time descending
              return b.appointment_time.localeCompare(a.appointment_time)
            })
            .map((appointment) => (
              <Card 
                key={appointment.id} 
                className={`medical-card hover-lift ${getStatusColor(appointment.status)}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-foreground">{appointment.medical_center?.name}</CardTitle>
                      <CardDescription className="text-base text-primary font-medium">{appointment.clinic?.name}</CardDescription>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <span className="text-sm text-muted-foreground">التاريخ:</span>
                          <span className="font-medium text-foreground mr-2">
                            {format(new Date(appointment.appointment_date), "dd MMMM yyyy", { locale: ar })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <div>
                          <span className="text-sm text-muted-foreground">الوقت:</span>
                          <span className="font-medium text-foreground mr-2">{appointment.appointment_time}</span>
                        </div>
                      </div>
                      {appointment.clinic?.doctor_name && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <span className="text-sm text-muted-foreground">الطبيب:</span>
                            <span className="font-medium text-foreground mr-2">{appointment.clinic.doctor_name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-muted-foreground block">العنوان:</span>
                          <span className="text-sm text-foreground">{appointment.medical_center?.address}</span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm text-muted-foreground block">ملاحظات:</span>
                            <span className="text-sm text-foreground">{appointment.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {appointment.admin_notes && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-primary">ملاحظات الإدارة:</span>
                      </div>
                      <span className="text-sm text-foreground">{appointment.admin_notes}</span>
                    </div>
                  )}

                  {appointment.status === "pending" && (
                    <div className="flex gap-3 pt-4">
                      <CancelAppointmentButton appointmentId={appointment.id} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">لا توجد مواعيد</h3>
            <p className="text-muted-foreground mb-6">لم تقم بحجز أي مواعيد بعد</p>
          </div>
        )}
      </div>
    </>
  )
}