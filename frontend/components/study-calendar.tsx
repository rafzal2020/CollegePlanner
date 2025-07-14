"use client"

import { useState, useMemo } from "react"
import Calendar from "react-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StudyTask, ClassInfo, DayPreferences } from "@/types"
import "react-calendar/dist/Calendar.css"

interface StudyCalendarProps {
  tasks: StudyTask[]
  classes: ClassInfo[]
  dayPreferences: DayPreferences
}

export default function StudyCalendar({ tasks, classes, dayPreferences }: StudyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Filter tasks based on day preferences
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date)
      const dayName = taskDate.toLocaleDateString("en-US", { weekday: "long" })
      return dayPreferences[dayName] !== false
    })
  }, [tasks, dayPreferences])

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0]
    return filteredTasks.filter((task) => task.date === dateStr)
  }, [filteredTasks, selectedDate])

  // Get class info for a task
  const getClassInfo = (task: StudyTask) => {
    return classes.find((c) => c.id === task.classId)
  }

  // Custom tile content to show task indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null

    const dateStr = date.toISOString().split("T")[0]
    const dayTasks = filteredTasks.filter((task) => task.date === dateStr)

    if (dayTasks.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {dayTasks.slice(0, 3).map((task, index) => {
          const classInfo = getClassInfo(task)
          return (
            <div
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: classInfo?.color || "#6b7280",
              }}
            />
          )
        })}
        {dayTasks.length > 3 && <div className="text-xs text-muted-foreground">+{dayTasks.length - 3}</div>}
      </div>
    )
  }

  // Custom tile class name for disabled days
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return ""

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" })
    const isDisabled = dayPreferences[dayName] === false

    return isDisabled ? "disabled-day" : ""
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <style jsx global>{`
              .react-calendar {
                width: 100%;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-family: inherit;
              }
              .react-calendar__tile {
                max-width: 100%;
                padding: 10px 6px;
                background: none;
                text-align: center;
                line-height: 16px;
                font: inherit;
                font-size: 0.875rem;
                border: none;
                cursor: pointer;
                position: relative;
                min-height: 60px;
              }
              .react-calendar__tile:enabled:hover,
              .react-calendar__tile:enabled:focus {
                background-color: #f1f5f9;
              }
              .react-calendar__tile--active {
                background: #3b82f6 !important;
                color: white;
              }
              .react-calendar__tile--now {
                background: #fef3c7;
              }
              .disabled-day {
                background-color: #f8fafc !important;
                color: #cbd5e1 !important;
                cursor: not-allowed !important;
              }
              .disabled-day:hover {
                background-color: #f8fafc !important;
              }
            `}</style>
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Tasks for {selectedDate.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <p className="text-muted-foreground">No tasks scheduled for this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task, index) => {
                  const classInfo = getClassInfo(task)
                  return (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm flex-1">{task.task}</p>
                        {classInfo && (
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: `${classInfo.color}20`,
                              color: classInfo.color,
                              borderColor: classInfo.color,
                            }}
                          >
                            {classInfo.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
