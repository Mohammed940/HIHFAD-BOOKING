"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login")
      } else {
        setChecked(true)
      }
    }
  }, [user, loading, router])

  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mr-3">جاري التحقق من البيانات...</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}