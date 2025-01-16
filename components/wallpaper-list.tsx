"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Pencil, Trash } from 'lucide-react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ConfirmDialog } from "./ui/confirm-dialog"
import { UploadWallpaperModal } from "./upload-wallpaper-modal"
import { Share2, Download, Edit, Trash2 } from "lucide-react"
import { VideoPreview } from "./video-preview"

interface Wallpaper {
  id: string
  name: string
  thumbnail_url: string
  image_urls: string
  created_at: string
  shop_id: string
  shop_name: string
  image_count: number
  files: {
    id: string
    url: string
    type: string
    thumbnail?: string
  }[]
}

interface WallpaperListProps {
  searchQuery?: string
  shopId?: number
}

const ITEMS_PER_PAGE = 20

export function WallpaperList({ searchQuery, shopId }: WallpaperListProps) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingWallpaperId, setDeletingWallpaperId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const totalPages = Math.ceil(wallpapers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentWallpapers = wallpapers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // 获取壁纸列表
  const fetchWallpapers = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (shopId) params.append('shopId', String(shopId))
      
      const response = await fetch(`/api/wallpapers?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setWallpapers(Array.isArray(data) ? data : [])
      } else {
        throw new Error(data.error || '获取壁纸列表失败')
      }
    } catch (error) {
      console.error('Fetch wallpapers error:', error)
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "获取壁纸列表失败",
      })
      setWallpapers([])
    } finally {
      setIsLoading(false)
    }
  }

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
        fetchWallpapers()
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

  // 处理编辑
  const handleEdit = (wallpaper: Wallpaper) => {
    setEditingWallpaper(wallpaper)
    setIsEditModalOpen(true)
  }

  // 处理编辑成功
  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingWallpaper(null)
    fetchWallpapers()
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
  }, [toast])

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 初始加载和搜索条件变化时重新获取数据
  useEffect(() => {
    fetchWallpapers()
  }, [searchQuery, shopId])

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>缩略图</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>店铺</TableHead>
              <TableHead>图片数量</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWallpapers.map((wallpaper) => {
              const file = wallpaper.files[0]
              const isVideo = file.type.startsWith('video/')

              return (
                <TableRow key={wallpaper.id}>
                  <TableCell>
                    <div className="relative h-[200px] w-[112.5px]">
                      {isVideo ? (
                        <VideoPreview
                          src={file.url}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Image
                          src={file.url}
                          alt={wallpaper.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{wallpaper.name}</TableCell>
                  <TableCell>{wallpaper.shop_name}</TableCell>
                  <TableCell>{wallpaper.image_count}</TableCell>
                  <TableCell>{new Date(wallpaper.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleShare(wallpaper)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(wallpaper)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          // 确保 files 存在并且是数组
                          if (!Array.isArray(wallpaper.files) || wallpaper.files.length === 0) {
                            toast({
                              variant: "destructive",
                              description: "没有可下载的文件",
                            })
                            return
                          }

                          // 下载所有文件
                          wallpaper.files.forEach((file, index) => {
                            const a = document.createElement('a')
                            a.href = file.url
                            a.download = file.name
                            document.body.appendChild(a)
                            
                            // 延迟点击下载，避免浏览器阻止多个下载
                            setTimeout(() => {
                              a.click()
                              document.body.removeChild(a)
                            }, index * 500) // 每个文件间隔 500ms
                          })

                          toast({
                            description: `开始下载 ${wallpaper.files.length} 个文件`,
                          })
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeletingWallpaperId(wallpaper.id)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="删除壁纸"
        description="确定要删除这个壁纸吗？此操作不可恢复。"
        onConfirm={() => deletingWallpaperId && handleDelete()}
      />

      <UploadWallpaperModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode="edit"
        initialData={editingWallpaper || undefined}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}
