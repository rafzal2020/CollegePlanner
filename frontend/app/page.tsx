"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import StudyCalendar from "@/components/study-calendar"
import FileUpload from "@/components/file-upload"
import ClassManager from "@/components/class-manager"
import DayPreferencesComponent from "@/components/day-preferences"
import type { StudyTask, ClassInfo, DayPreferences, UploadResponse } from "@/types"
import { storage } from "@/lib/storage"

export default function Home() {
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [dayPreferences, setDayPreferences] = useState<DayPreferences>({
    Sunday: true,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  // Load initial data from localStorage
  useEffect(() => {
    const savedClasses = storage.loadClasses()
    const savedPreferences = storage.loadPreferences()
    const savedTasks = storage.loadTasks()

    setClasses(savedClasses)
    setDayPreferences(savedPreferences)
    setTasks(savedTasks) // Set initial tasks from local storage

    setIsLoaded(true)
  }, [])

  // Fetch tasks from backend after initial local data is loaded and classes are available
  useEffect(() => {
    if (isLoaded) {
      loadTasksFromServer()
    }
  }, [isLoaded, classes]) // Re-run if classes change, to ensure className can be resolved

  const loadTasksFromServer = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`)
      const result: UploadResponse = await res.json()
      if (result.plan) {
        // Enrich tasks from backend with className using current classes state
        const enrichedTasks: StudyTask[] = result.plan.map((task) => {
          const classInfo = classes.find((c) => c.id === task.classId)
          return {
            ...task,
            className: classInfo ? classInfo.name : "Unknown Class", // Default if class not found
          }
        })
        setTasks(enrichedTasks)
        storage.saveTasks(enrichedTasks) // Save the enriched tasks to local storage
      }
    } catch (error) {
      console.error("Failed to load existing tasks from server:", error)
      toast({
        title: "Server Load Error",
        description: "Could not load tasks from the backend. Displaying local data.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async (files: FileList, classId: string) => {
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })
      formData.append("class_id", classId) // Send classId to backend

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      const result: UploadResponse = await res.json()

      if (result.error) {
        toast({
          title: "Upload Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      if (result.plan) {
        // Tasks from backend now include classId. Enrich with className for frontend display.
        const tasksWithClass: StudyTask[] = result.plan.map((task) => {
          const classInfo = classes.find((c) => c.id === task.classId)
          return {
            ...task,
            className: classInfo ? classInfo.name : "Unknown Class",
          }
        })

        setTasks(tasksWithClass)
        storage.saveTasks(tasksWithClass) // Save the fully enriched tasks to local storage

        toast({
          title: "Upload Successful",
          description: `Added ${result.plan.length} tasks to your study plan.`,
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }


  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">College Study Planner</h1>
        <p className="text-muted-foreground">Upload your course documents and create an organized study schedule</p>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <StudyCalendar tasks={tasks} classes={classes} dayPreferences={dayPreferences} />
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <FileUpload classes={classes} onUpload={handleUpload} isUploading={isUploading} />

          {tasks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Current Study Plan</h3>
              <div className="text-sm text-muted-foreground">{tasks.length} tasks scheduled across your classes</div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <ClassManager classes={classes} onClassesChange={setClasses} />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <DayPreferencesComponent preferences={dayPreferences} onPreferencesChange={setDayPreferences} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
