"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { WallpaperList } from "@/components/wallpaper-list"
import { Button } from "@/components/ui/button"
import { UploadWallpaperModal } from "@/components/upload-wallpaper-modal"
import { Input } from "@/components/ui/input"

export default function WallpapersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

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
        <WallpaperList />
        <UploadWallpaperModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
        />
      </div>
    </AdminLayout>
  )
}

