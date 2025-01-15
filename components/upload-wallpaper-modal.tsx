"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploader } from "./file-uploader"
import { toast } from "@/components/ui/use-toast"

interface UploadedFile {
  id: string
  name: string
  url: string
  type: string
}

interface WallpaperData {
  id?: string
  name: string
  files: UploadedFile[]
}

interface UploadWallpaperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: WallpaperData
  mode?: 'create' | 'edit'
}

export function UploadWallpaperModal({
  open,
  onOpenChange,
  initialData,
  mode = 'create'
}: UploadWallpaperModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [wallpaperName, setWallpaperName] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    files?: string
  }>({})

  useEffect(() => {
    if (initialData) {
      setWallpaperName(initialData.name)
      setFiles(initialData.files)
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: typeof errors = {}
    let isValid = true

    if (!wallpaperName.trim()) {
      newErrors.name = "请输入壁纸名称"
      isValid = false
    }

    if (files.length === 0) {
      newErrors.files = "请上传至少一个文件"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallpaperName(e.target.value)
    if (e.target.value.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }))
    }
  }

  const handleUpload = () => {
    if (!validateForm()) {
      return
    }

    // 这里实现实际的上传或更新逻辑
    console.log(mode === 'create' ? "Creating:" : "Updating:", { 
      id: initialData?.id,
      name: wallpaperName, 
      files 
    })
    
    toast({
      description: mode === 'create' ? "上传成功！" : "更新成功！",
    })
    onOpenChange(false)
    setFiles([])
    setWallpaperName("")
    setErrors({})
  }

  const removeFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId))
    if (files.length <= 1) {
      setErrors(prev => ({ ...prev, files: "请上传至少一个文件" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? '新增壁纸' : '修改壁纸'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                壁纸名称
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={wallpaperName}
                onChange={handleNameChange}
                placeholder="请输入壁纸名称"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                上传文件
                <span className="text-red-500">*</span>
              </Label>
              <FileUploader
                onFilesAdded={(newFiles) => {
                  setFiles((prev) => [...prev, ...newFiles])
                  setErrors(prev => ({ ...prev, files: undefined }))
                }}
                existingFiles={files}
              />
              {errors.files && (
                <p className="text-sm text-red-500">{errors.files}</p>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>已上传文件</Label>
                <div className="grid grid-cols-2 gap-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="relative group rounded-lg border p-2 hover:bg-accent aspect-[9/16]"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full aspect-[9/16] object-cover rounded"
                        />
                      ) : (
                        <video
                          src={file.url}
                          className="w-full h-full aspect-[9/16] object-cover rounded"
                        />
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 py-4 border-t mt-auto bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleUpload}>
            {mode === 'create' ? '上传' : '保存'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

