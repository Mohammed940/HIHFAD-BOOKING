'use client'

import { toast } from 'sonner'

// Check if browser notifications are supported and request permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  return false
}

// Show browser notification
export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  const notification = new Notification(title, {
    icon: '/hihfad-logo.png',
    ...options
  })

  return notification
}

// Show toast notification
export const showToastNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  switch (type) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'warning':
      toast.warning(message)
      break
    default:
      toast.info(message)
  }
}

// Show appointment status change notification
export const showAppointmentStatusNotification = (
  status: string,
  centerName: string,
  appointmentDate: string,
  appointmentTime: string
) => {
  const statusMessages: Record<string, { title: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }> = {
    approved: {
      title: 'تمت الموافقة على موعدك',
      message: `تمت الموافقة على موعدك في ${centerName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}`,
      type: 'success'
    },
    rejected: {
      title: 'تم رفض موعدك',
      message: `تم رفض موعدك في ${centerName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}`,
      type: 'error'
    },
    pending: {
      title: 'تم تعليق موعدك',
      message: `تم تعليق موعدك في ${centerName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}`,
      type: 'warning'
    }
  }

  const notification = statusMessages[status] || {
    title: 'تحديث حالة الموعد',
    message: `تم تحديث حالة موعدك في ${centerName} بتاريخ ${appointmentDate} الساعة ${appointmentTime}`,
    type: 'info'
  }

  // Show toast notification
  showToastNotification(notification.message, notification.type)

  // Show browser notification if permission is granted
  showBrowserNotification(notification.title, {
    body: notification.message,
    tag: `appointment-${status}-${Date.now()}` // Prevent duplicate notifications
  })
}

// Show appointment reminder notification
export const showAppointmentReminder = (
  centerName: string,
  appointmentDate: string,
  appointmentTime: string
) => {
  const title = 'تذكير بالموعد الطبي'
  const message = `لديك موعد طبي في ${centerName} بتاريخ ${appointmentDate} الساعة ${appointmentTime} (بعد ساعتين)`

  // Show toast notification
  showToastNotification(message, 'info')

  // Show browser notification if permission is granted
  showBrowserNotification(title, {
    body: message,
    tag: `reminder-${Date.now()}` // Prevent duplicate notifications
  })
}

// Check if it's time to show a reminder (2 hours before appointment)
export const shouldShowReminder = (appointmentDate: string, appointmentTime: string): boolean => {
  try {
    // Parse appointment date and time
    const [year, month, day] = appointmentDate.split('-').map(Number)
    const [hours, minutes] = appointmentTime.split(':').map(Number)
    
    // Create appointment datetime
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes)
    
    // Calculate 2 hours before appointment
    const reminderTime = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000)
    
    // Current time
    const now = new Date()
    
    // Check if current time is within 5 minutes of reminder time
    const timeDiff = Math.abs(now.getTime() - reminderTime.getTime())
    return timeDiff <= 5 * 60 * 1000 && now >= reminderTime
  } catch (error) {
    console.error('Error calculating reminder time:', error)
    return false
  }
}

// Server-side function to send push notifications (for future implementation)
export const sendPushNotification = async (userId: string, title: string, body: string) => {
  // This would integrate with a push notification service in a real implementation
  console.log(`Sending push notification to user ${userId}: ${title} - ${body}`)
  
  // Example implementation with a push notification service:
  // const response = await fetch('https://api.push-service.com/notifications', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${PUSH_SERVICE_API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     userId,
  //     title,
  //     body,
  //     icon: '/hihfad-logo.png'
  //   })
  // })
  // 
  // return response.ok
  return true
}