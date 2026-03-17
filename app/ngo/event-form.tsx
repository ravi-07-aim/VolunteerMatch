"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const SKILL_OPTIONS = [
  "Teaching", "Healthcare", "Technology", "Construction",
  "Cooking", "Driving", "Photography", "Event Planning",
  "Counseling", "First Aid", "Translation", "Marketing"
]

export function EventForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [organization, setOrganization] = useState("")
  const [location, setLocation] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [volunteersNeeded, setVolunteersNeeded] = useState("")

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Log the payload so you can see exactly what is being sent
    const payload = {
      event_name: name,
      organization_name: organization,
      location: location,
      event_date: eventDate,
      skills_required: selectedSkills,
      description: description || "",
      volunteers_needed: parseInt(volunteersNeeded) || 1,
    }

    console.log("🚀 Sending Payload to Supabase:");
    console.table(payload);

    try {
      const supabase = createClient()

      const { error } = await supabase.from("events").insert([payload])

      if (error) {
        // This UNMASKS the "Object" error
        console.error("❌ Supabase Error:", error.message);
        console.error("🔍 Details:", error.details);
        alert(`DB Error: ${error.message}\n\nHint: ${error.hint || 'Check if all fields are filled'}`);
        return
      }

      // Success Path
      setName(""); setOrganization(""); setLocation("");
      setEventDate(""); setSelectedSkills([]);
      setDescription(""); setVolunteersNeeded("");

      router.refresh()
      alert("✅ Event Posted Successfully!")
    } catch (err) {
      console.error("System Exception:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-card p-6 rounded-2xl border shadow-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Beach Cleanup"
          required
          className="rounded-xl"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="organization">Organization Name</Label>
        <Input
          id="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          placeholder="e.g. Green Earth NGO"
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
          placeholder="City or Address"
          required
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
          <Input
            id="volunteersNeeded"
            type="number"
            min="1"
            value={volunteersNeeded}
            onChange={(e) => setVolunteersNeeded(e.target.value)}
            placeholder="Qty"
            required
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Skills Required (Select at least one)</Label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer transition-all py-1.5 px-3 rounded-lg"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
              {selectedSkills.includes(skill) && <X className="size-3 ml-1" />}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details about the volunteer work..."
          className="rounded-xl resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 text-lg rounded-xl font-bold">
        {loading ? <Spinner className="mr-2" /> : "Post Event"}
      </Button>
    </form>
  )
}