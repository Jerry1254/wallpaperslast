"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { VideoPreview } from "./video-preview"
import { useSearchParams } from "next/navigation"
import { ConfirmDialog } from "./ui/confirm-dialog"

interface Wallpaper {
  id: string
  name: string
  shop_name: string
  files: {
    id: string
    url: string
    type: string
    thumbnail?: string
  }[]
}

const ITEMS_PER_PAGE = 20

export function MobileWallpaperList() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingWallpaperId, setDeletingWallpaperId] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const shopId = searchParams.get('shopId')

  // 获取壁纸列表
  const fetchWallpapers = async (page: number) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (shopId) params.append('shopId', shopId)
      params.append('page', String(page))
      params.append('pageSize', String(ITEMS_PER_PAGE))
      
      const response = await fetch(`/api/wallpapers?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        if (page === 1) {
          setWallpapers(data.data.list)
        } else {
          setWallpapers(prev => [...prev, ...data.data.list])
        }
        setTotal(data.data.pagination.total)
        setHasMore(data.data.pagination.current * data.data.pagination.pageSize < data.data.pagination.total)
      } else {
        throw new Error(data.error || data.details || '获取壁纸列表失败')
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "获取壁纸列表失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理分享
  const handleShare = useCallback(async (wallpaper: Wallpaper) => {
    try {
      // 获取系统设置
      const settingsResponse = await fetch('/api/settings')
      const settingsResult = await settingsResponse.json()
      const shareButtonText = settingsResult.data?.share_button_text || '点击下载'
      
      const shareUrl = `${window.location.origin}/share/${wallpaper.id}`
      const shareText = `${shareButtonText} ${shareUrl}`
      
      // 复制分享文本
      await navigator.clipboard.writeText(shareText)
      
      toast({
        description: '分享链接已复制到剪贴板'
      })
    } catch (error) {
      toast({
        variant: "destructive",
        description: '复制分享链接失败'
      })
    }
  }, [])

  // 删除壁纸
  const handleDelete = async () => {
    if (!deletingWallpaperId) return

    try {
      const response = await fetch(`/api/wallpapers/${deletingWallpaperId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          description: "壁纸已删除",
        })
        setCurrentPage(1)
        fetchWallpapers(1)
      } else {
        toast({
          variant: "destructive",
          description: "删除失败",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "删除失败",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingWallpaperId(null)
    }
  }

  // 加载更多
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  // 初始加载和搜索条件变化时重新获取数据
  useEffect(() => {
    setCurrentPage(1)
    fetchWallpapers(1)
  }, [search, shopId])

  // 页码变化时加载更多数据
  useEffect(() => {
    if (currentPage > 1) {
      fetchWallpapers(currentPage)
    }
  }, [currentPage])

  // 监听滚动到底部
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {wallpapers.map((wallpaper) => {
          const file = wallpaper.files[0]
          const isVideo = file.type.startsWith('video/')

          return (
            <div key={wallpaper.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative aspect-[9/16]">
                {isVideo ? (
                  <VideoPreview
                    src={file.url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={file.url}
                    alt={wallpaper.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="text-sm font-medium truncate">{wallpaper.name}</div>
                <div className="text-xs text-gray-500 truncate">{wallpaper.shop_name}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleShare(wallpaper)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    分享
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setDeletingWallpaperId(wallpaper.id)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    删除
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-500">加载中...</div>
      )}

      {!isLoading && !hasMore && wallpapers.length > 0 && (
        <div className="text-center py-4 text-gray-500">没有更多了</div>
      )}

      {!isLoading && wallpapers.length === 0 && (
        <div className="text-center py-4 text-gray-500">暂无数据</div>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="删除壁纸"
        description="确定要删除这个壁纸吗？此操作不可恢复。"
        onConfirm={() => deletingWallpaperId && handleDelete()}
      />
    </div>
  )
}
