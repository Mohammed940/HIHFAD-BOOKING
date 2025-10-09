"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, User, Calendar, Clock, MapPin, Phone, X } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      id: 1,
      text: "مرحباً! أنا مساعد الحجز الطبي. كيف يمكنني مساعدتك اليوم؟",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isBotTyping, setIsBotTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const faqs = [
    {
      question: "كيف أحجز موعد طبي؟",
      answer: "يمكنك حجز موعد طبي من خلال الذهاب إلى صفحة '_centers' واختيار المركز الطبي المناسب لك، ثم اختيار العيادة والطبيب وتحديد التاريخ والوقت المناسبين لك."
    },
    {
      question: "ما هي أوقات العمل للمركز الطبي؟",
      answer: "أوقات العمل تختلف حسب كل مركز طبي وعيادة. يمكنك الاطلاع على أوقات العمل عند اختيارك للمركز الطبي المطلوب."
    },
    {
      question: "كيف يمكنني إلغاء موعد محجوز؟",
      answer: "يمكنك إلغاء الموعد من خلال الذهاب إلى صفحة 'المواعيد' واختيار الموعد الذي ترغب بإلغائه ثم الضغط على زر الإلغاء."
    },
    {
      question: "هل يمكنني تعديل موعد محجوز؟",
      answer: "نعم، يمكنك تعديل الموعد من خلال إلغاء الموعد الحالي وحجز موعد جديد في الوقت المناسب لك."
    },
    {
      question: "ما هي المستندات المطلوبة لحجز موعد؟",
      answer: "عند الحجز، يُرجى إحضار بطاقة الهوية أو جواز السفر. في حالة الأطفال، يُرجى إحضار شهادة الميلاد."
    },
    {
      question: "هل يمكنني حجز موعد لعضو آخر في العائلة؟",
      answer: "نعم، عند الحجز يمكنك إدخال معلومات المريض الذي سيحضر الموعد، سواء كان أنت أو أحد أفراد العائلة."
    }
  ]

  const clinicSchedules = [
    {
      id: 1,
      name: "عيادات الدانا - مشفى القدس"
    },
    {
      id: 2,
      name: "جدول دوام عيادات مركز كليبت الصحي"
    },
    {
      id: 3,
      name: "دوام العيادات الخارجية - أطمه"
    },
    {
      id: 4,
      name: "برنامج دوام العيادات الخارجية - أرمناز"
    },
    {
      id: 5,
      name: "برنامج دوام العيادات لعام 2025 - مركز كفر عروق"
    },
    {
      id: 6,
      name: "خدمات مركز أبين الصحي 2025"
    },
    {
      id: 7,
      name: "خروج / إنهاء المحادثة"
    }
  ]

  const handleSend = async () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsBotTyping(true)

    try {
      // Call the chatbot API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      })

      const data = await response.json()
      
      if (data.success) {
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: 'bot' as const,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
      } else {
        throw new Error(data.error || "حدث خطأ أثناء معالجة طلبك")
      }
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        sender: 'bot' as const,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsBotTyping(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
  }

  const handleClinicSchedule = (clinicId: number) => {
    if (clinicId === 7) {
      // Handle exit/end conversation
      const exitMessage = {
        id: messages.length + 1,
        text: "👋 شكرًا لاستخدامك شات بوت عيادات HIHFAD! إذا كنت بحاجة لأي معلومات أخرى، لا تتردد في العودة. مع أطيب التحيات.",
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, exitMessage])
      return
    }
    
    const clinic = clinicSchedules.find(c => c.id === clinicId)
    if (clinic) {
      setInputValue(`أريد معرفة جدول دوام ${clinic.name}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              مساعد الحجز الطبي
            </h1>
            <p className="text-xl text-muted-foreground">اسألني أي شيء عن حجز المواعيد الطبية</p>
          </div>

          <Card className="border-t-4 border-primary rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <span>المحادثة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Chat Messages - Reduced height from h-96 to h-64 */}
                <div className="h-64 overflow-y-auto pr-2 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-start space-x-2 space-x-reverse">
                          {message.sender === 'bot' && (
                            <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          )}
                          {message.sender === 'user' && (
                            <User className="w-5 h-5 text-primary-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {format(message.timestamp, "hh:mm a", { locale: ar })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isBotTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Clinic Schedule Options */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">اختر عيادة لعرض جدول الدوام:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {clinicSchedules.map((clinic) => (
                      <Button 
                        key={clinic.id}
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleClinicSchedule(clinic.id)}
                        className="rounded-full border-primary/30 text-xs h-auto py-2 px-3"
                      >
                        {clinic.id}. {clinic.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">أسئلة سريعة:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickQuestion("كيف أحجز موعد طبي؟")}
                      className="rounded-full border-primary/30"
                    >
                      حجز موعد
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickQuestion("ما هي أوقات العمل للمركز الطبي؟")}
                      className="rounded-full border-primary/30"
                    >
                      أوقات العمل
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleQuickQuestion("كيف يمكنني إلغاء موعد محجوز؟")}
                      className="rounded-full border-primary/30"
                    >
                      إلغاء موعد
                    </Button>
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex space-x-2 space-x-reverse">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 rounded-full border-primary/30 focus:ring-primary"
                  />
                  <Button 
                    onClick={handleSend}
                    disabled={inputValue.trim() === "" || isBotTyping}
                    className="rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-8 border-t-4 border-primary rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>الأسئلة الشائعة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-muted/50 rounded-xl border border-primary/10 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleQuickQuestion(faq.question)}
                  >
                    <h3 className="font-medium text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-t-4 border-primary rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <Calendar className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">حجز المواعيد</h3>
                <p className="text-muted-foreground text-sm">احجز مواعيدك الطبية بسهولة عبر الإنترنت</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-primary rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">أوقات مرنة</h3>
                <p className="text-muted-foreground text-sm">اختر الوقت المناسب لك من بين العديد من الخيارات</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-primary rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">مراكز طبية متنوعة</h3>
                <p className="text-muted-foreground text-sm">اختر من بين مجموعة واسعة من المراكز الطبية والعيادات</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}