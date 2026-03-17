"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Users, Building2 } from "lucide-react"
import Link from "next/link"

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

interface EventListProps {
  events: Event[]
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="size-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No events posted yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first event to start finding volunteers!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 rounded-2xl bg-muted/50 hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.organization}</p>
              </div>
            </div>
            <Link href={`/matches?event=${event.id}`}>
              <Button size="sm" variant="outline" className="rounded-xl">
                Find Matches
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {new Date(event.event_date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {event.volunteers_needed} volunteers needed
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {event.skills_required?.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
