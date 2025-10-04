import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User } from "@supabase/supabase-js"

export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return { user: user as User, supabase }
}

export async function optionalAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user: user as User | null, supabase }
}

export async function requireAdmin() {
  const { user, supabase } = await requireAuth()

  // Get all admin roles for the user (instead of single)
  const { data: adminRoles, error } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("is_active", true)

  // Debugging: Log the error if there is one
  if (error) {
    console.log("Admin role query error:", error.message)
  }

  // Check if we have any roles
  if (!adminRoles || adminRoles.length === 0) {
    redirect("/")
  }

  // Find the first super_admin role if it exists
  const superAdminRole = adminRoles.find((role: any) => role.role === "super_admin")
  
  if (superAdminRole) {
    return { user, role: superAdminRole.role }
  }
  
  // If no super_admin, return the first role
  return { user, role: adminRoles[0].role }
}

export async function requireSuperAdmin() {
  const { user, role } = await requireAdmin()

  if (role !== "super_admin") {
    redirect("/")
  }

  return user
}

export async function getUserRole(userId: string) {
  const supabase = await createClient()

  const { data: adminRole } = await supabase
    .from("admin_roles")
    .select("role, medical_center_id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single()

  return adminRole
}