"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Download } from "lucide-react"
import { VideoPreview } from "@/components/video-preview"
import parse from 'html-react-parser'
import { getDownloadUrl } from "@/lib/cos"

interface SharePageData {
  id: number
  wallpaperId: number
  description: string
  buttonText: string
  wallpaperName: string
  files: {
    id: string
    url: string
    name: string
    type: string
  }[]
}

export default function SharePage({ params }: { params: { code: string } }) {
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
      
      console.log('Fetching share page for code:', params.code)
      const response = await fetch(`/api/share?id=${params.code}`)
      const result = await response.json()
      
      console.log('API response:', result)
      
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

  const handleDownloadAll = async () => {
    if (!data?.files) return
    
    try {
      for (const [index, file] of data.files.entries()) {
        // 从 URL 中提取 COS 的 key
        const key = file.url.split('.com/')[1]
        const signedUrl = await getDownloadUrl(key)
        
        const a = document.createElement('a')
        a.href = signedUrl as string
        a.download = file.name
        document.body.appendChild(a)
        
        setTimeout(() => {
          a.click()
          document.body.removeChild(a)
        }, index * 500)
      }

      toast({
        description: `开始下载 ${data.files.length} 个文件`
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        variant: "destructive",
        description: '下载失败，请重试'
      })
    }
  }

  const handleDownloadSingle = async (file: SharePageData['files'][0]) => {
    try {
      // 从 URL 中提取 COS 的 key
      const key = file.url.split('.com/')[1]
      const signedUrl = await getDownloadUrl(key)
      
      const a = document.createElement('a')
      a.href = signedUrl as string
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        description: '开始下载文件'
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        variant: "destructive",
        description: '下载失败，请重试'
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error || '加载失败'}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{data.wallpaperName}</h1>
        
        {data.description && (
          <div className="prose mb-6 max-w-none">
            {parse(data.description)}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {data.files.map((file) => (
            <div key={file.id} className="relative group">
              {file.type.startsWith('video/') ? (
                <VideoPreview url={file.url} />
              ) : (
                <div className="relative aspect-video">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDownloadSingle(file)}
              >
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleDownloadAll}
            className="gap-2"
          >
            <Download className="w-5 h-5" />
            {data.buttonText || '下载全部'}
          </Button>
        </div>
      </div>
    </div>
  )
}
