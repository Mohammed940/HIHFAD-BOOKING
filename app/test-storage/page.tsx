"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Bucket {
  name: string;
  public: boolean;
}

export default function TestStoragePage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [supabase, setSupabase] = useState<ReturnType<typeof createBrowserClient> | null>(null)

  useEffect(() => {
    // Initialize Supabase client only on the client side
    if (typeof window !== 'undefined') {
      setSupabase(createBrowserClient())
    }
  }, [])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message])
    console.log(message)
  }

  const testStorage = async () => {
    if (!supabase) {
      addResult("Supabase client not initialized")
      return
    }

    // Check if this is the mock client (during build time)
    if (!('storage' in supabase)) {
      addResult("❌ Supabase client is mocked (build time). Storage tests cannot run.")
      return
    }

    setIsLoading(true)
    setTestResults([])
    
    try {
      addResult("Starting storage tests...")
      
      // Test 1: List available buckets
      addResult("Test 1: Listing available buckets...")
      try {
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
        if (bucketsError) {
          addResult(`❌ Bucket listing failed: ${bucketsError.message}`)
        } else {
          addResult(`✅ Buckets found: ${buckets.length}`)
          buckets.forEach((bucket: Bucket) => {
            addResult(`  - ${bucket.name} (public: ${bucket.public})`)
          })
        }
      } catch (error: any) {
        addResult(`❌ Bucket listing exception: ${error.message}`)
      }
      
      // Test 2: Try to create a test file in memory
      addResult("Test 2: Creating test file...")
      const testContent = "This is a test file for storage testing"
      const testFile = new File([testContent], "test-file.txt", { type: "text/plain" })
      addResult(`✅ Test file created: ${testFile.name} (${testFile.size} bytes)`)
      
      // Test 3: Try to upload to 'public' bucket
      addResult("Test 3: Uploading to 'public' bucket...")
      try {
        const fileName = `test-${Date.now()}.txt`
        const { data, error } = await supabase.storage
          .from('public')
          .upload(fileName, testFile, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          addResult(`❌ Public bucket upload failed: ${error.message}`)
        } else {
          addResult(`✅ Public bucket upload successful: ${JSON.stringify(data)}`)
          
          // Try to get the public URL
          try {
            const { data: { publicUrl } } = supabase.storage
              .from('public')
              .getPublicUrl(fileName)
            addResult(`✅ Public URL: ${publicUrl}`)
          } catch (urlError: any) {
            addResult(`❌ Failed to get public URL: ${urlError.message}`)
          }
        }
      } catch (error: any) {
        addResult(`❌ Public bucket upload exception: ${error.message}`)
      }
      
      // Test 4: Try to upload to 'news-images' bucket
      addResult("Test 4: Uploading to 'news-images' bucket...")
      try {
        const fileName = `test-${Date.now()}.txt`
        const { data, error } = await supabase.storage
          .from('news-images')
          .upload(fileName, testFile, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          addResult(`❌ News-images bucket upload failed: ${error.message}`)
        } else {
          addResult(`✅ News-images bucket upload successful: ${JSON.stringify(data)}`)
          
          // Try to get the public URL
          try {
            const { data: { publicUrl } } = supabase.storage
              .from('news-images')
              .getPublicUrl(fileName)
            addResult(`✅ Public URL: ${publicUrl}`)
          } catch (urlError: any) {
            addResult(`❌ Failed to get public URL: ${urlError.message}`)
          }
        }
      } catch (error: any) {
        addResult(`❌ News-images bucket upload exception: ${error.message}`)
      }
      
    } catch (error: any) {
      addResult(`❌ General error: ${error.message}`)
    } finally {
      setIsLoading(false)
      addResult("Tests completed.")
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Storage Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testStorage} 
            disabled={isLoading}
            className="mb-6"
          >
            {isLoading ? "Testing..." : "Run Storage Tests"}
          </Button>
          
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className="p-2 bg-gray-100 rounded text-sm font-mono"
              >
                {result}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}