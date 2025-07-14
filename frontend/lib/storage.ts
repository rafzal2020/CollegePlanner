import type { ClassInfo, DayPreferences, StudyTask } from "@/types"

const STORAGE_KEYS = {
  CLASSES: "college-planner-classes",
  PREFERENCES: "college-planner-preferences",
  TASKS: "college-planner-tasks",
} as const

export const storage = {
  // Classes
  saveClasses: (classes: ClassInfo[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes))
    }
  },

  loadClasses: (): ClassInfo[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLASSES)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  // Preferences
  savePreferences: (preferences: DayPreferences) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
    }
  },

  loadPreferences: (): DayPreferences => {
    if (typeof window === "undefined") {
      return {
        Sunday: true,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
      }
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return stored
        ? JSON.parse(stored)
        : {
            Sunday: true,
            Monday: true,
            Tuesday: true,
            Wednesday: true,
            Thursday: true,
            Friday: true,
            Saturday: false,
          }
    } catch {
      return {
        Sunday: true,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: false,
      }
    }
  },

  // Tasks (for local backup)
  saveTasks: (tasks: StudyTask[]) => {
    // Use StudyTask[] type
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    }
  },

  loadTasks: (): StudyTask[] => {
    // Use StudyTask[] type
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TASKS)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  // Clear all data (for testing)
  clearAll: () => {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    }
  },
}
