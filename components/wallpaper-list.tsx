"use client"

import { useState, useEffect } from "react"
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

const ITEMS_PER_PAGE = 20

export function WallpaperList() {
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
      const response = await fetch('/api/wallpapers')
      if (!response.ok) throw new Error('获取壁纸列表失败')
      const data = await response.json()
      setWallpapers(data)
    } catch (error) {
      console.error('Fetch wallpapers error:', error)
      toast({
        variant: "destructive",
        description: "获取壁纸列表失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 删除壁纸
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/wallpapers/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('删除壁纸失败')
      
      toast({
        description: "删除成功",
      })
      
      // 刷新列表
      fetchWallpapers()
    } catch (error) {
      console.error('Delete wallpaper error:', error)
      toast({
        variant: "destructive",
        description: "删除壁纸失败",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingWallpaperId(null)
    }
  }

  // 复制分享链接
  const handleCopyShare = (wallpaper: Wallpaper) => {
    const shareUrl = `${window.location.origin}/share/${wallpaper.id}`
    navigator.clipboard.writeText(shareUrl)
    toast({
      description: "分享链接已复制",
    })
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

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 初始加载
  useEffect(() => {
    fetchWallpapers()
  }, [])

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
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={file.url}
                          alt={wallpaper.name}
                          fill
                          className="object-cover rounded-md"
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
                        onClick={() => handleCopyShare(wallpaper)}
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
                          const a = document.createElement('a')
                          a.href = file.url
                          a.download = file.name
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
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
        onConfirm={() => deletingWallpaperId && handleDelete(deletingWallpaperId)}
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
