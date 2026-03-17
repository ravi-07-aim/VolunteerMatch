"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, User } from "lucide-react"

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

interface VolunteerListProps {
  volunteers: Volunteer[]
}

export function VolunteerList({ volunteers }: VolunteerListProps) {
  if (volunteers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="size-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No volunteers registered yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Be the first to register and start making a difference!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
      {volunteers.map((volunteer) => (
        <div
          key={volunteer.id}
          className="p-4 rounded-2xl bg-muted/50 hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">
                  {volunteer.name?.charAt(0) ?? "V"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{volunteer.name}</h3>
                <p className="text-sm text-muted-foreground">{volunteer.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              {volunteer.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {volunteer.availability?.join(", ") || "Flexible"}
            </span>
          </div>

          {volunteer.bio && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{volunteer.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {volunteer.skills?.map((skill) => (
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
