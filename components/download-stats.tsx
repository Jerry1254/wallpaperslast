"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from 'lucide-react'
import { CustomPieChart } from "./charts/pie-chart"

// 示例数据
const topDownloads = [
  { id: 1, title: "山水风景", thumbnail: "/placeholder.svg", downloads: 1234 },
  { id: 2, title: "城市夜景", thumbnail: "/placeholder.svg", downloads: 1156 },
  { id: 3, title: "星空银河", thumbnail: "/placeholder.svg", downloads: 987 },
  { id: 4, title: "海滩日落", thumbnail: "/placeholder.svg", downloads: 876 },
  { id: 5, title: "雪山风光", thumbnail: "/placeholder.svg", downloads: 765 },
]

const lastDownloads = [
  { id: 6, title: "荒漠风光", thumbnail: "/placeholder.svg", downloads: 12 },
  { id: 7, title: "森林小径", thumbnail: "/placeholder.svg", downloads: 15 },
  { id: 8, title: "都市建筑", thumbnail: "/placeholder.svg", downloads: 18 },
  { id: 9, title: "田园风光", thumbnail: "/placeholder.svg", downloads: 20 },
  { id: 10, title: "瀑布溪流", thumbnail: "/placeholder.svg", downloads: 23 },
]

const deviceData = [
  { name: "苹果", value: 4544 },
  { name: "华为", value: 3321 },
  { name: "小米", value: 3113 },
  { name: "OPPO", value: 2341 },
  { name: "VIVO", value: 1231 },
  { name: "其他", value: 1012 },
]

const systemData = [
  { name: "iOS", value: 4544 },
  { name: "安卓", value: 6685 },
  { name: "鸿蒙", value: 3321 },
]

const deviceColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5']
const systemColors = ['#4ECDC4', '#45B7D1', '#FF6B6B']

export function DownloadStats() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUp className="h-4 w-4 text-green-500" />
              下载 TOP 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDownloads.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={70}
                    height={70}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.downloads.toLocaleString()} 次下载
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowDown className="h-4 w-4 text-red-500" />
              下载 LAST 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lastDownloads.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={70}
                    height={70}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.downloads.toLocaleString()} 次下载
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">设备品牌分布</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPieChart data={deviceData} colors={deviceColors} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {deviceData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: deviceColors[index] }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {((item.value / deviceData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">系统类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPieChart data={systemData} colors={systemColors} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {systemData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: systemColors[index] }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {((item.value / systemData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

