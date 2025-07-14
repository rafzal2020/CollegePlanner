export interface StudyTask {
  date: string
  task: string
  classId: string // Made classId required
  className?: string
}

export interface ClassInfo {
  id: string
  name: string
  color: string
}

export interface DayPreferences {
  [key: string]: boolean // day name -> enabled
}

export interface UploadResponse {
  plan: StudyTask[]
  error?: string
}
