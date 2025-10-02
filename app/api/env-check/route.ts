import { NextResponse } from 'next/server'

export async function GET() {
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl,
      hasSupabaseAnonKey,
      supabaseUrl: hasSupabaseUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : null,
      nodeEnv: process.env.NODE_ENV,
    }
  })
}