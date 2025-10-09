import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { format } from 'date-fns'

// Define the appointment type
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
  profiles?: {
    full_name: string
  }
}

// This API route is for checking appointment reminders
// In a production environment, this would be called by a cron job or scheduled task

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current time
    const now = new Date()
    
    // Calculate the time 2 hours from now
    const reminderTime = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    
    // Format the date for querying
    const reminderDate = format(reminderTime, 'yyyy-MM-dd')
    const reminderHour = reminderTime.getHours()
    const reminderMinute = reminderTime.getMinutes()
    
    // Format time as HH:MM
    const reminderTimeString = `${reminderHour.toString().padStart(2, '0')}:${reminderMinute.toString().padStart(2, '0')}`
    
    console.log(`Checking for appointments on ${reminderDate} at ${reminderTimeString}`)
    
    // Find appointments that are happening in 2 hours
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        *,
        medical_center:medical_centers(name),
        profiles:user_id(full_name)
      `)
      .eq('status', 'approved')
      .eq('appointment_date', reminderDate)
      .eq('appointment_time', reminderTimeString)

    if (error) {
      console.error('Error fetching appointments:', error)
      return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 })
    }

    // In a real implementation, we would send notifications here
    // For now, we'll just log the appointments that need reminders
    console.log(`Found ${appointments?.length || 0} appointments needing reminders`)
    
    if (appointments && appointments.length > 0) {
      appointments.forEach((appointment: Appointment) => {
        console.log(`Reminder needed for appointment ${appointment.id} for user ${appointment.profiles?.full_name}`)
        // In a real implementation, we would send push notifications or emails here
      })
    }

    return NextResponse.json({ 
      success: true, 
      remindersSent: appointments?.length || 0,
      appointments: appointments || []
    })
  } catch (error) {
    console.error('Error in appointment reminders API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}