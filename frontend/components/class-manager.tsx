"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import type { ClassInfo } from "@/types"
import { getRandomColor } from "@/lib/colors"
import { storage } from "@/lib/storage"

interface ClassManagerProps {
  classes: ClassInfo[]
  onClassesChange: (classes: ClassInfo[]) => void
}

export default function ClassManager({ classes, onClassesChange }: ClassManagerProps) {
  const [newClassName, setNewClassName] = useState("")

  const addClass = () => {
    if (!newClassName.trim()) return

    const newClass: ClassInfo = {
      id: Date.now().toString(),
      name: newClassName.trim(),
      color: getRandomColor(),
    }

    const updatedClasses = [...classes, newClass]
    onClassesChange(updatedClasses)
    storage.saveClasses(updatedClasses)
    setNewClassName("")
  }

  const removeClass = (classId: string) => {
    const updatedClasses = classes.filter((c) => c.id !== classId)
    onClassesChange(updatedClasses)
    storage.saveClasses(updatedClasses)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addClass()}
          />
          <Button onClick={addClass} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {classes.map((classInfo) => (
            <div key={classInfo.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: classInfo.color }} />
                <span>{classInfo.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeClass(classInfo.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
