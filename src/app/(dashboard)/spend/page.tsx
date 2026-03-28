"use client"

import * as React from "react"
import { 
  Search, 
  Filter, 
  Download, 
  Bot, 
  AlertCircle, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { MOCK_TRANSACTIONS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { detectSpendAnomaly } from "@/ai/flows/ai-powered-spend-anomaly-detection"

export default function SpendPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [analyzingTxId, setAnalyzingTxId] = React.useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = React.useState<any>(null)

  const handleRunAI = async (tx: any) => {
    setAnalyzingTxId(tx.id)
    setAnalysisResult(null)
    try {
      const result = await detectSpendAnomaly({
        currentTransaction: {
          ...tx,
          employeeId: tx.employeeId || "E001",
          employeeName: tx.employeeName || "User",
          location: "Mumbai, IN",
          paymentMethod: "Zaggle Corporate Card"
        },
        recentTransactions: MOCK_TRANSACTIONS.slice(0, 5),
        activePolicies: [
          { name: "Meal Limit", rule: "Meals > ₹2000 requires manager approval", threshold: 2000, action: "flag", active: true }
        ]
      })
      setAnalysisResult({ txId: tx.id, ...result })
    } catch (error) {
      console.error(error)
    } finally {
      setAnalyzingTxId(null)
    }
  }

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    tx.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Spend Intelligence</h1>
          <p className="text-muted-foreground font-medium">Real-time Zaggle transaction monitoring & anomaly detection</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 border-border/50 bg-white/5 hover:bg-white/10">
            <Download className="size-4 mr-2" />
            Export CSV
          </Button>
          <Button className="h-10 bg-primary hover:bg-primary/90 text-brand-obsidian font-bold">
            <Bot className="size-4 mr-2" />
            Run Spend Sentinel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <Card className="border-border/50 bg-brand-obsidian/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Search transactions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/5 border-border/50 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-10 border-border/50 bg-white/5">
                  <Filter className="size-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Employee</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Vendor</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Category</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Amount</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Date</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="border-border/30 hover:bg-white/5 transition-colors group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{tx.employeeName}</span>
                          <span className="text-[10px] text-muted-foreground">{tx.department}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tx.vendor}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs py-0">
                          {tx.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-code font-bold">₹{tx.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={tx.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-md hover:bg-primary/20 hover:text-primary"
                            disabled={analyzingTxId === tx.id}
                            onClick={() => handleRunAI(tx)}
                          >
                            <Bot className={cn("size-4", analyzingTxId === tx.id && "animate-spin")} />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 rounded-md">
                            <MoreVertical className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <Card className="border-border/50 bg-brand-obsidian/40 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <CardTitle className="font-headline text-lg">AI Anomaly Insights</CardTitle>
              </div>
              <CardDescription>Select a transaction to analyze with SpendSentinel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyzingTxId ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                  <div className="relative">
                    <div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-white">Agent Thinking...</p>
                    <p className="text-xs text-muted-foreground">Running contextual fraud patterns & policy checks</p>
                  </div>
                </div>
              ) : analysisResult ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className={cn(
                    "p-4 rounded-xl border flex gap-3",
                    analysisResult.isAnomaly ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30"
                  )}>
                    <AlertCircle className={cn("size-5 shrink-0", analysisResult.isAnomaly ? "text-red-500" : "text-emerald-500")} />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">
                        {analysisResult.isAnomaly ? `Anomaly Detected: ${analysisResult.anomalyType}` : "Transaction Clear"}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {analysisResult.explanation}
                      </p>
                    </div>
                  </div>

                  {analysisResult.recommendedActions?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Recommended Actions</p>
                      <div className="space-y-2">
                        {analysisResult.recommendedActions.map((action: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="size-1.5 rounded-full bg-primary mt-1.5" />
                            <span className="text-white/80">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 h-9 text-xs bg-red-500 hover:bg-red-600 text-white font-bold">Escalate</Button>
                    <Button variant="outline" className="flex-1 h-9 text-xs border-border/50 hover:bg-white/10">Archive</Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <AlertCircle className="size-12 mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">No Analysis Running</p>
                  <p className="text-xs">Click the AI icon on any row to start</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    approved: { icon: CheckCircle2, text: 'Approved', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    pending: { icon: Clock, text: 'Pending', class: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    flagged: { icon: XCircle, text: 'Flagged', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  }
  const config = configs[status] || configs.pending
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 font-bold uppercase text-[9px] tracking-wider", config.class)}>
      <Icon className="size-3 mr-1" />
      {config.text}
    </Badge>
  )
}