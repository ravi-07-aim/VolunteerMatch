"use client"

import { useRouter } from "next/navigation"
import { Calendar, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  name: string
  organization: string
  location: string
  event_date: string
  skills_required: string[]
  volunteers_needed: number
}

interface EventSelectorProps {
  events: Event[]
  selectedEventId?: string
}

export function EventSelector({ events, selectedEventId }: EventSelectorProps) {
  const router = useRouter()

  const handleSelect = (eventId: string) => {
    router.push(`/matches?event=${eventId}`)
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="size-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No events available</p>
        <p className="text-xs text-muted-foreground mt-1">
          Create an event first to find matches
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
      {events.map((event) => (
        <button
          key={event.id}
          onClick={() => handleSelect(event.id)}
          className={cn(
            "w-full text-left p-4 rounded-xl transition-all",
            selectedEventId === event.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 hover:bg-muted text-foreground"
          )}
        >
          <h3 className="font-medium mb-1 truncate">{event.name}</h3>
          <p className={cn(
            "text-xs mb-2 truncate",
            selectedEventId === event.id ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {event.organization}
          </p>
          
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {event.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {event.volunteers_needed}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
