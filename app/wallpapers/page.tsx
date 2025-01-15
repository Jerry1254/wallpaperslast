"use client"

import { useCallback, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { WallpaperList } from "@/components/wallpaper-list"
import { Button } from "@/components/ui/button"
import { UploadWallpaperModal } from "@/components/upload-wallpaper-modal"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Share2, Download } from "lucide-react"
import { VideoPreview } from "@/components/video-preview"

export default function WallpapersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const handleShare = useCallback((wallpaper) => {
    // TODO: implement share logic
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="搜索壁纸..."
            className="max-w-sm"
          />
          <Button onClick={() => setIsUploadModalOpen(true)}>新增壁纸</Button>
        </div>
        <WallpaperList key={refreshKey} />
        <UploadWallpaperModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </AdminLayout>
  )
}
