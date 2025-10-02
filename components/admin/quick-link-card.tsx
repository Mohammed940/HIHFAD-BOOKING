"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface QuickLinkCardProps {
  href: string
  title: string
  icon: React.ReactNode
}

export function QuickLinkCard({ href, title, icon }: QuickLinkCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <Link href={href} className="flex items-center gap-2 text-primary hover:underline">
          {icon}
          {title}
        </Link>
      </CardContent>
    </Card>
  )
}