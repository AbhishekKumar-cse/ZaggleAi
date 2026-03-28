"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Wallet, 
  Activity, 
  ShieldAlert, 
  Target, 
  Clock,
  RefreshCcw,
  Bot,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts"
import { generateCfoMorningBrief } from "@/ai/flows/ai-generated-cfo-morning-brief"
import { KPI_DATA, DEPARTMENT_SPEND, CATEGORY_SPEND } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [brief, setBrief] = React.useState("")
  const [isBriefLoading, setIsBriefLoading] = React.useState(false)

  const fetchBrief = async () => {
    setIsBriefLoading(true)
    setBrief("")
    try {
      const result = await generateCfoMorningBrief({
        kpiData: KPI_DATA,
        topSpendAlerts: ["AWS overspend in Engineering (+15%)", "Unusual T&E pattern detected in Sales"],
        forecastDeviation: "Q4 forecast tracking 2.5% ahead of target",
        strategicRecommendationContext: "Rising SaaS renewals expected in December"
      })
      
      // Simulate typewriter
      let i = 0
      const timer = setInterval(() => {
        setBrief(prev => result.substring(0, i))
        i++
        if (i > result.length) clearInterval(timer)
      }, 5)
    } catch (error) {
      setBrief("Could not generate brief. Please try again.")
    } finally {
      setIsBriefLoading(false)
    }
  }

  React.useEffect(() => {
    fetchBrief()
  }, [])

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Executive Command Center</h1>
          <p className="text-muted-foreground font-medium">Real-time financial orchestration & intelligence</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="h-10 border-border/50 bg-white/5 hover:bg-white/10">
            <Clock className="size-4 mr-2" />
            Last Updated: 2m ago
          </Button>
          <Button size="sm" className="h-10 bg-primary hover:bg-primary/90 text-brand-obsidian font-bold">
            <RefreshCcw className="size-4 mr-2" />
            Force Sync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard title="Monthly Spend" value="₹25.0L" icon={TrendingUp} trend="+4.2%" color="teal" />
        <KPICard title="Cash Position" value="₹1.50Cr" icon={Wallet} trend="Stable" color="blue" />
        <KPICard title="Budget Util." value="92%" icon={Activity} trend="-1.5%" color="amber" />
        <KPICard title="Compliance" value="07" icon={ShieldAlert} trend="Critical" color="red" />
        <KPICard title="Forecast Acc." value="91%" icon={Target} trend="+0.5%" color="teal" />
        <KPICard title="DSO" value="45d" icon={Clock} trend="-2d" color="teal" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <Card className="xl:col-span-8 border-border/50 bg-brand-obsidian/40 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl">AI Generated CFO Morning Brief</CardTitle>
              <CardDescription className="text-muted-foreground">Strategic summary generated via Claude-3 Sonnet</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchBrief} 
              disabled={isBriefLoading}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Bot className="size-4 mr-2" />
              Regenerate
            </Button>
          </CardHeader>
          <CardContent className="relative min-h-[200px]">
            {isBriefLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-brand-obsidian/50 z-10">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-primary rounded-full animate-bounce" />
                  <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="size-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div className="font-body text-slate-300 leading-relaxed text-sm p-4 rounded-lg bg-white/5 border border-white/5 shadow-inner">
              {brief || (isBriefLoading ? "" : "Generating your morning brief...")}
              {!isBriefLoading && brief && <span className="animate-pulse ml-1 inline-block h-4 w-1 bg-primary align-middle" />}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-4 border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Agent Activity</CardTitle>
            <CardDescription>Live multi-agent orchestration log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem agent="SpendSentinel" action="Scanning Q4 transactions..." status="running" />
              <ActivityItem agent="ForecastOracle" action="Updated revenue projections" status="completed" />
              <ActivityItem agent="ComplianceGuard" action="Flagged anomaly TX-1004" status="flagged" />
              <ActivityItem agent="TreasuryPilot" action="Optimized float schedule" status="completed" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Department Spend Heatmap</CardTitle>
            <CardDescription>Actual vs Budget distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_SPEND} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E3A5F', borderRadius: '8px' }}
                  itemStyle={{ color: '#00D4B8' }}
                />
                <Bar dataKey="value" name="Actual" radius={[4, 4, 0, 0]} fill="#00D4B8" />
                <Bar dataKey="budget" name="Budget" radius={[4, 4, 0, 0]} fill="#3B82F6" opacity={0.3} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Spend by Category</CardTitle>
            <CardDescription>Top 5 allocation segments</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SPEND}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CATEGORY_SPEND.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#00D4B8', '#3B82F6', '#F59E0B', '#10B981', '#6366F1'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E3A5F', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {CATEGORY_SPEND.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: ['#00D4B8', '#3B82F6', '#F59E0B', '#10B981', '#6366F1'][i] }} />
                  <span className="text-xs text-muted-foreground">{cat.name}: <span className="text-white font-medium">₹{(cat.value/1000).toFixed(0)}k</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KPICard({ title, value, icon: Icon, trend, color }: any) {
  const colorMap: any = {
    teal: "text-primary bg-primary/10 border-primary/20",
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
  }

  return (
    <Card className="border-border/50 bg-brand-obsidian/40 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.teal}`}>
            <Icon className="size-5" />
          </div>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight",
            trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : trend.startsWith('-') ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
          )}>
            {trend}
          </span>
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl font-code font-bold text-white mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({ agent, action, status }: any) {
  const statusColors: any = {
    running: "bg-primary shadow-[0_0_8px_hsl(var(--primary))]",
    completed: "bg-emerald-500",
    flagged: "bg-red-500 animate-pulse",
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border/30 bg-white/5 group hover:bg-white/10 transition-colors">
      <div className={cn("size-2.5 rounded-full shrink-0", statusColors[status])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white">{agent}</p>
        <p className="text-xs text-muted-foreground truncate">{action}</p>
      </div>
      <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
