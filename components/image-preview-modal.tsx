"use client"

import { useState, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from './ui/button'
import { VideoPreview } from './video-preview'
import { getDownloadUrl } from '@/lib/cos'

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
  const [signedUrls, setSignedUrls] = useState<Record<number, string>>({})

  // 获取当前图片的签名 URL
  useEffect(() => {
    const getSignedUrlForIndex = async (index: number) => {
      try {
        const image = images[index]
        if (!image) return

        const key = image.url.split('.com/')[1]
        const signedUrl = await getDownloadUrl(key)
        setSignedUrls(prev => ({
          ...prev,
          [index]: signedUrl as string
        }))
      } catch (error) {
        console.error('Error getting signed URL:', error)
      }
    }

    // 获取当前图片的签名 URL
    getSignedUrlForIndex(currentIndex)

    // 预加载前后图片的签名 URL
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    getSignedUrlForIndex(prevIndex)
    getSignedUrlForIndex(nextIndex)
  }, [currentIndex, images])

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
  const currentSignedUrl = signedUrls[currentIndex]

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious()
        break
      case 'ArrowRight':
        handleNext()
        break
      case 'Escape':
        onOpenChange(false)
        break
    }
  }, [handleNext, handlePrevious, onOpenChange])

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (!currentSignedUrl) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-screen-lg w-full h-[80vh] p-0">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg w-full h-[80vh] p-0">
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* 关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* 上一张按钮 */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 z-50 text-white hover:bg-white/20"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* 图片/视频预览 */}
          <div className="w-full h-full flex items-center justify-center">
            {isVideo ? (
              <VideoPreview
                url={currentImage.url}
                className="max-h-full"
              />
            ) : (
              <img
                src={currentSignedUrl}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* 下一张按钮 */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 z-50 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
