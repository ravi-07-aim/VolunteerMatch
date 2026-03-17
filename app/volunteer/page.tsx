import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { GlassCard } from "@/components/dashboard/glass-card"
import { VolunteerForm } from "./volunteer-form"
import { VolunteerList } from "./volunteer-list"

async function getVolunteers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("volunteers")
    .select("*")
    .order("created_at", { ascending: false })
  return data ?? []
}

export default async function VolunteerPage() {
  const volunteers = await getVolunteers()

  return (
    <DashboardLayout>
      <Header title="Volunteer Registration" />

      <div className="grid grid-cols-5 gap-6">
        {/* Registration Form */}
        <GlassCard className="col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-6">Register as Volunteer</h2>
          <VolunteerForm />
        </GlassCard>

        {/* Volunteers List */}
        <GlassCard className="col-span-3">
          <h2 className="text-lg font-semibold text-foreground mb-6">Registered Volunteers</h2>
          <VolunteerList volunteers={volunteers} />
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
