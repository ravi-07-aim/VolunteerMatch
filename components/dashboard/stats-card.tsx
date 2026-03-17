import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
}

export function StatsCard({ title, value, change, changeType = "neutral", icon }: StatsCardProps) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {change && (
          <span
            className={cn(
              "text-sm font-medium pb-1",
              changeType === "positive" && "text-emerald-600",
              changeType === "negative" && "text-red-500",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </GlassCard>
  )
}
