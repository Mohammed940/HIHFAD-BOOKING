"use client"

import { useState } from "react"

interface NewsImageHandlerProps {
  src: string | null
  alt: string
  className?: string
}

export function NewsImageHandler({ src, alt, className }: NewsImageHandlerProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return null
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}