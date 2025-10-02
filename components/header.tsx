"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Calendar, LogOut, User } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

interface HeaderProps {
  user?: any
}

export function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Check if a link is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname?.startsWith(path)
  }

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse group">
            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
              <img src="/hihfad-logo.png" alt="HIHFAD Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-foreground">HIHFAD</span>
              <p className="text-sm text-muted-foreground">نظام المواعيد الطبية</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                isActive("/") 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              href="/centers"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                isActive("/centers") 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              المراكز الطبية
            </Link>
            <Link
              href="/news"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                isActive("/news") 
                  ? "text-primary bg-primary/10" 
                  : "text-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              الأخبار
            </Link>
            {user ? (
              <>
                <Link
                  href="/appointments"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                    isActive("/appointments") 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  مواعيدي
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 space-x-reverse ${
                    isActive("/profile") 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>الملف الشخصي</span>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="mr-2 hover:bg-destructive hover:text-destructive-foreground bg-transparent transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse mr-2">
                <Button asChild variant="ghost" size="sm" className="font-medium hover:bg-muted transition-colors">
                  <Link href="/auth/login">تسجيل الدخول</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Link href="/auth/register">إنشاء حساب</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background/95 backdrop-blur rounded-b-xl shadow-lg">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/") 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                href="/centers"
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/centers") 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                المراكز الطبية
              </Link>
              <Link
                href="/news"
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive("/news") 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                الأخبار
              </Link>
              {user ? (
                <>
                  <Link
                    href="/appointments"
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive("/appointments") 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    مواعيدي
                  </Link>
                  <Link
                    href="/profile"
                    className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 space-x-reverse ${
                      isActive("/profile") 
                        ? "text-primary bg-primary/10" 
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <div className="px-4 pt-2">
                    <Button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <LogOut className="w-4 h-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3 px-4 pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start font-medium hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/login">تسجيل الدخول</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/register">إنشاء حساب</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}