"use client"

import { useCallback, useState } from "react"
import { FileRejection, useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import { uploadFile as uploadToCOS } from "@/lib/cos"

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

      // 上传到腾讯云 COS
      console.log('Uploading to COS:', file.name)
      const url = await uploadToCOS(file)
      console.log('Upload successful, URL:', url)

      // 更新进度为完成
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          progress: 100,
          status: 'success'
        }
      }))

      // 调用回调
      onUpload({
        id: fileId,
        name: file.name,
        url: url,
        type: file.type,
        thumbnail
      })

    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadProgress(prev => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          status: 'error',
          error: error.message
        }
      }))

      toast({
        variant: "destructive",
        description: `上传失败: ${error.message}`,
      })
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    console.log('Files dropped:', { accepted: acceptedFiles, rejected: rejectedFiles })

    // 处理被拒绝的文件
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        const errorMessages = errors.map(e => e.message).join(', ')
        toast({
          variant: "destructive",
          description: `文件 ${file.name} 无法上传: ${errorMessages}`,
        })
      })
    }

    // 上传接受的文件
    for (const file of acceptedFiles) {
      await uploadFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSize * 1024 * 1024,
    accept
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer
          ${isDragActive ? 'border-primary bg-secondary/50' : 'border-border'}
          hover:border-primary hover:bg-secondary/20 transition-colors
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            {isDragActive ? (
              "放开以上传文件"
            ) : (
              <>
                拖拽文件到此处，或者
                <Button
                  variant="link"
                  className="px-1 text-primary"
                >
                  点击选择
                </Button>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            最大文件大小: {maxSize}MB
          </p>
        </div>
      </div>

      {/* 上传进度显示 */}
      {Object.values(uploadProgress).map((file) => (
        <div key={file.id} className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="truncate">{file.name}</span>
            <span className={file.status === 'error' ? 'text-destructive' : ''}>
              {file.status === 'uploading' && `${file.progress}%`}
              {file.status === 'error' && '上传失败'}
              {file.status === 'success' && '上传完成'}
            </span>
          </div>
          <Progress
            value={file.progress}
            className={`h-1 ${file.status === 'error' ? 'bg-destructive' : ''}`}
          />
          {file.error && (
            <p className="text-xs text-destructive mt-1">{file.error}</p>
          )}
        </div>
      ))}
    </div>
  )
}
