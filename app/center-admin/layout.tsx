import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CenterAdminSidebar } from "@/components/admin/center-admin-sidebar"

export default async function CenterAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a center admin
  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("*, medical_centers(name)")
    .eq("user_id", user.id)
    .eq("role", "center_admin")
    .single()

  if (!adminRole) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <div className="flex">
        <CenterAdminSidebar centerName={adminRole.medical_centers?.name || ""} />
        <main className="flex-1 lg:mr-64">
          <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
        </main>
      </div>
    </div>
  )
}