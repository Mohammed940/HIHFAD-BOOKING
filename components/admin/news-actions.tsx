"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface NewsActionsProps {
  newsId: string
  onActionComplete?: () => void
}

export function NewsActions({ newsId, onActionComplete }: NewsActionsProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const publishNews = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("news")
        .update({ is_published: true })
        .eq("id", newsId)

      if (error) throw error

      toast.success("تم نشر الخبر بنجاح")
      if (onActionComplete) onActionComplete()
    } catch (error) {
      console.error("Error publishing news:", error)
      toast.error("حدث خطأ أثناء نشر الخبر")
    } finally {
      setLoading(false)
    }
  }

  const unpublishNews = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("news")
        .update({ is_published: false })
        .eq("id", newsId)

      if (error) throw error

      toast.success("تم إلغاء نشر الخبر بنجاح")
      if (onActionComplete) onActionComplete()
    } catch (error) {
      console.error("Error unpublishing news:", error)
      toast.error("حدث خطأ أثناء إلغاء نشر الخبر")
    } finally {
      setLoading(false)
    }
  }

  const deleteNews = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الخبر نهائياً؟")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("news")
        .delete()
        .eq("id", newsId)

      if (error) throw error

      toast.success("تم حذف الخبر بنجاح")
      if (onActionComplete) onActionComplete()
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("حدث خطأ أثناء حذف الخبر")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button 
        size="sm" 
        variant="default" 
        className="bg-green-600 text-white" 
        onClick={publishNews}
        disabled={loading}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        نشر
      </Button>
      <Button 
        size="sm" 
        variant="default" 
        className="bg-gray-600 text-white" 
        onClick={unpublishNews}
        disabled={loading}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        إلغاء النشر
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-transparent" 
        onClick={deleteNews}
        disabled={loading}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
        ) : null}
        حذف نهائي
      </Button>
    </div>
  )
}