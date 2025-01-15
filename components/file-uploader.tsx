"use client"

import { useCallback } from "react"
import { Upload } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface FileUploaderProps {
  onFilesAdded: (files: Array<{ id: string; name: string; url: string; type: string }>) => void
  existingFiles?: Array<{ name: string; type: string }>
}

export function FileUploader({ onFilesAdded, existingFiles = [] }: FileUploaderProps) {
  const isDuplicateFile = (file: File) => {
    return existingFiles.some(
      existingFile => 
        existingFile.name === file.name && 
        existingFile.type === file.type
    )
  }

  const handleFiles = useCallback(
    (files: File[]) => {
      const validFiles = files.filter(file => {
        // 检查文件类型
        const isValid = 
          file.type.startsWith('image/jpeg') || 
          file.type.startsWith('image/png') || 
          file.type.startsWith('video/mp4')
        
        if (!isValid) {
          toast({
            variant: "destructive",
            description: `不支持的文件类型: ${file.type}`,
          })
          return false
        }

        // 检查重复文件
        if (isDuplicateFile(file)) {
          toast({
            variant: "destructive",
            description: `文件 ${file.name} 已存在`,
          })
          return false
        }

        return true
      })

      if (validFiles.length > 0) {
        const processedFiles = validFiles.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type
        }))

        onFilesAdded(processedFiles)
      }
    },
    [onFilesAdded, existingFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [handleFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      handleFiles(files)
    },
    [handleFiles]
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            拖拽文件到此处，或者{" "}
            <label className="cursor-pointer text-primary hover:underline">
              点击上传
              <input
                type="file"
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.mp4"
                onChange={handleFileInput}
              />
            </label>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            支持 JPG、PNG、MP4 格式
          </p>
        </div>
      </div>
    </div>
  )
}

