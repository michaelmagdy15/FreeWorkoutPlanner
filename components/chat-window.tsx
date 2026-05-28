"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Zap, Database, FileText, MessageSquare, Dumbbell, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  toolUsed?: string
  intentType?: string
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to your personal training portal, Mirna! I am your AI fitness coach. I have loaded 'The Plateau-Breaker Split' into our memory stores. You can ask me to log sets, track nutrition, generate new targeted workout structures, or review your progressive overload stats. How are we crushing it today? 💪",
      sender: "coach",
      timestamp: new Date(Date.now() - 300000),
      toolUsed: "context-viewer"
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = newMessage
    setNewMessage("")
    setIsTyping(true)

    try {
      // Get current user context for better responses
      const contextResponse = await fetch('/api/context?userId=default-user')
      let userContext = null
      
      if (contextResponse.ok) {
        userContext = await contextResponse.json()
      }

      // Call enhanced chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          context: userContext,
          userId: 'default-user',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        const coachMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || "I'm here to help you achieve your fitness goals! 💪",
          sender: "coach",
          timestamp: new Date(),
          toolUsed: data.toolUsed,
          intentType: data.intent
        }
        
        setMessages((prev) => [...prev, coachMessage])

        // Handle structured data responses
        if (data.structuredData?.refreshContext) {
          // Trigger context refresh to update UI panels
          window.dispatchEvent(new CustomEvent('refreshContext'))
          console.log('🔄 Context refresh triggered by chat action')
        }

      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error in chat:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the coach service right now. I will assist you locally. Keep up the high intensity! 🔥",
        sender: "coach",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Get tool icon based on tool used
  const getToolIcon = (toolUsed?: string) => {
    switch (toolUsed) {
      case 'workout-logger':
        return <Dumbbell className="w-3 h-3" />
      case 'nutrition-logger':
        return <Apple className="w-3 h-3" />
      case 'plan-generator':
        return <FileText className="w-3 h-3" />
      case 'context-viewer':
        return <Database className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  // Get tool display name
  const getToolName = (toolUsed?: string) => {
    switch (toolUsed) {
      case 'workout-logger':
        return 'Workout Logged'
      case 'nutrition-logger':
        return 'Meal Tracked'
      case 'plan-generator':
        return 'AI Plan Customizer'
      case 'context-viewer':
        return 'Active Seeding'
      default:
        return 'Assistant'
    }
  }

  // Get intent badge style
  const getIntentBadgeStyle = (intentType?: string) => {
    switch (intentType) {
      case 'log_activity':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'log_nutrition':
        return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'generate_plan':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-white/5 text-slate-300 border-white/5'
    }
  }

  return (
    <div className="h-full glass-panel rounded-3xl flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 btn-premium rounded-full flex items-center justify-center shadow-lg shadow-coral-500/10">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">AI Fitness Coach</h3>
            <p className="text-xs text-slate-400 font-medium">Model Context Protocol Data Server</p>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/15">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-in slide-in-from-bottom-2 duration-300",
              message.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.sender === "coach" && (
              <div className="w-8 h-8 bg-slate-800 border border-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}

            <div className="flex flex-col max-w-[75%]">
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl shadow-md leading-relaxed text-sm whitespace-pre-wrap",
                  message.sender === "user"
                    ? "btn-premium text-white rounded-br-none"
                    : "bg-slate-900 border border-white/5 text-slate-200 rounded-bl-none",
                )}
              >
                <p>{message.content}</p>
                <p className={cn("text-[9px] mt-1.5 opacity-60 font-mono text-right", message.sender === "user" ? "text-white/80" : "text-slate-500")}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* Tool Usage Indicator - Only for coach messages */}
              {message.sender === "coach" && message.toolUsed && (
                <div className="flex items-center gap-2 mt-2 ml-1">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border font-bold uppercase tracking-wider",
                    getIntentBadgeStyle(message.intentType)
                  )}>
                    {getToolIcon(message.toolUsed)}
                    <span>{getToolName(message.toolUsed)}</span>
                  </div>
                  {message.intentType && message.intentType !== 'general_chat' && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-yellow-500 animate-pulse" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                        Real-time Sync
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {message.sender === "user" && (
              <div className="w-8 h-8 btn-premium rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 bg-slate-800 border border-white/5 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-slate-900 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-6 border-t border-white/5 bg-slate-950/40">
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tell me: 'I did 4 sets of RDLs' or 'Log Greek Yogurt for breakfast'..."
            className="flex-1 rounded-xl border-white/5 bg-slate-950/80 text-white placeholder:text-slate-500 text-xs focus:ring-1 focus:ring-primary focus-visible:ring-primary"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-xl btn-premium shadow-lg shadow-coral-500/10 flex-shrink-0 w-10 h-10 p-0"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Action Suggestion Chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setNewMessage("I just completed Day 1 Romanian Deadlifts at 35 lbs")}
            className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all"
          >
            Log Day 1 RDLs
          </button>
          <button
            onClick={() => setNewMessage("Log 480 calories chicken and rice for lunch")}
            className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-full transition-all"
          >
            Log Lunch
          </button>
          <button
            onClick={() => setNewMessage("What is my progressive overload status today?")}
            className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full transition-all"
          >
            Check Status
          </button>
        </div>
      </div>
    </div>
  )
}
