"use client"

import { useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function TestImageUpload() {
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const supabase = createBrowserClient()

  const testUpload = async () => {
    setUploadStatus("Testing upload...")
    
    try {
      // Create a simple test file
      const testFile = new File(["test content"], "test.txt", { type: "text/plain" })
      
      // Try to upload to 'public' bucket
      const { data, error } = await supabase.storage
        .from('public')
        .upload(`test-${Date.now()}.txt`, testFile)
      
      if (error) {
        setUploadStatus(`Upload failed: ${error.message}`)
        console.log("Upload error details:", error)
      } else {
        setUploadStatus(`Upload successful: ${JSON.stringify(data)}`)
      }
    } catch (error: any) {
      setUploadStatus(`Exception: ${error.message}`)
      console.error("Upload exception:", error)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h3 className="font-bold mb-2">Test Image Upload</h3>
      <Button onClick={testUpload} className="mb-2">Test Upload</Button>
      <p className="text-sm">{uploadStatus}</p>
    </div>
  )
}