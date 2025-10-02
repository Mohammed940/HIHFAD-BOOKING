import Link from "next/link"
import { Calendar, Phone, Mail, MapPin, Heart, Shield, Clock, Users, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-blue-50 border-t border-border dark:from-background dark:to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6 lg:col-span-2 animate-fade-in">
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
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-6 animate-fade-in delay-500">
            <h3 className="text-lg font-semibold text-foreground">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">خدماتنا المتميزة</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground group">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors">حجز المواعيد الطبية</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground group">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors">إدارة المواعيد الذكية</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground group">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors">حماية البيانات الطبية</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse text-sm text-muted-foreground group">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors">فريق طبي متخصص</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in delay-1000">
            <h3 className="text-lg font-semibold text-foreground">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">تواصل معنا</span>
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
              
              {/* Social Media */}
              <div className="pt-4">
                <p className="text-sm font-medium text-foreground mb-4">
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">تابعنا على وسائل التواصل</span>
                </p>
                <div className="flex space-x-4 space-x-reverse">
                  <Link href="#" className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg">
                    <Linkedin className="w-5 h-5" />
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