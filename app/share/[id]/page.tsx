"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download } from "lucide-react"
import { VideoPreview } from "@/components/video-preview"
import parse from 'html-react-parser'

interface SharePageData {
  id: number
  wallpaperName: string
  description: string
  buttonText: string
  files: {
    id: string
    url: string
    name: string
    type: string
  }[]
}

export default function SharePage({ params }: { params: { id: number } }) {
  const [data, setData] = useState<SharePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSharePage()
  }, [])

  const fetchSharePage = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/share?id=${params.id}`)
      const result = await response.json()
      
      if (result.code === 0) {
        setData(result.data)
      } else {
        setError(result.message || '获取分享页失败')
        toast({
          variant: "destructive",
          description: result.message || '获取分享页失败'
        })
      }
    } catch (error) {
      console.error('Error fetching share page:', error)
      setError('获取分享页失败')
      toast({
        variant: "destructive",
        description: '获取分享页失败'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAll = () => {
    if (!data?.files) return
    
    data.files.forEach((file, index) => {
      const a = document.createElement('a')
      a.href = file.url
      a.download = file.name
      document.body.appendChild(a)
      
      setTimeout(() => {
        a.click()
        document.body.removeChild(a)
      }, index * 500)
    })

    toast({
      description: `开始下载 ${data.files.length} 个文件`
    })
  }

  const handleDownloadSingle = (file: SharePageData['files'][0]) => {
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">分享页不存在</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{data.wallpaperName}</h1>
      
      <div className="mb-6">
        {parse(data.description)}
      </div>
      
      <Button 
        className="mb-8 w-full" 
        size="lg"
        onClick={handleDownloadAll}
      >
        <Download className="mr-2 h-5 w-5" />
        下载全部
      </Button>

      <div className="grid grid-cols-2 gap-4">
        {data.files.map(file => (
          <div key={file.id} className="space-y-2">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg">
              {file.type === 'video/mp4' ? (
                <VideoPreview
                  src={file.url}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm truncate">{file.name}</div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDownloadSingle(file)}
              >
                点击下载单张壁纸
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
