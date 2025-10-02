'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          مرحباً بك في نظام المواعيد الطبية
        </h1>
        <p className="text-xl text-muted-foreground">
          نظام شامل لحجز المواعيد الطبية في أفضل المراكز والمستشفيات
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full">
            <Link href="/centers">
              احجز موعدك الآن
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
            <Link href="/auth/register">
              إنشاء حساب جديد
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}