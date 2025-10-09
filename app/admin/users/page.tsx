"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Calendar, Shield, Edit } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { UserRoleButtons } from "@/components/admin/user-role-buttons"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  created_at: string
  admin_roles?: AdminRole[]
}

interface AdminRole {
  id: string
  user_id: string
  role: string
  is_active: boolean
  medical_center_id?: string
}

interface MedicalCenter {
  id: string
  name: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [newRole, setNewRole] = useState<string>("")
  const [selectedCenterId, setSelectedCenterId] = useState<string>("")
  const supabase = createClient()
  
  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    
    try {
      // جلب جميع المراكز الطبية
      const { data: centersData, error: centersError } = await supabase
        .from("medical_centers")
        .select("id, name")
        .order("name")
        
      if (centersError) {
        console.error("Error fetching centers:", centersError)
        toast.error("حدث خطأ أثناء جلب المراكز")
      } else {
        setCenters(centersData || [])
      }

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        
      if (usersError) {
        console.error("Error fetching users:", usersError)
        toast.error("حدث خطأ أثناء جلب المستخدمين")
        setLoading(false)
        return
      }

      // Get admin roles for all users
      let enrichedUsers: UserProfile[] = []
      if (usersData && usersData.length > 0) {
        // Get unique user IDs
        const userIds = usersData.map((user: { id: string }) => user.id)
        
        // Fetch admin roles
        const { data: adminRoles, error: rolesError } = await supabase
          .from("admin_roles")
          .select("*")
          .in("user_id", userIds)
          
        if (rolesError) {
          console.error("Error fetching admin roles:", rolesError)
        }
        
        // Create lookup map for admin roles
        const rolesMap: Record<string, AdminRole[]> = {}
        if (adminRoles) {
          adminRoles.forEach((role: AdminRole) => {
            if (!rolesMap[role.user_id]) {
              rolesMap[role.user_id] = []
            }
            rolesMap[role.user_id].push(role)
          })
        }
        
        // Enrich users with admin roles (email will be fetched separately)
        enrichedUsers = usersData.map((user: any) => ({
          ...user,
          email: null, // We'll try to get this from a different approach
          admin_roles: rolesMap[user.id] || []
        }))
      }

      setUsers(enrichedUsers)
    } catch (error) {
      console.error("Error in fetchUsers:", error)
      toast.error("حدث خطأ غير متوقع")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const getUserRoleBadge = (adminRoles: AdminRole[] | undefined) => {
    if (!adminRoles || adminRoles.length === 0) {
      return <Badge variant="outline">مستخدم عادي</Badge>
    }

    const activeRoles = adminRoles.filter(role => role.is_active)
    if (activeRoles.length === 0) {
      return <Badge variant="secondary">لا توجد صلاحيات نشطة</Badge>
    }

    const superAdminRole = activeRoles.find(role => role.role === "super_admin")
    if (superAdminRole) {
      return <Badge className="bg-purple-100 text-purple-800">سوبر آدمن</Badge>
    }

    const centerAdminRoles = activeRoles.filter(role => role.role === "center_admin")
    if (centerAdminRoles.length > 0) {
      return <Badge className="bg-blue-100 text-blue-800">آدمن مركز</Badge>
    }

    return <Badge variant="outline">مستخدم عادي</Badge>
  }

  // Function to handle sending message to user
  const handleMessageUser = (userId: string, userName: string) => {
    // In a real implementation, this would open a messaging interface
    toast.info(`فتح واجهة المراسلة مع ${userName}`)
    console.log(`Send message to user ${userId} (${userName})`)
  }

  // Function to handle editing user roles
  const handleEditUserRoles = (user: UserProfile) => {
    setEditingUser(user)
    // Set default values based on existing roles
    if (user.admin_roles && user.admin_roles.length > 0) {
      const activeRole = user.admin_roles.find(role => role.is_active)
      if (activeRole) {
        setNewRole(activeRole.role)
        setSelectedCenterId(activeRole.medical_center_id || "")
      }
    }
  }

  // Function to save role changes
  const saveRoleChanges = async () => {
    if (!editingUser) return

    try {
      // If user has existing roles, update them
      if (editingUser.admin_roles && editingUser.admin_roles.length > 0) {
        // Update existing role
        const { error: updateError } = await supabase
          .from("admin_roles")
          .update({ 
            role: newRole, 
            is_active: true,
            medical_center_id: newRole === "center_admin" ? selectedCenterId : null
          })
          .eq("user_id", editingUser.id)
          
        if (updateError) throw updateError
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from("admin_roles")
          .insert({ 
            user_id: editingUser.id, 
            role: newRole, 
            is_active: true,
            medical_center_id: newRole === "center_admin" ? selectedCenterId : null
          })
          
        if (insertError) throw insertError
      }

      toast.success("تم تحديث صلاحيات المستخدم بنجاح")
      setEditingUser(null)
      fetchUsers() // Refresh the user list
    } catch (error) {
      console.error("Error updating user roles:", error)
      toast.error("حدث خطأ أثناء تحديث صلاحيات المستخدم")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة المستخدمين</h1>
            <p className="text-purple-100">عرض وإدارة جميع المستخدمين المسجلين في النظام</p>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users && users.length > 0 ? (
          users.map((user: UserProfile) => (
            <Card key={user.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2 space-x-reverse mb-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span>{user.full_name || "غير محدد"}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{user.email || user.id}</span>
                    </div>
                  </div>
                  {getUserRoleBadge(user.admin_roles)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Info */}
                <div className="space-y-3">
                  {user.phone && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{user.phone}</span>
                    </div>
                  )}

                  {user.date_of_birth && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {format(new Date(user.date_of_birth), "dd MMMM yyyy", { locale: ar })}
                      </span>
                    </div>
                  )}

                  {user.gender && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {user.gender === "male" ? "ذكر" : user.gender === "female" ? "أنثى" : "غير محدد"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Admin Roles */}
                {user.admin_roles && user.admin_roles.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700 mb-2">
                      <Shield className="w-4 h-4" />
                      <span>الصلاحيات</span>
                    </div>
                    <div className="space-y-1">
                      {user.admin_roles.map((role: AdminRole, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {role.role === "super_admin" 
                              ? "سوبر آدمن" 
                              : role.role === "center_admin" 
                                ? "آدمن مركز" 
                                : role.role}
                          </span>
                          <Badge 
                            variant={role.is_active ? "default" : "secondary"}
                            className={role.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {role.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse pt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 bg-transparent"
                    onClick={() => handleMessageUser(user.id, user.full_name || "المستخدم")}
                  >
                    <Mail className="w-4 h-4 ml-2" />
                    رسالة
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditUserRoles(user)}
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  {/* زر ترقية المستخدم */}
                  <UserRoleButtons 
                    userId={user.id}
                    centers={centers || []}
                    userRoles={user.admin_roles}
                    onRoleChange={fetchUsers}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مستخدمين</h3>
                <p className="text-gray-600 mb-4">لم يتم تسجيل أي مستخدمين بعد</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Role Editing Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل صلاحيات المستخدم</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{editingUser.full_name || "غير محدد"}</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">الصلاحية</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الصلاحية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">مستخدم عادي</SelectItem>
                    <SelectItem value="center_admin">آدمن مركز</SelectItem>
                    <SelectItem value="super_admin">سوبر آدمن</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newRole === "center_admin" && (
                <div className="space-y-2">
                  <Label htmlFor="center">المركز الطبي</Label>
                  <Select value={selectedCenterId} onValueChange={setSelectedCenterId}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المركز الطبي" />
                    </SelectTrigger>
                    <SelectContent>
                      {centers.map((center) => (
                        <SelectItem key={center.id} value={center.id}>{center.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex space-x-2 space-x-reverse pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setEditingUser(null)}
                >
                  إلغاء
                </Button>
                <Button 
                  className="flex-1"
                  onClick={saveRoleChanges}
                >
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}