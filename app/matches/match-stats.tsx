import { GlassCard } from "@/components/dashboard/glass-card"
import { Users, Award, TrendingUp, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: string
  name: string
  volunteers_needed: number
  skills_required: string[]
}

interface MatchStatsProps {
  totalVolunteers: number
  matchedVolunteers: number
  highMatches: number
  mediumMatches: number
  lowMatches: number
  event: Event
}

export function MatchStats({
  totalVolunteers,
  matchedVolunteers,
  highMatches,
  mediumMatches,
  lowMatches,
  event,
}: MatchStatsProps) {
  const fillRate = event.volunteers_needed > 0 
    ? Math.min(Math.round((highMatches / event.volunteers_needed) * 100), 100)
    : 0

  return (
    <div className="grid grid-cols-4 gap-4">
      <GlassCard className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Total</span>
          <Users className="size-4 text-muted-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">{totalVolunteers}</span>
        <p className="text-xs text-muted-foreground">Volunteers</p>
      </GlassCard>

      <GlassCard className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Matched</span>
          <Target className="size-4 text-muted-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">{matchedVolunteers}</span>
        <p className="text-xs text-muted-foreground">With skills</p>
      </GlassCard>

      <GlassCard className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">High Match</span>
          <Award className="size-4 text-emerald-500" />
        </div>
        <span className="text-2xl font-bold text-emerald-600">{highMatches}</span>
        <p className="text-xs text-muted-foreground">Score 70%+</p>
      </GlassCard>

      <GlassCard className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">Fill Rate</span>
          <TrendingUp className="size-4 text-muted-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">{fillRate}%</span>
        <Progress value={fillRate} className="h-1.5 mt-1" />
      </GlassCard>
    </div>
  )
}
