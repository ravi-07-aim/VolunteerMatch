import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
