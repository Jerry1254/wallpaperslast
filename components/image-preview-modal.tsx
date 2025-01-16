"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/button'
import { VideoPreview } from './video-preview'

interface ImagePreviewModalProps {
  images: Array<{
    url: string
    type?: string
  }>
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImagePreviewModal({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // 使用 useEffect 来确保 currentIndex 在有效范围内
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0)
    }
  }, [currentIndex, images.length])

  // 当 initialIndex 改变时更新 currentIndex
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const currentImage = images[currentIndex]
  const isVideo = currentImage?.type?.startsWith('video/')

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // 键盘事件处理
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }, [handlePrevious, handleNext, onOpenChange])

  // 添加和移除键盘事件监听器
  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  // 如果没有图片，不显示预览
  if (!images.length || !currentImage) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full h-[90vh] p-0 border-none bg-black/90">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* 关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* 上一张按钮 */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* 图片或视频显示区域 */}
          <div className="w-auto h-full flex items-center justify-center p-4">
            <div 
              className="relative h-[80vh]" 
              style={{ 
                aspectRatio: '9/16',
                maxHeight: '80vh',
              }}
            >
              {isVideo ? (
                <VideoPreview
                  src={currentImage.url}
                  className="h-full w-full object-contain"
                />
              ) : (
                <img
                  src={currentImage.url}
                  alt=""
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>

          {/* 下一张按钮 */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* 图片计数 */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
