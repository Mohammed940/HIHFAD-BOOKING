'use client'

import { useEffect } from 'react'
import { useNotifications } from '@/hooks/use-notifications'

interface NotificationHandlerProps {
  userId: string | null
}

export function NotificationHandler({ userId }: NotificationHandlerProps) {
  useNotifications(userId)
  
  return null
}