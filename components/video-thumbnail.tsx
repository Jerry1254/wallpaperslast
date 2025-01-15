"use client"

import { useEffect, useRef, useState } from 'react'

interface VideoThumbnailProps {
  videoUrl: string
  className?: string
}

export function VideoThumbnail({ videoUrl, className }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      try {
        // 设置视频时间到第一帧
        video.currentTime = 0

        // 创建 canvas 并绘制视频帧
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg')
          setThumbnail(dataUrl)
        }
      } catch (error) {
        console.error('Generate thumbnail error:', error)
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    return () => video.removeEventListener('loadeddata', handleLoadedData)
  }, [videoUrl])

  return (
    <>
      <video
        ref={videoRef}
        src={videoUrl}
        style={{ display: 'none' }}
        preload="metadata"
      />
      {thumbnail && (
        <img src={thumbnail} className={className} alt="Video thumbnail" />
      )}
    </>
  )
}
