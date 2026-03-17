import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { GlassCard } from "@/components/dashboard/glass-card"
import { EventForm } from "./event-form"
import { EventList } from "./event-list"

async function getEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
  return data ?? []
}

export default async function NGOPage() {
  const events = await getEvents()

  return (
    <DashboardLayout>
      <Header title="NGO / Events" />

      <div className="grid grid-cols-5 gap-6">
        {/* Event Creation Form */}
        <GlassCard className="col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-6">Post New Event</h2>
          <EventForm />
        </GlassCard>

        {/* Events List */}
        <GlassCard className="col-span-3">
          <h2 className="text-lg font-semibold text-foreground mb-6">Posted Events</h2>
          <EventList events={events} />
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
