"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { DayPreferences } from "@/types"
import { storage } from "@/lib/storage"

interface DayPreferencesProps {
  preferences: DayPreferences
  onPreferencesChange: (preferences: DayPreferences) => void
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function DayPreferencesComponent({ preferences, onPreferencesChange }: DayPreferencesProps) {
  const toggleDay = (day: string) => {
    const updatedPreferences = {
      ...preferences,
      [day]: !preferences[day],
    }
    onPreferencesChange(updatedPreferences)
    storage.savePreferences(updatedPreferences)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Day Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center justify-between">
            <Label htmlFor={day}>{day}</Label>
            <Switch id={day} checked={preferences[day] ?? true} onCheckedChange={() => toggleDay(day)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
