"use client"

import { MobileWallpaperList } from "@/components/mobile-wallpaper-list"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

export default function MobilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [shopId, setShopId] = useState(searchParams.get('shopId') || 'all')
  const [shops, setShops] = useState<Array<{id: string, name: string}>>([])

  // 获取店铺列表
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops')
        const data = await response.json()
        if (data?.data) {
          setShops(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch shops:', error)
      }
    }
    fetchShops()
  }, [])

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`/mobile?${params.toString()}`)
  }

  // 处理店铺选择
  const handleShopSelect = (value: string) => {
    setShopId(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('shopId', value)
    } else {
      params.delete('shopId')
    }
    router.push(`/mobile?${params.toString()}`)
  }

  return (
    <div className="container max-w-[600px] mx-auto p-4 space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <Input
            type="search"
            placeholder="搜索壁纸..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
          
          <Select value={shopId} onValueChange={handleShopSelect}>
            <SelectTrigger>
              <SelectValue placeholder="选择店铺" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部店铺</SelectItem>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Suspense fallback={<div>加载中...</div>}>
          <MobileWallpaperList />
        </Suspense>
      </div>
    </div>
  )
}
