"use client"

import { NewsActions } from "./news-actions"

interface NewsActionsWrapperProps {
  newsId: string
}

export function NewsActionsWrapper({ newsId }: NewsActionsWrapperProps) {
  const handleActionComplete = () => {
    window.location.reload()
  }

  return <NewsActions newsId={newsId} onActionComplete={handleActionComplete} />
}