"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { MapPin, Check, Users, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  name: string
  organization: string
  location: string
  event_date: string
  skills_required: string[]
  volunteers_needed: number
}

interface MatchedVolunteer {
  id: string
  name: string
  email: string
  location: string
  skills: string[]
  availability: string[]
  bio?: string
  matchScore: number
  matchingSkills: string[]
  locationMatch: boolean
}

interface MatchResultsProps {
  matches: MatchedVolunteer[]
  event: Event | null
}

export function MatchResults({ matches, event }: MatchResultsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggleSelection = (volunteerId: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(volunteerId)) {
      newSelected.delete(volunteerId)
    } else {
      newSelected.add(volunteerId)
    }
    setSelected(newSelected)
  }

  const handleConfirmMatches = async () => {
    if (!event || selected.size === 0) return
    setLoading("confirming")

    try {
      const supabase = createClient()
      
      const matchesToInsert = Array.from(selected).map((volunteerId) => {
        const volunteer = matches.find((m) => m.id === volunteerId)
        return {
          event_id: event.id,
          volunteer_id: volunteerId,
          match_score: volunteer?.matchScore ?? 0,
          status: "pending",
        }
      })

      const { error } = await supabase.from("matches").insert(matchesToInsert)
      if (error) throw error

      setSelected(new Set())
      router.refresh()
    } catch (error) {
      console.error("Error confirming matches:", error)
    } finally {
      setLoading(null)
    }
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <Users className="size-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Select an event to see matched volunteers</p>
        <p className="text-sm text-muted-foreground mt-2">
          Our algorithm will rank volunteers based on skills and location
        </p>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="size-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No volunteers available yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Volunteers will appear here once they register
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {selected.size > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium">
            {selected.size} volunteer{selected.size > 1 ? "s" : ""} selected
          </span>
          <Button
            onClick={handleConfirmMatches}
            disabled={loading === "confirming"}
            size="sm"
          >
            {loading === "confirming" ? (
              <Spinner className="size-4" />
            ) : (
              "Confirm Matches"
            )}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
        {matches.map((volunteer, index) => (
          <div
            key={volunteer.id}
            className={`p-4 rounded-2xl transition-all cursor-pointer ${
              selected.has(volunteer.id)
                ? "bg-primary/10 border border-primary/30"
                : "bg-muted/50 hover:bg-muted/70"
            }`}
            onClick={() => toggleSelection(volunteer.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {volunteer.name?.charAt(0) ?? "V"}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Star className="size-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{volunteer.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    {volunteer.location}
                    {volunteer.locationMatch && (
                      <Check className="size-3 text-emerald-500" />
                    )}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-foreground">
                    {volunteer.matchScore}%
                  </span>
                </div>
                <Progress value={volunteer.matchScore} className="w-20 h-2" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {volunteer.skills?.map((skill) => (
                <Badge
                  key={skill}
                  variant={volunteer.matchingSkills.includes(skill) ? "default" : "secondary"}
                  className="text-xs"
                >
                  {skill}
                  {volunteer.matchingSkills.includes(skill) && (
                    <Check className="size-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
