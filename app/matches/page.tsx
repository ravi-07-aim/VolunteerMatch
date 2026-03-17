import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Header } from "@/components/dashboard/header"
import { GlassCard } from "@/components/dashboard/glass-card"
import { MatchResults } from "./match-results"
import { EventSelector } from "./event-selector"
import { MatchStats } from "./match-stats"
import { Sparkles } from "lucide-react"

interface SearchParams {
  event?: string
}

interface Volunteer {
  id: string
  name: string
  email: string
  location: string
  skills: string[]
  availability: string[]
  bio?: string
  created_at: string
}

interface Event {
  id: string
  name: string
  organization: string
  location: string
  event_date: string
  skills_required: string[]
  description?: string
  volunteers_needed: number
  created_at: string
}

interface MatchedVolunteer extends Volunteer {
  matchScore: number
  matchingSkills: string[]
  locationMatch: boolean
}

function calculateMatchScore(volunteer: Volunteer, event: Event): { score: number; matchingSkills: string[]; locationMatch: boolean } {
  const volunteerSkills = volunteer.skills || []
  const requiredSkills = event.skills_required || []
  
  if (requiredSkills.length === 0) {
    return { score: 50, matchingSkills: [], locationMatch: false }
  }

  const matchingSkills = volunteerSkills.filter(skill => 
    requiredSkills.includes(skill)
  )

  // Calculate skill match percentage (70% weight)
  const skillScore = (matchingSkills.length / requiredSkills.length) * 70

  // Location bonus (20% weight)
  const volunteerLoc = volunteer.location?.toLowerCase() || ""
  const eventLoc = event.location?.toLowerCase() || ""
  const locationMatch = volunteerLoc.includes(eventLoc) || eventLoc.includes(volunteerLoc)
  const locationScore = locationMatch ? 20 : 0

  // Availability bonus (10% weight)
  const availabilityScore = (volunteer.availability?.length || 0) > 0 ? 10 : 0

  const totalScore = Math.min(Math.round(skillScore + locationScore + availabilityScore), 100)

  return { score: totalScore, matchingSkills, locationMatch }
}

async function getEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
  return (data ?? []) as Event[]
}

async function getVolunteers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("volunteers")
    .select("*")
  return (data ?? []) as Volunteer[]
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const selectedEventId = params.event
  
  const [events, volunteers] = await Promise.all([
    getEvents(),
    getVolunteers(),
  ])

  const selectedEvent = selectedEventId 
    ? events.find(e => e.id === selectedEventId) 
    : null

  // Calculate matches for the selected event
  let matchedVolunteers: MatchedVolunteer[] = []
  
  if (selectedEvent) {
    matchedVolunteers = volunteers
      .map(volunteer => {
        const { score, matchingSkills, locationMatch } = calculateMatchScore(volunteer, selectedEvent)
        return {
          ...volunteer,
          matchScore: score,
          matchingSkills,
          locationMatch,
        }
      })
      .filter(v => v.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const highMatches = matchedVolunteers.filter(v => v.matchScore >= 70).length
  const mediumMatches = matchedVolunteers.filter(v => v.matchScore >= 40 && v.matchScore < 70).length
  const lowMatches = matchedVolunteers.filter(v => v.matchScore < 40).length

  return (
    <DashboardLayout>
      <Header title="Volunteer Matching" />

      <div className="grid grid-cols-3 gap-6">
        {/* Event Selector Sidebar */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Select Event</h2>
              <p className="text-xs text-muted-foreground">Choose to find matches</p>
            </div>
          </div>
          <EventSelector events={events} selectedEventId={selectedEventId} />
        </GlassCard>

        {/* Main Content */}
        <div className="col-span-2 flex flex-col gap-6">
          {selectedEvent ? (
            <>
              {/* Match Statistics */}
              <MatchStats 
                totalVolunteers={volunteers.length}
                matchedVolunteers={matchedVolunteers.length}
                highMatches={highMatches}
                mediumMatches={mediumMatches}
                lowMatches={lowMatches}
                event={selectedEvent}
              />

              {/* Match Results */}
              <GlassCard>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Best Matches for "{selectedEvent.name}"
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Volunteers ranked by skills match, location, and availability
                </p>
                <MatchResults 
                  matches={matchedVolunteers} 
                  event={selectedEvent}
                />
              </GlassCard>
            </>
          ) : (
            <GlassCard className="flex-1">
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <Sparkles className="size-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select an Event</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose an event from the list to see matching volunteers ranked by their skills, location, and availability.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
