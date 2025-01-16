"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import dynamic from "next/dynamic"
import "./quill.css"

// 动态导入富文本编辑器
const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => {
    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'color', 'background',
      'align',
      'clean'
    ]
    
    return function CustomQuill(props: any) {
      return <mod.default {...props} formats={formats} />
    }
  }),
  { 
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg" />
  }
)

interface Settings {
  share_header_text: string
  share_button_text: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    share_header_text: '',
    share_button_text: ''
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const result = await response.json()
      if (result.code === 0 && result.data) {
        setSettings(result.data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: '获取设置失败'
      })
    }
  }

  const handleSave = async () => {
    if (!settings.share_header_text.trim() || !settings.share_button_text.trim()) {
      toast({
        variant: "destructive",
        description: '所有字段都不能为空'
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      const result = await response.json()
      if (result.code === 0) {
        toast({
          description: '保存成功'
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: '保存失败'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>分享页设置</CardTitle>
            <CardDescription>
              设置分享页面的显示内容和分享按钮文本
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">分享页描述</label>
              {typeof window !== 'undefined' && (
                <ReactQuill
                  theme="snow"
                  value={settings.share_header_text}
                  onChange={(value) => setSettings(prev => ({ ...prev, share_header_text: value }))}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'align': [] }],
                      ['clean']
                    ]
                  }}
                />
              )}
            </div>

            <div className="space-y-2 mt-16">
              <label className="text-sm font-medium">分享按钮文本</label>
              <Input
                value={settings.share_button_text}
                onChange={(e) => setSettings(prev => ({ ...prev, share_button_text: e.target.value }))}
                placeholder="请输入分享按钮文本"
              />
              <p className="text-sm text-gray-500">
                此文本将与分享链接拼接，例如：{settings.share_button_text} http://example.com/share/123
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full"
            >
              {loading ? '保存中...' : '保存设置'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
