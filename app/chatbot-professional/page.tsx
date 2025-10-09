"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, User, Calendar, Clock, MapPin, Phone, ChevronLeft, Home } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ProfessionalChatbot() {
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
  const [currentView, setCurrentView] = useState<'chat' | 'faq' | 'schedules'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // FAQ data
  const faqs = [
    {
      id: 1,
      category: "الحجز",
      question: "كيف أحجز موعد طبي؟",
      answer: "يمكنك حجز موعد طبي من خلال الذهاب إلى صفحة 'المراكز الطبية' واختيار المركز المناسب لك، ثم اختيار العيادة والطبيب وتحديد التاريخ والوقت المناسبين لك."
    },
    {
      id: 2,
      category: "الحجز",
      question: "ما هي أوقات العمل للمركز الطبي؟",
      answer: "أوقات العمل تختلف حسب كل مركز طبي وعيادة. يمكنك الاطلاع على أوقات العمل عند اختيارك للمركز الطبي المطلوب."
    },
    {
      id: 3,
      category: "الحجوزات",
      question: "كيف يمكنني إلغاء موعد محجوز؟",
      answer: "يمكنك إلغاء الموعد من خلال الذهاب إلى صفحة 'المواعيد' واختيار الموعد الذي ترغب بإلغائه ثم الضغط على زر الإلغاء."
    },
    {
      id: 4,
      category: "الحجوزات",
      question: "هل يمكنني تعديل موعد محجوز؟",
      answer: "نعم، يمكنك تعديل الموعد من خلال إلغاء الموعد الحالي وحجز موعد جديد في الوقت المناسب لك."
    },
    {
      id: 5,
      category: "الوثائق",
      question: "ما هي المستندات المطلوبة لحجز موعد؟",
      answer: "عند الحجز، يُرجى إحضار بطاقة الهوية أو جواز السفر. في حالة الأطفال، يُرجى إحضار شهادة الميلاد."
    },
    {
      id: 6,
      category: "الحجوزات",
      question: "هل يمكنني حجز موعد لعضو آخر في العائلة؟",
      answer: "نعم، عند الحجز يمكنك إدخال معلومات المريض الذي سيحضر الموعد، سواء كان أنت أو أحد أفراد العائلة."
    }
  ]

  // Clinic schedules data
  const clinicSchedules = [
    {
      id: 1,
      name: "عيادات الدانا - مشفى القدس",
      schedule: `📅 عيادات الدانا - مشفى القدس

الأحد:
- داخلية | جراحة عامة | هضمية | قلبية | مفصلية | صدرية

الاثنين:
- داخلية | جراحة عامة | هضمية

الثلاثاء:
- داخلية | جراحة عامة | قلبية | صدرية

الأربعاء:
- داخلية | جراحة عامة | قلبية | صدرية

الخميس:
- داخلية | جراحة عامة | قلبية`
    },
    {
      id: 2,
      name: "مركز كليبت الصحي",
      schedule: `🏥 مركز كليبت الصحي

الأحد:
- أطفال: فاعلة
- داخلية: فاعلة
- نسائية: فاعلة
- اسنان: غير متاحة
- سوء تغذية: فاعلة

الاثنين:
- أطفال: غير متاحة
- داخلية: فاعلة
- نسائية: فاعلة
- اسنان: فاعلة
- سوء تغذية: فاعلة

الثلاثاء:
- أطفال: غير متاحة
- داخلية: فاعلة
- نسائية: فاعلة
- اسنان: فاعلة
- سوء تغذية: فاعلة

الأربعاء:
- أطفال: فاعلة
- داخلية: فاعلة
- نسائية: فاعلة
- اسنان: غير متاحة
- سوء تغذية: فاعلة

الخميس:
- أطفال: فاعلة
- داخلية: فاعلة
- نسائية: فاعلة
- اسنان: غير متاحة
- سوء تغذية: فاعلة

⏰ يبدأ الدوام الساعة الثامنة صباحاً وحتى الرابعة عصراً`
    },
    {
      id: 3,
      name: "عيادات أطمه",
      schedule: `🏥 عيادات أطمه

السبت:
- الصيدلية: فاعلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة

الأحد:
- الصيدلية: فاعلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة

الاثنين:
- الصيدلية: فاعلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة

الثلاثاء:
- الصيدلية: عطّلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة

الأربعاء:
- الصيدلية: عطّلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة

الخميس:
- الصيدلية: عطّلة
- مدخلي البيانات: فاعلة
- عيادة نسائية: فاعلة
- عيادة أطفال 1: عطّلة
- تمریض: فاعلة`
    },
    {
      id: 4,
      name: "عيادات أرمناز",
      schedule: `🏥 عيادات أرمناز

السبت:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: فاعلة

الأحد:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: غير متاحة

الاثنين:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: غير متاحة

الثلاثاء:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: غير متاحة

الأربعاء:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: غير متاحة

الخميس:
- الداخلية: فاعلة
- القلبية: فاعلة
- الجراحة: غير متاحة`
    },
    {
      id: 5,
      name: "مركز كفر عروق",
      schedule: `🏥 مركز كفر عروق

السبت:
- الأطفال: فاعلة
- الداخلية: عطّلة

الأحد:
- الأطفال: فاعلة
- الداخلية: عطّلة

الاثنين:
- الأطفال: فاعلة
- الداخلية: عطّلة

الثلاثاء:
- الأطفال: فاعلة
- الداخلية: عطّلة

الأربعاء:
- الأطفال: فاعلة
- الداخلية: عطّلة

الخميس:
- الأطفال: فاعلة
- الداخلية: عطّلة

⏰ يبدأ الدوام الساعة 8:00 صباحاً وينتهي الساعة 4:00 مساءً`
    },
    {
      id: 6,
      name: "مركز أبين الصحي",
      schedule: `🏥 مركز أبين الصحي

الجمعة:
- جميع العيادات: عطّلة

السبت:
- جميع العيادات: عطّلة

الأحد إلى الخميس:
- العيادات: فاعلة
- الداخلية: فاعلة
- الأطفال: فاعلة
- النسائية: فاعلة

⏰ يبدأ الدوام الإداري من الساعة 8 صباحاً حتى الساعة 4 مساءً.`
    }
  ]

  // Categories for FAQ
  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  // Handle sending messages
  const handleSend = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const userInput = inputValue.trim()
    setInputValue("")
    setIsBotTyping(true)

    // Process user input
    setTimeout(() => {
      let botResponse = ""
      
      // Check if user question matches any FAQ
      const matchedFaq = faqs.find(faq => 
        faq.question.includes(userInput) || userInput.includes(faq.question.split(' ')[0])
      )
      
      if (matchedFaq) {
        botResponse = matchedFaq.answer
      } else if (userInput.includes("مرحبا") || userInput.includes("أهلا")) {
        botResponse = "مرحباً بك! كيف يمكنني مساعدتك في حجز موعد طبي؟"
      } else if (userInput.includes("شكر") || userInput.includes("معروف")) {
        botResponse = "على الرحب والسعة! إذا كنت بحاجة لأي مساعدة إضافية، فلا تتردد في السؤال."
      } else if (userInput.includes("وقت") || userInput.includes("ساعات")) {
        botResponse = "أوقات العمل تختلف حسب كل مركز طبي وعيادة. يمكنك الاطلاع على أوقات العمل عند اختيارك للمركز الطبي المطلوب."
      } else if (userInput.includes("مركز") || userInput.includes("عيادة")) {
        botResponse = "يمكنك الاطلاع على جميع المراكز الطبية المتاحة من خلال صفحة 'المراكز الطبية' واختيار المركز المناسب لك."
      } else if (userInput.includes("موعد") || userInput.includes("حجز")) {
        botResponse = "للحجز، يرجى الذهاب إلى صفحة 'المراكز الطبية' واختيار المركز الطبي المناسب لك، ثم اختيار العيادة والطبيب وتحديد التاريخ والوقت المناسبين لك."
      } else {
        botResponse = "يمكنك حجز موعد طبي من خلال الذهاب إلى صفحة 'المراكز الطبية' واختيار المركز المناسب لك. هل تود معرفة المزيد عن خدمات معينة؟"
      }

      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot' as const,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsBotTyping(false)
    }, 1000)
  }

  // Handle FAQ selection
  const handleFaqSelect = (faqId: number) => {
    const faq = faqs.find(f => f.id === faqId)
    if (faq) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: faq.question,
        sender: 'user' as const,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setIsBotTyping(true)
      
      // Process selection
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: faq.answer,
          sender: 'bot' as const,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsBotTyping(false)
      }, 500)
    }
  }

  // Handle clinic schedule selection
  const handleClinicSelect = (clinicId: number) => {
    const clinic = clinicSchedules.find(c => c.id === clinicId)
    if (clinic) {
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: clinic.name,
        sender: 'user' as const,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setIsBotTyping(true)
      
      // Process selection
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: clinic.schedule,
          sender: 'bot' as const,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsBotTyping(false)
      }, 500)
    }
  }

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                مساعد الحجز الطبي
              </h1>
              <div></div> {/* Spacer for flex alignment */}
            </div>
            <p className="text-xl text-muted-foreground">اسألني أي شيء عن حجز المواعيد الطبية</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="border-t-4 border-blue-600 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <span>القائمة الرئيسية</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant={currentView === 'chat' ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setCurrentView('chat')}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    المحادثة
                  </Button>
                  <Button 
                    variant={currentView === 'faq' ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setCurrentView('faq')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    الأسئلة الشائعة
                  </Button>
                  <Button 
                    variant={currentView === 'schedules' ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => setCurrentView('schedules')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    جداول الدوام
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6 border-t-4 border-indigo-600 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span>للحجز الفوري</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    اتصل بنا مباشرة للحجز الفوري
                  </p>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    اتصل الآن: 123-456-7890
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {currentView === 'chat' && (
                <Card className="border-t-4 border-blue-600 rounded-2xl shadow-lg h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <span>المحادثة</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 h-96">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 ${
                              message.sender === 'user' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-muted rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-start space-x-2 space-x-reverse">
                              {message.sender === 'bot' && (
                                <Bot className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              )}
                              {message.sender === 'user' && (
                                <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isBotTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Bot className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
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

                    {/* Input Area */}
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-1 rounded-full border-blue-300 focus:ring-blue-500"
                      />
                      <Button 
                        onClick={handleSend}
                        disabled={inputValue.trim() === "" || isBotTyping}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentView === 'faq' && (
                <Card className="border-t-4 border-blue-600 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>الأسئلة الشائعة</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categories.map((category) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold mb-3 text-blue-700">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {faqs
                              .filter(faq => faq.category === category)
                              .map((faq) => (
                                <Card 
                                  key={faq.id} 
                                  className="hover:shadow-md transition-shadow cursor-pointer border-blue-100"
                                  onClick={() => handleFaqSelect(faq.id)}
                                >
                                  <CardContent className="p-4">
                                    <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentView === 'schedules' && (
                <Card className="border-t-4 border-blue-600 rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>جداول الدوام</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {clinicSchedules.map((clinic) => (
                        <Card 
                          key={clinic.id} 
                          className="hover:shadow-md transition-shadow cursor-pointer border-blue-100"
                          onClick={() => handleClinicSelect(clinic.id)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-medium text-foreground mb-2">{clinic.name}</h3>
                            <div className="text-sm text-muted-foreground">
                              <p>انقر لعرض جدول الدوام الكامل</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* Detailed schedule view when selected */}
                    {messages.some(m => m.sender === 'bot' && clinicSchedules.some(c => m.text.includes(c.name))) && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2">جدول الدوام المحدد:</h3>
                        <div className="bg-white p-4 rounded-lg whitespace-pre-wrap">
                          {messages
                            .filter(m => m.sender === 'bot' && clinicSchedules.some(c => m.text.includes(c.name)))
                            .slice(-1)[0]?.text}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-t-4 border-blue-600 rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">حجز المواعيد</h3>
                <p className="text-muted-foreground text-sm">احجز مواعيدك الطبية بسهولة عبر الإنترنت</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-indigo-600 rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">أوقات مرنة</h3>
                <p className="text-muted-foreground text-sm">اختر الوقت المناسب لك من بين العديد من الخيارات</p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-purple-600 rounded-2xl shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="w-10 h-10 text-purple-600 mx-auto mb-4" />
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