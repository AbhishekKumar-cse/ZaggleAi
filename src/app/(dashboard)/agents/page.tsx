"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bot, 
  Settings2, 
  Play, 
  Terminal, 
  History, 
  Network,
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Send
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AGENT_REGISTRY } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null)
  const [taskInput, setTaskInput] = React.useState("")
  const [isRunning, setIsRunning] = React.useState(false)
  const [logs, setLogs] = React.useState<string[]>([])

  const dispatchTask = async () => {
    if (!taskInput || !selectedAgent || isRunning) return
    setIsRunning(true)
    setLogs([])

    const steps = [
      "✓ Establishing agent secure context...",
      "✓ Fetching relevant financial schemas...",
      "✓ Analyzing query semantic intent...",
      "→ Processing deep inference chains...",
      "→ Optimizing tactical response...",
      "✓ Formatting structured output..."
    ]

    for (const step of steps) {
      setLogs(prev => [...prev, step])
      await new Promise(r => setTimeout(r, 600 + Math.random() * 1000))
    }
    
    setIsRunning(false)
    setTaskInput("")
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">AI Agent Console</h1>
          <p className="text-muted-foreground font-medium">Multi-agent orchestration & autonomous task dispatching</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border/50 bg-white/5">
            <Network className="size-4 mr-2" />
            Graph View
          </Button>
          <Button className="bg-primary text-brand-obsidian font-bold hover:bg-primary/90">
            <Zap className="size-4 mr-2" />
            Active Mode
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENT_REGISTRY.map((agent) => (
          <AgentCard 
            key={agent.id} 
            {...agent} 
            isSelected={selectedAgent === agent.id}
            onClick={() => setSelectedAgent(agent.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-4">
        <Card className="xl:col-span-7 border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Terminal className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline text-xl">Task Dispatcher</CardTitle>
                <CardDescription>Send natural language tasks to specialized agents</CardDescription>
              </div>
            </div>
            {selectedAgent && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 h-6">
                Active: {AGENT_REGISTRY.find(a => a.id === selectedAgent)?.name}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <textarea 
                placeholder={selectedAgent ? `Describe task for ${AGENT_REGISTRY.find(a => a.id === selectedAgent)?.name}...` : "Select an agent above to dispatch a task"}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                disabled={!selectedAgent || isRunning}
                className="w-full h-32 bg-white/5 border border-border/50 rounded-xl p-4 text-white font-body focus:ring-1 focus:ring-primary outline-none resize-none transition-all disabled:opacity-50"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/5 text-[10px] text-muted-foreground uppercase py-0 cursor-pointer hover:bg-white/10">Priority: High</Badge>
                  <Badge variant="secondary" className="bg-white/5 text-[10px] text-muted-foreground uppercase py-0 cursor-pointer hover:bg-white/10">Mode: Auto</Badge>
                </div>
                <Button 
                  onClick={dispatchTask}
                  disabled={!selectedAgent || !taskInput || isRunning}
                  className="bg-primary hover:bg-primary/90 text-brand-obsidian font-bold gap-2"
                >
                  {isRunning ? <RefreshCcw className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Dispatch Agent
                </Button>
              </div>
            </div>

            {logs.length > 0 && (
              <div className="bg-black/40 rounded-xl border border-border/50 p-4 font-code text-xs space-y-2 max-h-48 overflow-auto scrollbar-hide">
                <AnimatePresence initial={false}>
                  {logs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center gap-2",
                        log.startsWith('✓') ? "text-emerald-400" : "text-primary"
                      )}
                    >
                      <span>{log}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-5 border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History className="size-5 text-muted-foreground" />
                <CardTitle className="font-headline text-lg">Live Execution History</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-muted-foreground hover:text-white">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ExecutionItem 
              agent="SpendSentinel" 
              task="Anomaly scan for HR department" 
              time="2m ago" 
              status="success" 
            />
            <ExecutionItem 
              agent="ForecastOracle" 
              task="Cash runway projection update" 
              time="14m ago" 
              status="success" 
            />
            <ExecutionItem 
              agent="ComplianceGuard" 
              task="Audit log verification check" 
              time="1h ago" 
              status="warning" 
            />
            <ExecutionItem 
              agent="NarratorAI" 
              task="Monthly P&L narrative generation" 
              time="3h ago" 
              status="success" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AgentCard({ name, role, status, lastAction, isSelected, onClick }: any) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "cursor-pointer border-border/50 bg-brand-obsidian/40 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group",
        isSelected && "border-primary shadow-[0_0_20px_rgba(0,212,184,0.1)] bg-primary/5"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={cn(
            "size-12 rounded-2xl flex items-center justify-center border transition-colors",
            isSelected ? "bg-primary border-primary text-brand-obsidian" : "bg-white/5 border-white/10 text-primary group-hover:border-primary/50"
          )}>
            <Bot className="size-6" />
          </div>
          <Badge variant="outline" className={cn(
            "h-6 px-2 font-bold uppercase text-[9px] tracking-wider",
            status === 'running' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-muted-foreground border-white/10"
          )}>
            {status}
          </Badge>
        </div>
        <div className="pt-2">
          <CardTitle className="font-headline text-xl text-white">{name}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground line-clamp-1">{role}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Last Action</p>
          <p className="text-xs text-white/90 font-medium truncate">{lastAction}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1 h-8 text-[10px] uppercase font-bold text-muted-foreground hover:bg-white/5">Configure</Button>
        <Button variant="ghost" size="sm" className="flex-1 h-8 text-[10px] uppercase font-bold text-muted-foreground hover:bg-white/5">Logs</Button>
      </CardFooter>
    </Card>
  )
}

function ExecutionItem({ agent, task, time, status }: any) {
  const icons: any = {
    success: <CheckCircle2 className="size-4 text-emerald-500" />,
    warning: <AlertCircle className="size-4 text-amber-500" />,
    running: <RefreshCcw className="size-4 text-primary animate-spin" />,
  }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-white/5 group hover:bg-white/10 transition-all">
      <div className="shrink-0 mt-0.5">
        {icons[status]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-white truncate">{agent}</p>
          <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{task}</p>
      </div>
    </div>
  )
}

import { RefreshCcw } from "lucide-react"