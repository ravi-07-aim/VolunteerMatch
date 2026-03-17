"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { X, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const SKILL_OPTIONS = [
  "Teaching",
  "Healthcare",
  "Technology",
  "Construction",
  "Cooking",
  "Driving",
  "Photography",
  "Event Planning",
  "Counseling",
  "First Aid",
  "Translation",
  "Marketing",
]

const AVAILABILITY_OPTIONS = [
  "Weekdays",
  "Weekends",
  "Mornings",
  "Afternoons",
  "Evenings",
  "Full-time",
]

export function VolunteerForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [bio, setBio] = useState("")

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const toggleAvailability = (availability: string) => {
    setSelectedAvailability((prev) =>
      prev.includes(availability)
        ? prev.filter((a) => a !== availability)
        : [...prev, availability]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("volunteers").insert({
        name,
        email,
        location,
        skills: selectedSkills,
        availability: selectedAvailability,
        bio,
      })

      if (error) throw error

      setName("")
      setEmail("")
      setLocation("")
      setSelectedSkills([])
      setSelectedAvailability([])
      setBio("")
      router.refresh()
    } catch (error) {
      console.error("Error registering volunteer:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          required
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
          required
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
              {selectedSkills.includes(skill) && <X className="size-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Availability</Label>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((availability) => (
            <Badge
              key={availability}
              variant={selectedAvailability.includes(availability) ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleAvailability(availability)}
            >
              {availability}
              {selectedAvailability.includes(availability) && <X className="size-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio (Optional)</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="rounded-xl resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2 rounded-xl">
        {loading ? <Spinner className="size-4" /> : "Register as Volunteer"}
      </Button>
    </form>
  )
}
