"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface UserRoleButtonsProps {
  userId: string
  centers?: { id: string; name: string }[]
  userRoles?: { role: string }[]
  onRoleChange?: () => void
}

export function UserRoleButtons({ 
  userId,
  centers,
  userRoles,
  onRoleChange
}: UserRoleButtonsProps) {
  const [loading, setLoading] = useState(false)
  const [selectedCenterId, setSelectedCenterId] = useState("")
  const supabase = createBrowserClient()

  const upgradeToSuperAdmin = async () => {
    setLoading(true)
    try {
      // Check if user already has a role
      const { data: existingRole, error: existingRoleError } = await supabase
        .from("admin_roles")
        .select("id, role, is_active")
        .eq("user_id", userId)
        .single()
        
      if (existingRoleError && existingRoleError.code !== "PGRST116") {
        throw existingRoleError
      }
      
      if (existingRole) {
        // Update existing role
        const { error: updateError } = await supabase
          .from("admin_roles")
          .update({ role: "super_admin", is_active: true })
          .eq("user_id", userId)
          
        if (updateError) throw updateError
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from("admin_roles")
          .insert({ user_id: userId, role: "super_admin", is_active: true })
          
        if (insertError) throw insertError
      }

      toast.success("تم ترقية المستخدم إلى سوبر آدمن")
      
      // Call the callback or refresh the page
      if (onRoleChange) {
        onRoleChange()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error upgrading to super admin:", error)
      toast.error("حدث خطأ أثناء ترقية المستخدم")
    } finally {
      setLoading(false)
    }
  }

  const upgradeToCenterAdmin = async () => {
    if (!selectedCenterId) {
      toast.error("يرجى اختيار مركز طبي")
      return
    }

    setLoading(true)
    try {
      // Check if user already has a role for this center
      const { data: existingRole, error: existingRoleError } = await supabase
        .from("admin_roles")
        .select("id, role, is_active")
        .eq("user_id", userId)
        .eq("medical_center_id", selectedCenterId)
        .single()
        
      if (existingRoleError && existingRoleError.code !== "PGRST116") {
        throw existingRoleError
      }
      
      if (existingRole) {
        // Update existing role
        const { error: updateError } = await supabase
          .from("admin_roles")
          .update({ role: "center_admin", is_active: true })
          .eq("user_id", userId)
          .eq("medical_center_id", selectedCenterId)
          
        if (updateError) throw updateError
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from("admin_roles")
          .insert({ 
            user_id: userId, 
            role: "center_admin", 
            medical_center_id: selectedCenterId, 
            is_active: true 
          })
          
        if (insertError) throw insertError
      }

      toast.success("تم ترقية المستخدم إلى آدمن مركز")
      
      // Call the callback or refresh the page
      if (onRoleChange) {
        onRoleChange()
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error upgrading to center admin:", error)
      toast.error("حدث خطأ أثناء ترقية المستخدم")
    } finally {
      setLoading(false)
    }
  }

  const isSuperAdmin = userRoles?.some((role: any) => role.role === "super_admin")
  const isCenterAdmin = userRoles?.some((role: any) => role.role === "center_admin")

  return (
    <div className="flex space-x-2 space-x-reverse">
      {!isSuperAdmin && (
        <Button
          size="sm"
          variant="default"
          className="flex-1 bg-purple-600 text-white"
          onClick={upgradeToSuperAdmin}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
          ) : null}
          ترقية إلى سوبر آدمن
        </Button>
      )}
      
      {centers && centers.length > 0 && !isCenterAdmin && (
        <div className="flex flex-col gap-2 flex-1">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
          >
            <option value="" disabled>اختر مركز طبي</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>{center.name}</option>
            ))}
          </select>
          <Button
            size="sm"
            variant="default"
            className="bg-blue-600 text-white"
            onClick={upgradeToCenterAdmin}
            disabled={loading || !selectedCenterId}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            ) : null}
            ترقية إلى آدمن مركز
          </Button>
        </div>
      )}
    </div>
  )
}