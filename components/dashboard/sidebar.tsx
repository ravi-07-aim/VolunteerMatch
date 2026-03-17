"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Building2, BarChart3, Settings, Calendar } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/volunteer", label: "Volunteer", icon: Users },
  { href: "/ngo", label: "NGO / Events", icon: Building2 },
  { href: "/matches", label: "Matches", icon: BarChart3 },
  { href: "/schedule", label: "Schedule", icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-64 rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">V</span>
        </div>
        <span className="font-semibold text-lg text-foreground">VolunteerMatch</span>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="pt-4 border-t border-border/50">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
        >
          <Settings className="size-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  )
}
