import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  try {
    // Check if we're in a build environment
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not set. Skipping middleware during build.')
      // Return NextResponse instead of plain Response
      return NextResponse.next()
    }
    
    return await updateSession(request)
  } catch (error) {
    console.error('Middleware error:', error)
    // Always return a NextResponse to avoid blank screen
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}