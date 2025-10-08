'use client'

import { useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import {
  requestNotificationPermission,
  showAppointmentStatusNotification,
  showAppointmentReminder,
  shouldShowReminder
} from '@/lib/notification-service'

// Define types for the Supabase payload
interface SupabasePayload {
  new: {
    status: string
    medical_center?: {
      name: string
    }
    appointment_date: string
    appointment_time: string
  }
  old: {
    status: string
  }
}

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

  // Subscribe to appointment changes
  const subscribeToAppointmentChanges = useCallback(() => {
    if (!userId) return

    const channel = supabase
      .channel('appointment-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `user_id=eq.${userId}`
        },
        (payload: SupabasePayload) => { // Add type annotation here
          console.log('Appointment change received:', payload)
          
          const newAppointment = payload.new
          const oldAppointment = payload.old
          
          // Check if status changed
          if (newAppointment.status !== oldAppointment.status) {
            // Show notification for status change
            showAppointmentStatusNotification(
              newAppointment.status,
              newAppointment.medical_center?.name || 'المركز الطبي',
              newAppointment.appointment_date,
              newAppointment.appointment_time
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

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
      appointments?.forEach((appointment: Appointment) => { // Add type annotation here
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
    
    // Subscribe to appointment changes
    const unsubscribe = subscribeToAppointmentChanges()
    
    // Set up interval to check for reminders
    const reminderInterval = setInterval(checkAppointmentReminders, 60000) // Check every minute
    
    // Initial check
    checkAppointmentReminders()
    
    return () => {
      if (unsubscribe) unsubscribe()
      clearInterval(reminderInterval)
    }
  }, [registerServiceWorker, subscribeToAppointmentChanges, checkAppointmentReminders])

  return {
    requestNotificationPermission
  }
}