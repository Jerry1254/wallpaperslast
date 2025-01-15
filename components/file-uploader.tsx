"use client"

import { useCallback, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

interface FileUploadProgress {
  id: string
  name: string
  progress: number
  status: 'uploading' | 'error' | 'success'
  error?: string
}

interface FileUploaderProps {
  onUpload: (file: {
    id: string
    name: string
    url: string
    type: string
    thumbnail?: string
  }) => void
  maxSize?: number // in MB
  accept?: Record<string, string[]>
}

export function FileUploader({ onUpload, maxSize = 100, accept }: FileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgress>>({})

  const createThumbnail = async (file: File): Promise<string> => {
    if (!file.type.startsWith('video/')) return ''

    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)
      video.currentTime = 1 // 获取第1秒的帧作为缩略图

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL('image/jpeg')
        URL.revokeObjectURL(video.src)
        resolve(thumbnail)
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        resolve('')
      }
    })
  }

  const uploadFile = async (file: File) => {
    const fileId = Math.random().toString(36).substring(7)
    console.log('Starting upload for file:', {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size
    })
    
    // 初始化进度
    setUploadProgress(prev => ({
      ...prev,
      [fileId]: {
        id: fileId,
        name: file.name,
        progress: 0,
        status: 'uploading'
      }
    }))

    try {
      // 创建缩略图（如果是视频）
      console.log('Creating thumbnail for:', file.name)
      let thumbnail = ''
      if (file.type.startsWith('video/')) {
        thumbnail = await createThumbnail(file)
      }
      console.log('Thumbnail created:', thumbnail ? 'success' : 'not needed')

      // 创建 FormData
      const formData = new FormData()
      formData.append('file', file)
      console.log('FormData created with file')

      // 上传文件
      console.log('Sending upload request')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      console.log('Upload response status:', response.status)
      const data = await response.json()
      console.log('Upload response data:', data)

      if (!response.ok) {
        throw new Error(data.error || '上传失败')
      }

      const { url } = data
      console.log('File uploaded successfully:', url)

      // 更新状态为成功
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          progress: 100,
          status: 'success'
        }
      }))

      // 回调通知上传完成
      const fileData = {
        id: fileId,
        name: file.name,
        url,
        type: file.type,
        ...(thumbnail && { thumbnail })
      }
      console.log('Sending file data to parent:', fileData)
      onUpload(fileData)

      // 清理进度状态
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [fileId]: _, ...rest } = prev
          return rest
        })
      }, 1000)

    } catch (error: any) {
      console.error('Upload error for file:', file.name, error)
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          status: 'error',
          error: error.message || '上传失败'
        }
      }))

      toast({
        variant: "destructive",
        description: `上传失败: ${error.message || '未知错误'}`,
      })
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // 处理被拒绝的文件
    rejectedFiles.forEach(({ file, errors }) => {
      const errorMessages = errors.map(error => {
        if (error.code === 'file-too-large') {
          return `文件大小超过 ${maxSize}MB`
        }
        if (error.code === 'file-invalid-type') {
          return '不支持的文件类型'
        }
        return error.message
      })
      
      toast({
        variant: "destructive",
        description: `${file.name}: ${errorMessages.join(', ')}`,
      })
    })

    // 上传接受的文件
    for (const file of acceptedFiles) {
      await uploadFile(file)
    }
  }, [maxSize, onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSize * 1024 * 1024,
    accept
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center
          cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
        <div className="text-center space-y-1">
          <p className="text-sm">
            拖拽文件到此处，或
            <Button type="button" variant="link" className="px-1">
              点击上传
            </Button>
          </p>
          <p className="text-xs text-muted-foreground">
            支持的文件类型：图片 (PNG, JPG, GIF) 和视频 (MP4, WebM)
            <br />
            单个文件最大 {maxSize}MB
          </p>
        </div>
      </div>

      {/* 上传进度 */}
      {Object.values(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.values(uploadProgress).map((file) => (
            <div key={file.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate flex-1">{file.name}</span>
                <span className="ml-2">
                  {file.status === 'uploading' && `${file.progress}%`}
                  {file.status === 'error' && '上传失败'}
                  {file.status === 'success' && '上传完成'}
                </span>
              </div>
              {file.status === 'uploading' && (
                <Progress value={file.progress} className="h-1" />
              )}
              {file.error && (
                <p className="text-xs text-red-500">{file.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
