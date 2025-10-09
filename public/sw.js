// Service Worker for handling background notifications

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.')
  event.waitUntil(self.clients.claim())
})

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push event received:', event)
  
  let data = {}
  if (event.data) {
    data = event.data.json()
  }
  
  const title = data.title || 'تنبيه جديد'
  const options = {
    body: data.body || 'لديك تنبيه جديد من نظام الحجز',
    icon: data.icon || '/hihfad-logo.png',
    badge: data.badge || '/hihfad-logo.png',
    tag: data.tag || 'notification',
    dir: 'rtl',
    lang: 'ar'
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})