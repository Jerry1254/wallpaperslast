"use client"

import { useCallback, useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { WallpaperList } from "@/components/wallpaper-list"
import { Button } from "@/components/ui/button"
import { UploadWallpaperModal } from "@/components/upload-wallpaper-modal"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Share2, Download, Search } from "lucide-react"
import { VideoPreview } from "@/components/video-preview"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Shop {
  id: number
  name: string
}

export default function WallpapersPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShop, setSelectedShop] = useState("all")
  const [shops, setShops] = useState<Shop[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setRefreshKey(prev => prev + 1)
    }, 300) // 300ms 防抖

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops')
      const result = await response.json()
      if (result.code === 0) {
        setShops(result.data)
      } else {
        throw new Error(result.message || '获取店铺列表失败')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "获取店铺列表失败"
      })
    }
  }

  const handleShopChange = (value: string) => {
    setSelectedShop(value)
    setRefreshKey(prev => prev + 1)
  }

  const handleUploadSuccess = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="搜索壁纸..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            
            <Tabs value={selectedShop} onValueChange={handleShopChange} className="flex-1">
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                {shops.map(shop => (
                  <TabsTrigger key={shop.id} value={String(shop.id)}>
                    {shop.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Button onClick={() => setIsUploadModalOpen(true)}>新增壁纸</Button>
        </div>

        <WallpaperList 
          key={refreshKey} 
          searchQuery={searchQuery}
          shopId={selectedShop === 'all' ? undefined : Number(selectedShop)}
        />

        <UploadWallpaperModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onSuccess={handleUploadSuccess}
        />
      </div>
    </AdminLayout>
  )
}
