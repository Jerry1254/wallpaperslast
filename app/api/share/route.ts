import { NextRequest, NextResponse } from "next/server"
import { createConnection } from "@/lib/db"
import crypto from 'crypto'

// 获取分享页信息
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const wallpaperId = searchParams.get('id')

    if (!wallpaperId) {
      return NextResponse.json({
        code: 1,
        message: '壁纸ID不能为空'
      }, { status: 400 })
    }

    const connection = await createConnection()

    // 获取壁纸和系统设置信息
    const [rows]: any = await connection.execute(
      `SELECT w.*, s.share_header_text, s.share_button_text
       FROM wallpapers w
       CROSS JOIN system_settings s
       WHERE w.id = ?
       LIMIT 1`,
      [wallpaperId]
    )

    await connection.end()

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        code: 1,
        message: '壁纸不存在'
      }, { status: 404 })
    }

    const wallpaper = rows[0]
    const imageUrls = JSON.parse(wallpaper.image_urls || wallpaper.image_url)

    return NextResponse.json({
      code: 0,
      data: {
        id: wallpaper.id,
        wallpaperName: wallpaper.name,
        description: wallpaper.share_header_text || '欢迎使用壁纸分享系统',
        buttonText: wallpaper.share_button_text || '全部下载',
        files: imageUrls.map((file: any, index: number) => {
          const url = typeof file === 'string' ? file : file.url
          const name = typeof file === 'string' 
            ? file.split('/').pop() || '未命名文件'
            : file.originalName || file.url.split('/').pop() || '未命名文件'
          return {
            id: `file-${index}`,
            url,
            name,
            type: url.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg'
          }
        })
      }
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      code: 1,
      message: error.message
    }, { status: 500 })
  }
}
