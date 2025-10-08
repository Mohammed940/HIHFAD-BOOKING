'use client'

import { useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import {
  requestNotificationPermission,
  showAppointmentReminder,
  shouldShowReminder
} from '@/lib/notification-service'

// Define type for appointment
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
  }
}

export const useNotifications = (userId: string | null) => {
  const supabase = createBrowserClient()

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered with scope:', registration.scope)
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }, [])

  // Check for appointment reminders
  const checkAppointmentReminders = useCallback(async () => {
    if (!userId) return

    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          medical_center:medical_centers(name)
        `)
        .eq('user_id', userId)
        .eq('status', 'approved')
        .gte('appointment_date', new Date().toISOString().split('T')[0]) // Today or future

      if (error) {
        console.error('Error fetching appointments for reminders:', error)
        return
      }

      // Check each appointment for reminders
      appointments?.forEach((appointment: Appointment) => {
        if (shouldShowReminder(appointment.appointment_date, appointment.appointment_time)) {
          showAppointmentReminder(
            appointment.medical_center?.name || 'المركز الطبي',
            appointment.appointment_date,
            appointment.appointment_time
          )
        }
      })
    } catch (error) {
      console.error('Error checking appointment reminders:', error)
    }
  }, [supabase, userId])

  // Initialize notifications
  useEffect(() => {
    // Request notification permission
    requestNotificationPermission()
    
    // Register service worker
    registerServiceWorker()
    
    // Set up interval to check for reminders
    const reminderInterval = setInterval(checkAppointmentReminders, 60000) // Check every minute
    
    // Initial check
    checkAppointmentReminders()
    
    return () => {
      clearInterval(reminderInterval)
    }
  }, [registerServiceWorker, checkAppointmentReminders])

  return {
    requestNotificationPermission
  }
}