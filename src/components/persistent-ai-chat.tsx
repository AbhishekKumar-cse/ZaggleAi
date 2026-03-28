"use client"

import * as React from "react"
import { Bot, X, Send, Maximize2, Minimize2, Sparkles, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { interactiveAiFinancialAssistant } from "@/ai/flows/interactive-ai-financial-assistant"
import { cn } from "@/lib/utils"

export function PersistentAIChat() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'model', content: string }>>([
    { role: 'model', content: "Hello! I'm CFO-OS AI. How can I assist your financial operations today?" }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg = input
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const response = await interactiveAiFinancialAssistant({
        message: userMsg,
        history: messages
      })
      setMessages(prev => [...prev, { role: 'model', content: response.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "I encountered an error. Please try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "mb-4 w-96 flex flex-col shadow-2xl transition-all duration-300",
              isMinimized ? "h-14" : "h-[550px]"
            )}
          >
            <Card className="flex-1 border-border/50 bg-brand-obsidian/95 backdrop-blur-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-primary/10">
                <div className="flex items-center gap-2">
                  <Bot className="size-5 text-primary" />
                  <span className="font-headline font-bold text-sm tracking-tight">CFO-OS AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => setIsOpen(false)}>
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn(
                            "size-8 rounded-full flex items-center justify-center shrink-0 border",
                            msg.role === 'user' ? "bg-white/10 border-white/10" : "bg-primary/10 border-primary/20"
                          )}>
                            {msg.role === 'user' ? <User className="size-4" /> : <Bot className="size-4 text-primary" />}
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl text-sm max-w-[80%] leading-relaxed",
                            msg.role === 'user' 
                              ? "bg-primary text-primary-foreground font-medium rounded-tr-none" 
                              : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none"
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="size-4 text-primary" />
                          </div>
                          <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                            <span className="size-1 bg-primary rounded-full animate-bounce" />
                            <span className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="size-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border/50 bg-brand-obsidian">
                    <div className="relative">
                      <Input
                        placeholder="Type a message or ask an agent..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="pr-12 bg-white/5 border-border/50 focus-visible:ring-primary h-12"
                      />
                      <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 size-10 rounded-md bg-primary hover:bg-primary/90 transition-transform active:scale-95"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "size-14 rounded-full bg-primary text-brand-obsidian shadow-[0_0_20px_rgba(0,212,184,0.4)] hover:scale-110 transition-transform duration-300",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="size-7 fill-current" />
      </Button>
    </div>
  )
}