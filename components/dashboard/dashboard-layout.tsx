"use client"

import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 size-96 rounded-full bg-gradient-to-br from-muted/40 to-transparent blur-3xl" />
        <div className="absolute bottom-20 left-80 size-80 rounded-full bg-gradient-to-tr from-muted/30 to-transparent blur-3xl" />
      </div>
      
      <Sidebar />
      
      <main className="ml-80 p-6 min-h-screen">
        {children}
      </main>
    </div>
  )
}
