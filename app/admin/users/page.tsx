import { requireSuperAdmin } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Calendar, Shield } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { UserRoleButtons } from "@/components/admin/user-role-buttons"

export default async function AdminUsersPage() {
  await requireSuperAdmin()
  const supabase = await createClient()
  
  // جلب جميع المراكز الطبية
  const { data: centers, error: centersError } = await supabase
    .from("medical_centers")
    .select("id, name")
    .order("name")
    
  if (centersError) {
    console.error("Error fetching centers:", centersError)
  }

  // Fetch all users
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    
  if (usersError) {
    console.error("Error fetching users:", usersError)
  }

  // Get admin roles for all users
  let enrichedUsers: any[] = []
  if (users && users.length > 0) {
    // Get unique user IDs
    const userIds = users.map(user => user.id)
    
    // Fetch admin roles
    const { data: adminRoles, error: rolesError } = await supabase
      .from("admin_roles")
      .select("*")
      .in("user_id", userIds)
      
    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError)
    }
    
    // Create lookup map for admin roles
    const rolesMap: Record<string, any[]> = {}
    if (adminRoles) {
      adminRoles.forEach(role => {
        if (!rolesMap[role.user_id]) {
          rolesMap[role.user_id] = []
        }
        rolesMap[role.user_id].push(role)
      })
    }
    
    // Enrich users with admin roles
    enrichedUsers = users.map(user => ({
      ...user,
      admin_roles: rolesMap[user.id] || []
    }))
  }

  const getUserRoleBadge = (adminRoles: any[]) => {
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
        {enrichedUsers && enrichedUsers.length > 0 ? (
          enrichedUsers.map((user: any) => (
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
                      <span className="truncate">{user.email || "غير محدد"}</span>
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
                      {user.admin_roles.map((role: any, index: number) => (
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
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Mail className="w-4 h-4 ml-2" />
                    رسالة
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    تعديل
                  </Button>
                  {/* زر ترقية المستخدم */}
                  <UserRoleButtons 
                    userId={user.id}
                    centers={centers || []}
                    userRoles={user.admin_roles}
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
    </div>
  )
}