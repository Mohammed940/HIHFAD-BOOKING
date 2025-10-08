"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Handle ESC key to close the chatbot
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen])

  return (
    <>
      {/* Floating Chatbot Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 rounded-full w-14 h-14 shadow-lg z-50 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-110"
          aria-label="Open chatbot"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-6 left-6 w-full max-w-md h-96 rounded-2xl shadow-2xl z-50 flex flex-col border-0 bg-card backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl">
            <div className="flex items-center space-x-2 space-x-reverse">
              <MessageCircle className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">المساعد الطبي</h3>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? "+" : "-"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <CardContent className="flex-1 p-0 overflow-hidden">
              <iframe 
                src="https://www.yeschat.ai/i/gpts-2OToO6J95F-AI-DOCTOR" 
                className="w-full h-full border-0"
                title="AI Doctor Chatbot"
              />
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}