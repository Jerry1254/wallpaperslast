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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddShopModal } from "./add-shop-modal"
import { PlayCircle } from "lucide-react"

interface Shop {
  id: string
  name: string
}

interface UploadedFile {
  id: string
  name: string
  url: string
  type: string
  thumbnail?: string
}

interface WallpaperData {
  id?: string
  name: string
  shopId: string
  files: UploadedFile[]
}

interface UploadWallpaperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: WallpaperData
  mode?: 'create' | 'edit'
  onSuccess?: () => void
}

export function UploadWallpaperModal({
  open,
  onOpenChange,
  initialData,
  mode = 'create',
  onSuccess,
}: UploadWallpaperModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [wallpaperName, setWallpaperName] = useState("")
  const [selectedShopId, setSelectedShopId] = useState("")
  const [shops, setShops] = useState<Shop[]>([])
  const [isAddShopModalOpen, setIsAddShopModalOpen] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    shopId?: string
    files?: string
  }>({})
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 加载店铺列表
  useEffect(() => {
    if (open) {
      fetchShops()
    }
  }, [open])

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops')
      if (!response.ok) throw new Error('Failed to fetch shops')
      const data = await response.json()
      setShops(data)
    } catch (error) {
      console.error('Fetch shops error:', error)
      toast({
        variant: "destructive",
        description: "获取店铺列表失败",
      })
    }
  }

  useEffect(() => {
    if (initialData) {
      setWallpaperName(initialData.name)
      setSelectedShopId(initialData.shopId)
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

    if (!selectedShopId) {
      newErrors.shopId = "请选择店铺"
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

  const handleShopChange = (value: string) => {
    setSelectedShopId(value)
    setErrors(prev => ({ ...prev, shopId: undefined }))
  }

  const handleUpload = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/wallpapers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: wallpaperName,
          shopId: selectedShopId,
          files: files.map(file => ({
            url: file.url,
            type: file.type,
            thumbnail: file.thumbnail || file.url
          }))
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '上传失败')
      }

      toast({
        description: mode === 'create' ? "上传成功！" : "更新成功！",
      })

      onOpenChange(false)
      setFiles([])
      setWallpaperName("")
      setSelectedShopId("")
      setErrors({})
      
      // 通知父组件刷新列表
      onSuccess?.()

    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        description: error.message || "上传失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileDelete = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId))
    if (playingVideo === fileId) {
      setPlayingVideo(null)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? '新增壁纸' : '编辑壁纸'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">壁纸名称</Label>
                <Input
                  id="name"
                  value={wallpaperName}
                  onChange={handleNameChange}
                  placeholder="请输入壁纸名称"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label>选择店铺</Label>
                <div className="flex gap-2">
                  <Select value={selectedShopId} onValueChange={handleShopChange}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="请选择店铺" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map(shop => (
                        <SelectItem key={shop.id} value={shop.id}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={() => setIsAddShopModalOpen(true)}>
                    新增店铺
                  </Button>
                </div>
                {errors.shopId && <p className="text-sm text-red-500">{errors.shopId}</p>}
              </div>

              <div className="space-y-2">
                <Label>上传文件</Label>
                <FileUploader
                  onUpload={(file) => setFiles(prev => [...prev, file])}
                  maxSize={100}
                  accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                    'video/*': ['.mp4', '.webm']
                  }}
                />
                {errors.files && <p className="text-sm text-red-500">{errors.files}</p>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="relative group">
                    {file.type.startsWith('video/') ? (
                      <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                        {playingVideo === file.id ? (
                          <video
                            src={file.url}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                            onEnded={() => setPlayingVideo(null)}
                          />
                        ) : (
                          <>
                            <img
                              src={file.thumbnail || file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => setPlayingVideo(file.id)}
                              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <PlayCircle className="w-12 h-12 text-white" />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="mt-1 text-sm truncate">{file.name}</p>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleFileDelete(file.id)}
                    >
                      <span className="sr-only">删除</span>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 py-4 px-6 border-t mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isLoading}
              loading={isLoading}
            >
              {mode === 'create' ? '上传' : '更新'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddShopModal
        open={isAddShopModalOpen}
        onOpenChange={setIsAddShopModalOpen}
        onSuccess={fetchShops}
      />
    </>
  )
}
