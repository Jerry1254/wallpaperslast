"use client"

import { useEffect, useRef, useState } from 'react'
import { PlayCircle } from 'lucide-react'

interface VideoPreviewProps {
  src: string
  className?: string
  onPlay?: () => void
}

export function VideoPreview({ src, className, onPlay }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [isPreviewReady, setIsPreviewReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 视频加载后设置时间到第二帧
    const handleLoadedData = () => {
      video.currentTime = 0.1  // 设置到第二帧左右的位置
      setIsPreviewReady(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [src])

  const handleClick = () => {
    if (isPaused && isPreviewReady) {
      videoRef.current?.play()
      setIsPaused(false)
      onPlay?.()
    }
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        className={`${className} rounded-lg`}
        controls={!isPaused}
      />
      {isPaused && (
        <button
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <PlayCircle className="w-12 h-12 text-white" />
        </button>
      )}
    </div>
  )
}
