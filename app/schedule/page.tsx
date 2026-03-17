import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

interface Match {
  id: string
  event_id: string
  volunteer_id: string
  match_score: number
  status: string
  created_at: string
  events: {
    name: string
    organization: string
    location: string
    event_date: string
    skills_required: string[]
  }
  volunteers: {
    name: string
    email: string
  }
}

async function getConfirmedMatches() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("matches")
    .select(`
      *,
      events (*),
      volunteers (*)
    `)
    .order("created_at", { ascending: false })
  return (data ?? []) as unknown as Match[]
}

export default async function SchedulePage() {
  const matches = await getConfirmedMatches()

  // Group matches by event
  const eventGroups = matches.reduce((acc, match) => {
    const eventId = match.event_id
    if (!acc[eventId]) {
      acc[eventId] = {
        event: match.events,
        volunteers: [],
      }
    }
    acc[eventId].volunteers.push({
      ...match.volunteers,
      matchScore: match.match_score,
      status: match.status,
    })
    return acc
  }, {} as Record<string, { event: Match["events"]; volunteers: any[] }>)

  return (
    <DashboardLayout>
      <Header title="Schedule" />

      <div className="grid grid-cols-4 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Events</span>
          </div>
          <span className="text-3xl font-bold text-foreground">
            {Object.keys(eventGroups).length}
          </span>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Users className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Matches</span>
          </div>
          <span className="text-3xl font-bold text-foreground">{matches.length}</span>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <Clock className="size-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <span className="text-3xl font-bold text-foreground">
            {matches.filter((m) => m.status === "pending").length}
          </span>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-5 rounded-full bg-emerald-500" />
            <span className="text-sm text-muted-foreground">Confirmed</span>
          </div>
          <span className="text-3xl font-bold text-foreground">
            {matches.filter((m) => m.status === "confirmed").length}
          </span>
        </GlassCard>
      </div>

      {Object.keys(eventGroups).length === 0 ? (
        <GlassCard>
          <div className="text-center py-12">
            <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No scheduled matches yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Go to Matches page to assign volunteers to events
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(eventGroups).map(([eventId, { event, volunteers }]) => (
            <GlassCard key={eventId}>
              <div className="flex items-start gap-4 mb-4">
                <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="size-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.organization}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {event.location}
                    </span>
                    <span>
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Assigned Volunteers ({volunteers.length})
                </h4>
                <div className="flex flex-col gap-3">
                  {volunteers.map((volunteer, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-medium text-sm">
                            {volunteer.name?.charAt(0) ?? "V"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{volunteer.name}</p>
                          <p className="text-xs text-muted-foreground">{volunteer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {volunteer.matchScore}% match
                        </Badge>
                        <Badge
                          variant={volunteer.status === "confirmed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {volunteer.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
