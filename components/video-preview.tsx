"use client"

import { useEffect, useRef, useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { getDownloadUrl } from '@/lib/cos'

interface VideoPreviewProps {
  url: string
  className?: string
  onPlay?: () => void
}

export function VideoPreview({ url, className, onPlay }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [isPreviewReady, setIsPreviewReady] = useState(false)
  const [signedUrl, setSignedUrl] = useState<string>("")

  useEffect(() => {
    const getSignedUrl = async () => {
      try {
        const key = url.split('.com/')[1]
        const signed = await getDownloadUrl(key)
        setSignedUrl(signed as string)
      } catch (error) {
        console.error('Error getting signed URL:', error)
      }
    }
    
    getSignedUrl()
  }, [url])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !signedUrl) return

    // 视频加载后设置时间到第二帧
    const handleLoadedData = () => {
      video.currentTime = 0.1  // 设置到第二帧左右的位置
      setIsPreviewReady(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [signedUrl])

  const handleClick = () => {
    if (isPaused && isPreviewReady) {
      videoRef.current?.play()
      setIsPaused(false)
      onPlay?.()
    }
  }

  if (!signedUrl) {
    return <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={signedUrl}
        className={`${className || ''} rounded-lg w-full h-full object-cover`}
        controls={!isPaused}
      />
      {isPaused && (
        <button
          onClick={handleClick}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
        >
          <PlayCircle className="w-12 h-12 text-white" />
        </button>
      )}
    </div>
  )
}
