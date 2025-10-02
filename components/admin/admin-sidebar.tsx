"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  Building2,
  Stethoscope,
  Calendar,
  Users,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const menuItems = [
  { href: "/admin", label: "الرئيسية", icon: Home },
  { href: "/admin/centers", label: "المراكز الطبية", icon: Building2 },
  { href: "/admin/clinics", label: "العيادات", icon: Stethoscope },
  { href: "/admin/appointments", label: "المواعيد", icon: Calendar },
  { href: "/admin/users", label: "المستخدمين", icon: Users },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
]

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }

    // Close menu on route change
    handleRouteChange()
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-background border-l border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">لوحة الإدارة</h2>
                <p className="text-sm text-muted-foreground">الإدارة العامة</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-start gap-3"
                      asChild
                    >
                      <Link href={item.href}>
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="sm">
              <Link href="/">
                <Home className="w-4 h-4 ml-2" />
                العودة للموقع
              </Link>
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full justify-start bg-transparent" size="sm">
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}