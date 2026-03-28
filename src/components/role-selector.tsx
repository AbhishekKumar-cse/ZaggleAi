"use client"

import * as React from "react"
import { UserCircle, Shield, Briefcase, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const roles = [
  { id: 'cfo', name: 'CFO', icon: Briefcase, color: 'text-primary' },
  { id: 'analyst', name: 'Finance Analyst', icon: UserCircle, color: 'text-blue-400' },
  { id: 'auditor', name: 'Auditor', icon: Shield, color: 'text-amber-500' },
]

export function RoleSelector() {
  const [activeRole, setActiveRole] = React.useState(roles[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 px-3 gap-2 border-border/50 bg-white/5 hover:bg-white/10 transition-colors">
          <activeRole.icon className={activeRole.color + " size-4"} />
          <span className="text-xs font-semibold">{activeRole.name}</span>
          <ChevronDown className="size-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-brand-obsidian/95 backdrop-blur-xl border-border/50">
        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">Select Role Context</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => setActiveRole(role)}
            className="flex items-center gap-3 py-3 cursor-pointer"
          >
            <role.icon className={role.color + " size-4"} />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{role.name}</span>
              <span className="text-[10px] text-muted-foreground">Demo Perspective</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}