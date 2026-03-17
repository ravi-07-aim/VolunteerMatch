"use client"

import { Search, Bell, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Type searching..." 
            className="pl-10 w-64 rounded-full bg-card/80 backdrop-blur-sm border-border/50"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full bg-card/80 backdrop-blur-sm">
          <Bell className="size-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full bg-card/80 backdrop-blur-sm">
          <MessageSquare className="size-5" />
        </Button>
        
        <div className="size-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-medium">U</span>
        </div>
      </div>
    </header>
  )
}
