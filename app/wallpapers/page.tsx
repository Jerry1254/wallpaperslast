"use client"

import { useState, useCallback } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { WallpaperList } from "@/components/wallpaper-list"
import { Button } from "@/components/ui/button"
import { UploadWallpaperModal } from "@/components/upload-wallpaper-modal"
import { Input } from "@/components/ui/input"

export default function WallpapersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = useCallback(() => {
    // 通过改变 key 来强制刷新列表
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input 
            className="max-w-sm" 
            placeholder="请输入要搜索的壁纸名称" 
            type="search"
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
