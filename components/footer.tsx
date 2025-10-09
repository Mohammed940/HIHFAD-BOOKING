"use client"

import Link from "next/link"
import { Calendar, Phone, Mail, MapPin, Heart, Shield, Clock, Users, Facebook, MessageCircle } from "lucide-react"
import { useState } from "react"

export function Footer({ user }: { user?: any }) {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Mock subscription functionality
      setIsSubscribed(true)
      setEmail("")
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }
  }

  return (
    <footer className="medical-footer">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-20 h-20 flex items-center justify-center transform transition-transform hover:scale-105">
                <img src="/hihfad-logo.png" alt="HIHFAD Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  HIHFAD
                </span>
                <p className="text-base text-muted-foreground">نظام المواعيد الطبية</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              نظام شامل لحجز المواعيد الطبية في أفضل المراكز والمستشفيات. نسعى لتقديم خدمة طبية متميزة ومريحة لجميع
              المرضى مع ضمان أعلى معايير الجودة والأمان.
            </p>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                <Heart className="w-5 h-5 text-red-500" />
                <span>رعاية صحية متميزة</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 animate-fade-in delay-300">
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2 space-x-reverse">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">روابط سريعة</span>
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 transform flex items-center group"
              >
                <span className="group-hover:text-primary group-hover:font-medium">الرئيسية</span>
              </Link>
              <Link
                href="/centers"
                className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 transform flex items-center group"
              >
                <span className="group-hover:text-primary group-hover:font-medium">المراكز الطبية</span>
              </Link>
              <Link
                href="/news"
                className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 transform flex items-center group"
              >
                <span className="group-hover:text-primary group-hover:font-medium">الأخبار والمقالات</span>
              </Link>
              {/* Show login/register links only when user prop is explicitly null or undefined */}
              {user === undefined || user === null ? (
                <>
                  <Link
                    href="/auth/register"
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 transform flex items-center group"
                  >
                    <span className="group-hover:text-primary group-hover:font-medium">إنشاء حساب جديد</span>
                  </Link>
                  <Link
                    href="/auth/login"
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 transform flex items-center group"
                  >
                    <span className="group-hover:text-primary group-hover:font-medium">تسجيل الدخول</span>
                  </Link>
                </>
              ) : null}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in delay-500">
            <h3 className="text-lg font-semibold text-foreground">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">معلومات الاتصال</span>
            </h3>
            <div className="space-y-5">
              <div className="flex items-center space-x-4 space-x-reverse group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 transform hover:scale-110">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">الهاتف</p>
                  <p className="text-sm text-muted-foreground">+352681126087</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 transform hover:scale-110">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">mohammed.sha3ban94@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 transform hover:scale-110">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">العنوان</p>
                  <p className="text-sm text-muted-foreground">ادلب، الجمهورية العربية السورية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6 animate-fade-in delay-1000">
            <h3 className="text-lg font-semibold text-foreground">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">اشترك في النشرة</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              اشترك في نشرتنا الإخبارية لتستلم أحدث الأخبار والنصائح الطبية
            </p>
            <div className="space-y-4">
              <form onSubmit={handleSubscribe}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      className="medical-input flex-1 px-4 py-2 text-sm rounded-l-lg rounded-r-none focus:z-10"
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-secondary to-green-600 hover:from-secondary/90 hover:to-green-700 text-secondary-foreground px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-300"
                    >
                      اشتراك
                    </button>
                  </div>
                </div>
              </form>
              {isSubscribed && (
                <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm text-center">
                  تم الاشتراك بنجاح! شكراً لاشتراكك في نشرتنا الإخبارية.
                </div>
              )}
              
              {/* Social Media */}
              <div className="pt-4">
                <p className="text-sm font-medium text-foreground mb-4">
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">تابعنا على وسائل التواصل</span>
                </p>
                <div className="flex space-x-4 space-x-reverse">
                  <Link 
                    href="https://www.facebook.com/share/173a9AwFGM/" 
                    target="_blank"
                    className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                  >
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="https://wa.me/00352681126087" 
                    target="_blank"
                    className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">© 2025 نظام المواعيد الطبية. جميع الحقوق محفوظة.</p>
            <div className="flex items-center space-x-6 space-x-reverse text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary transition-colors hover:underline hover:decoration-primary">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors hover:underline hover:decoration-primary">
                شروط الاستخدام
              </Link>
              <Link href="/support" className="hover:text-primary transition-colors hover:underline hover:decoration-primary">
                الدعم الفني
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}