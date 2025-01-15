"use client"

import { useState } from "react"
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

// 示例数据
const wallpapers = [
  {
    id: "1",
    name: "山水风景",
    thumbnail: "/placeholder.svg",
    shareUrl: "https://example.com/wallpapers/1",
    createdAt: "2024-01-11",
    files: [
      {
        id: "file1",
        name: "wallpaper1.jpg",
        url: "/placeholder.svg",
        type: "image/jpeg"
      }
    ]
  },
  {
    id: "2",
    name: "城市夜景",
    thumbnail: "/placeholder.svg",
    shareUrl: "https://example.com/wallpapers/2",
    createdAt: "2024-01-11",
    files: [
      {
        id: "file2",
        name: "wallpaper2.jpg",
        url: "/placeholder.svg",
        type: "image/jpeg"
      }
    ]
  },
  {
    id: "3",
    name: "极光星空",
    thumbnail: "/placeholder.svg",
    shareUrl: "https://example.com/wallpapers/3",
    createdAt: "2024-01-11",
    files: [
      {
        id: "file3",
        name: "wallpaper3.jpg",
        url: "/placeholder.svg",
        type: "image/jpeg"
      }
    ]
  },
]

const ITEMS_PER_PAGE = 20

export function WallpaperList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingWallpaperId, setDeletingWallpaperId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWallpaper, setEditingWallpaper] = useState<typeof wallpapers[0] | null>(null)
  
  const totalPages = Math.ceil(wallpapers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentWallpapers = wallpapers.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        description: "分享链接已复制到剪贴板",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        description: "复制失败，请手动复制",
      })
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeletingWallpaperId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deletingWallpaperId) {
      // 实现删除逻辑
      toast({
        description: `删除壁纸 ID: ${deletingWallpaperId}`,
      })
      setIsDeleteDialogOpen(false)
      setDeletingWallpaperId(null)
    }
  }

  const handleEdit = (wallpaper: typeof wallpapers[0]) => {
    setEditingWallpaper(wallpaper)
    setIsEditModalOpen(true)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">缩略图</TableHead>
            <TableHead>名称</TableHead>
            <TableHead>壁纸张数</TableHead>
            <TableHead>分享链接</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentWallpapers.map((wallpaper) => (
            <TableRow key={wallpaper.id}>
              <TableCell>
                <Image
                  src={wallpaper.thumbnail}
                  alt={wallpaper.name}
                  width={80}
                  height={45}
                  className="rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{wallpaper.name}</TableCell>
              <TableCell>{wallpaper.files.length}张</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-[200px]">
                    {wallpaper.shareUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(wallpaper.shareUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{wallpaper.createdAt}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(wallpaper)}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">编辑</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(wallpaper.id)}>
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">删除</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="py-4 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }}
              >
                上一页
              </PaginationPrevious>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(page)
                  }}
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
              >
                下一页
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="确认删除"
        description="您确定要删除这个壁纸吗？此操作无法撤销。"
      />

      {editingWallpaper && (
        <UploadWallpaperModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          mode="edit"
          initialData={{
            id: editingWallpaper.id,
            name: editingWallpaper.name,
            files: editingWallpaper.files
          }}
        />
      )}
    </div>
  )
}

