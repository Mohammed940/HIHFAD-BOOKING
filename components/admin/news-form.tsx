"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, Save, Eye, Upload, X } from "lucide-react"

interface NewsFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    summary?: string
    is_published: boolean
    image_url?: string
  }
}

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    summary: initialData?.summary || "",
    is_published: initialData?.is_published || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user for created_by field
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error("يجب تسجيل الدخول لإنشاء الأخبار")
      }

      // Handle file upload if a file is selected
      let imageUrl = initialData?.image_url || null
      if (selectedFile) {
        toast.info("جارٍ رفع الصورة...")
        
        // Convert image to Base64 and store it directly in the database
        try {
          const base64String = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.onerror = (error) => reject(error)
            reader.readAsDataURL(selectedFile)
          })
          
          // Store the Base64 image data directly
          imageUrl = base64String
          toast.success("تم تحويل الصورة إلى Base64")
        } catch (conversionError: any) {
          console.error("Image conversion error:", conversionError)
          toast.error("فشل تحويل الصورة: " + (conversionError.message || ""))
        }
      }

      const newsData: any = {
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        is_published: formData.is_published,
        created_by: user.id, // Required field
        updated_at: new Date().toISOString(),
      }

      // Only add image_url if we have one
      if (imageUrl) {
        newsData.image_url = imageUrl
      }

      // Add published_at if publishing
      if (formData.is_published) {
        newsData.published_at = new Date().toISOString()
      }

      let result
      if (initialData?.id) {
        // Update existing news
        result = await supabase.from("news").update(newsData).eq("id", initialData.id)
      } else {
        // Create new news with created_at
        result = await supabase
          .from("news")
          .insert([{ 
            ...newsData, 
            created_at: new Date().toISOString() 
          }])
      }

      if (result.error) throw result.error

      toast.success(initialData?.id ? "تم تحديث الخبر بنجاح" : "تم إنشاء الخبر بنجاح")
      router.push("/admin/news")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving news:", error)
      toast.error("حدث خطأ أثناء حفظ الخبر: " + (error.message || ""))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setImagePreview(null)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setSelectedFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Eye className="w-5 h-5 text-green-600" />
            <span>تفاصيل الخبر</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الخبر *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="أدخل عنوان الخبر"
              required
              className="text-lg"
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">الملخص</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="ملخص مختصر للخبر"
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">محتوى الخبر *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="اكتب محتوى الخبر كاملاً"
              required
              rows={10}
              className="min-h-[200px]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>صورة الخبر</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="space-y-3">
              {!imagePreview ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة</span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="معاينة الصورة"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 left-2 rounded-full p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>تغيير الصورة</span>
                  </Button>
                </div>
              )}
              <p className="text-sm text-gray-500">الحد الأقصى للحجم: 5MB</p>
            </div>
          </div>

          {/* Publish Status */}
          <div className="flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => handleInputChange("is_published", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="is_published" className="text-base font-medium">
                نشر الخبر
              </Label>
              <p className="text-sm text-gray-600">
                {formData.is_published ? "سيتم نشر الخبر على الموقع فوراً" : "سيتم حفظ الخبر كمسودة"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-3 space-x-reverse">
        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
          {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
          {initialData?.id ? "تحديث الخبر" : "إنشاء الخبر"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 sm:flex-none">
          إلغاء
        </Button>
      </div>
    </form>
  )
}