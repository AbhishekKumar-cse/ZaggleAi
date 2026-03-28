"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PersistentAIChat } from "@/components/persistent-ai-chat"
import { RoleSelector } from "@/components/role-selector"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-brand-obsidian text-slate-100 overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-auto bg-brand-obsidian">
          <header className="h-16 flex items-center justify-between px-8 border-b border-border/30 bg-brand-obsidian/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
                <span className="text-xs font-medium text-primary uppercase tracking-widest">System Active</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <RoleSelector />
              <div className="h-4 w-px bg-border/50" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">CFO User</span>
                  <span className="text-[10px] uppercase text-primary font-bold">Chief Financial Officer</span>
                </div>
                <div className="size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">CU</span>
                </div>
              </div>
            </div>
          </header>
          <main className="p-8 pb-24">
            {children}
          </main>
          <PersistentAIChat />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}