"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, File, X } from "lucide-react"
import type { ClassInfo } from "@/types"

interface FileUploadProps {
  classes: ClassInfo[]
  onUpload: (files: FileList, classId: string) => Promise<void>
  isUploading: boolean
}

interface FileWithClass {
  file: File
  classId: string
}

export default function FileUpload({ classes, onUpload, isUploading }: FileUploadProps) {
  const [filesWithClasses, setFilesWithClasses] = useState<FileWithClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedClassId) return

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      classId: selectedClassId,
    }))

    setFilesWithClasses((prev) => [...prev, ...newFiles])
    e.target.value = "" // Reset input
  }

  const removeFile = (index: number) => {
    setFilesWithClasses((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (filesWithClasses.length === 0) return

    // Group files by class
    const filesByClass = filesWithClasses.reduce(
      (acc, { file, classId }) => {
        if (!acc[classId]) acc[classId] = []
        acc[classId].push(file)
        return acc
      },
      {} as Record<string, File[]>,
    )

    // Upload files for each class separately
    for (const [classId, files] of Object.entries(filesByClass)) {
      const fileList = new DataTransfer()
      files.forEach((file) => fileList.items.add(file))
      await onUpload(fileList.files, classId)
    }

    setFilesWithClasses([])
  }

  const getClassInfo = (classId: string) => {
    return classes.find((c) => c.id === classId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Course Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classInfo) => (
                <SelectItem key={classInfo.id} value={classInfo.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classInfo.color }} />
                    {classInfo.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={!selectedClassId}
            />
            <Button variant="outline" disabled={!selectedClassId} asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Add Files
              </span>
            </Button>
          </label>
        </div>

        {filesWithClasses.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Files to Upload:</h3>
            {filesWithClasses.map((fileWithClass, index) => {
              const classInfo = getClassInfo(fileWithClass.classId)
              return (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <span className="text-sm">{fileWithClass.file.name}</span>
                    {classInfo && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: classInfo.color }} />
                        <span className="text-xs text-muted-foreground">{classInfo.name}</span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}

            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
              {isUploading ? "Uploading..." : `Upload ${filesWithClasses.length} file(s)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
