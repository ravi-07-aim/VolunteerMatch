import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { GlassCard } from "@/components/dashboard/glass-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Users, Building2, Calendar, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getStats() {
  const supabase = await createClient()
  
  const [volunteersResult, eventsResult, matchesResult] = await Promise.all([
    supabase.from("volunteers").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("matches").select("*", { count: "exact", head: true }),
  ])

  return {
    volunteers: volunteersResult.count ?? 0,
    events: eventsResult.count ?? 0,
    matches: matchesResult.count ?? 0,
  }
}

async function getRecentEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  return data ?? []
}

async function getRecentVolunteers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function HomePage() {
  const stats = await getStats()
  const recentEvents = await getRecentEvents()
  const recentVolunteers = await getRecentVolunteers()

  return (
    <DashboardLayout>
      <Header title="Dashboard" />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Volunteers"
          value={stats.volunteers}
          change="+12%"
          changeType="positive"
          icon={<Users className="size-5" />}
        />
        <StatsCard
          title="Active Events"
          value={stats.events}
          change="+8%"
          changeType="positive"
          icon={<Calendar className="size-5" />}
        />
        <StatsCard
          title="NGO Partners"
          value={stats.events > 0 ? Math.ceil(stats.events / 2) : 0}
          change="+5%"
          changeType="positive"
          icon={<Building2 className="size-5" />}
        />
        <StatsCard
          title="Successful Matches"
          value={stats.matches}
          change="+24%"
          changeType="positive"
          icon={<TrendingUp className="size-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Events */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Events</h2>
            <Link href="/ngo">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          
          {recentEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No events yet</p>
              <Link href="/ngo">
                <Button>Create First Event</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="size-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {new Date(event.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.skills_required?.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Recent Volunteers */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Team</h2>
            <Link href="/volunteer">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          {recentVolunteers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="size-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">No volunteers yet</p>
              <Link href="/volunteer">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentVolunteers.map((volunteer) => (
                <div key={volunteer.id} className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-medium text-sm">
                      {volunteer.name?.charAt(0) ?? "V"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{volunteer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {volunteer.skills?.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        <GlassCard>
          <h2 className="text-lg font-semibold text-foreground mb-4">Volunteer Registration</h2>
          <p className="text-muted-foreground mb-6">
            Register as a volunteer and get matched with events that fit your skills and availability.
          </p>
          <Link href="/volunteer">
            <Button className="w-full">Register as Volunteer</Button>
          </Link>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold text-foreground mb-4">Post an Event</h2>
          <p className="text-muted-foreground mb-6">
            Create an event and find volunteers with the skills you need for your organization.
          </p>
          <Link href="/ngo">
            <Button className="w-full">Create Event</Button>
          </Link>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
