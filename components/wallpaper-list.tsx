"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Pencil, Trash2 } from 'lucide-react'
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { ConfirmDialog } from "./ui/confirm-dialog"
import { UploadWallpaperModal } from "./upload-wallpaper-modal"
import { Share2, Download, Edit, ChevronLeft, ChevronRight } from "lucide-react"
import { VideoPreview } from "./video-preview"
import { ImagePreviewModal } from "./image-preview-modal"

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
  const [total, setTotal] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingWallpaperId, setDeletingWallpaperId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewImages, setPreviewImages] = useState<Array<{ url: string, type?: string }>>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // 获取壁纸列表
  const fetchWallpapers = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (shopId) params.append('shopId', String(shopId))
      params.append('page', String(currentPage))
      params.append('pageSize', String(ITEMS_PER_PAGE))
      
      const url = `/api/wallpapers?${params.toString()}`
      console.log('Fetching URL:', url)
      
      const response = await fetch(url)
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      // 获取原始响应文本
      const responseText = await response.text()
      console.log('Raw response:', responseText)
      
      // 尝试解析 JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed response:', data)
      } catch (e) {
        console.error('Failed to parse response as JSON:', e)
        throw new Error('API 响应格式错误')
      }

      if (response.ok) {
        if (!Array.isArray(data.data.list)) {
          console.error('Unexpected API response format:', data)
          throw new Error('API 返回数据格式错误')
        }
        setWallpapers(data.data.list)
        setTotal(data.data.pagination.total)
      } else {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        })
        throw new Error(data.error || data.details || '获取壁纸列表失败')
      }
    } catch (error) {
      console.error('Fetch wallpapers error:', error)
      if (error instanceof Error) {
        console.error('Full error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        })
      }
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
        setCurrentPage(1)  // 重置到第一页
        await fetchWallpapers()  // 等待刷新完成
      } else {
        const error = await response.json()
        toast({
          variant: "destructive",
          description: error.error || "删除失败",
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
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
      
      // 使用生产环境域名
      const shareUrl = `https://wallpaperslast-v2sh.vercel.app/share/${wallpaper.id}`
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
    setCurrentPage(1) // 重置到第一页
    fetchWallpapers()
  }, [searchQuery, shopId])

  // 页码变化时重新获取数据
  useEffect(() => {
    fetchWallpapers()
  }, [currentPage])

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
            {wallpapers.map((wallpaper) => {
              const file = wallpaper.files[0]
              const isVideo = file.type.startsWith('video/')

              return (
                <TableRow key={wallpaper.id}>
                  <TableCell>
                    <div 
                      className="relative h-[200px] w-[112.5px] cursor-pointer"
                      onClick={() => {
                        setPreviewImages(wallpaper.files.map(f => ({ 
                          url: f.url,
                          type: f.type
                        })))
                        setPreviewIndex(0)
                        setIsPreviewOpen(true)
                      }}
                    >
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

      {total > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) handlePageChange(currentPage - 1)
                  }}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一页
                </Button>
              </PaginationItem>
              {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
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
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) handlePageChange(currentPage + 1)
                  }}
                  disabled={currentPage >= totalPages}
                  className="gap-1"
                >
                  下一页
                  <ChevronRight className="h-4 w-4" />
                </Button>
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

      {/* 图片预览模态框 */}
      <ImagePreviewModal
        images={previewImages}
        initialIndex={previewIndex}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  )
}
