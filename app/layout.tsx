import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import ErrorBoundary from "@/components/error-boundary"
import { AuthProvider } from "@/hooks/use-auth"
import { FloatingChatbot } from "@/components/floating-chatbot"
import "./globals.css"

export const metadata: Metadata = {
  title: "HIHFAD - نظام المواعيد الطبية",
  description: "نظام شامل لحجز المواعيد الطبية في المراكز والمستشفيات",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/hihfad-logo-large.png", sizes: "32x32", type: "image/png" },
      { url: "/hihfad-logo-large.png", sizes: "48x48", type: "image/png" },
      { url: "/hihfad-logo-large.png", sizes: "96x96", type: "image/png" },
      { url: "/hihfad-logo-large.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [
      { url: "/hihfad-logo-large.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "mask-icon", url: "/hihfad-logo-large.png" }
    ]
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={null}>{children}</Suspense>
            <FloatingChatbot />
            <Toaster />
            <Analytics />
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}