"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Trash2 } from "lucide-react"
import { VideoPreview } from "./video-preview"
import path from 'path'

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
  shop_name?: string
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
      // 如果是编辑模式，填充初始数据
      if (mode === 'edit' && initialData) {
        setWallpaperName(initialData.name)
        setSelectedShopId(initialData.shopId)
        setFiles(initialData.files.map(file => ({
          ...file,
          name: file.name || file.url.split('/').pop() || '未命名文件'
        })))
      } else {
        // 如果是新增模式，重置表单
        setWallpaperName("")
        setSelectedShopId("")
        setFiles([])
        setErrors({})
      }
    }
  }, [open, mode, initialData])

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops')
      if (!response.ok) throw new Error('Failed to fetch shops')
      const data = await response.json()
      if (data.code === 0) {
        setShops(data.data)
      } else {
        throw new Error(data.message || 'Failed to fetch shops')
      }
    } catch (error) {
      console.error('Fetch shops error:', error)
      toast({
        variant: "destructive",
        description: "获取店铺列表失败",
      })
    }
  }

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
      const endpoint = mode === 'edit' && initialData?.id 
        ? `/api/wallpapers/${initialData.id}`
        : '/api/wallpapers'

      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: wallpaperName,
          shopId: selectedShopId,
          files: files.map(file => ({
            url: file.url,
            type: file.type,
            name: file.name,
            thumbnail: file.thumbnail
          }))
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '操作失败')
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
        description: error.message || "操作失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileDelete = async (fileId: string) => {
    const fileToDelete = files.find(file => file.id === fileId)
    if (!fileToDelete) return

    try {
      // 从 url 中提取相对路径
      const relativePath = fileToDelete.url.startsWith('/') ? fileToDelete.url.slice(1) : fileToDelete.url
      const fullPath = path.join(process.cwd(), 'public', relativePath)

      // 删除文件
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: relativePath })
      })

      // 从状态中移除文件
      setFiles(files.filter(file => file.id !== fileId))
      if (playingVideo === fileId) {
        setPlayingVideo(null)
      }

      // 如果删除后没有文件了，显示错误
      if (files.length <= 1) {
        setErrors(prev => ({ ...prev, files: "请上传至少一个文件" }))
      }

    } catch (error) {
      console.error('Delete file error:', error)
      toast({
        variant: "destructive",
        description: "删除文件失败",
      })
    }
  }

  const handleFileUpload = (file: UploadedFile) => {
    const isVideo = file.type.startsWith('video/')
    const fileName = file.name || file.url.split('/').pop() || '未命名文件'
    
    setFiles(prev => [...prev, {
      ...file,
      name: fileName,
      thumbnail: file.url
    }])
    
    setErrors(prev => ({ ...prev, files: undefined }))
  }

  const handleAddShopSuccess = useCallback(() => {
    fetchShops()
  }, [])

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
                  <AddShopModal 
                    open={isAddShopModalOpen} 
                    onOpenChange={setIsAddShopModalOpen}
                    onSuccess={handleAddShopSuccess}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddShopModalOpen(true)}
                  >
                    新增店铺
                  </Button>
                </div>
                {errors.shopId && <p className="text-sm text-red-500">{errors.shopId}</p>}
              </div>

              <div className="space-y-2">
                <Label>上传文件</Label>
                <FileUploader
                  onUpload={handleFileUpload}
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
                      <div className="relative aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden group">
                        <VideoPreview
                          src={file.url}
                          className="w-full h-full object-cover"
                          onPlay={() => setPlayingVideo(file.id)}
                        />
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
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm truncate flex-1">{file.name}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleFileDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
        onSuccess={handleAddShopSuccess}
      />
    </>
  )
}
