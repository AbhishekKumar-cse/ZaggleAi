"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Wallet,
  ShieldCheck,
  Bot,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Spend Intelligence", href: "/spend", icon: CreditCard },
  { name: "FP&A Engine", href: "/fpa", icon: BarChart3 },
  { name: "Treasury", href: "/treasury", icon: Wallet },
  { name: "Compliance", href: "/compliance", icon: ShieldCheck },
  { name: "AI Agent Console", href: "/agents", icon: Bot },
  { name: "Intelligence Hub", href: "/reports", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-brand-obsidian">
      <SidebarHeader className="h-16 flex items-center px-4 justify-between border-b border-border/50">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="size-8 rounded bg-primary flex items-center justify-center">
            <Sparkles className="size-5 text-brand-obsidian fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg tracking-tight text-white">CFO-OS</span>
            <span className="text-[10px] uppercase tracking-widest text-primary/80 -mt-1 font-medium">by ZaggLeAI</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  "flex items-center gap-3 h-11 transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="size-5 shrink-0" />
                  <span className="font-headline font-medium text-sm group-data-[collapsible=icon]:hidden">
                    {item.name}
                  </span>
                  {pathname === item.href && (
                    <ChevronRight className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11 text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <Settings className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium text-sm">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium text-sm">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}