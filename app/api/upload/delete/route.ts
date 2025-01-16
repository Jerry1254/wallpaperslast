import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { path: filePath } = await request.json()
    
    if (!filePath) {
      return NextResponse.json(
        { error: '文件路径不能为空' },
        { status: 400 }
      )
    }

    // 确保文件路径在 public/uploads 目录下
    if (!filePath.startsWith('uploads/')) {
      return NextResponse.json(
        { error: '无效的文件路径' },
        { status: 400 }
      )
    }

    // 构建完整的文件路径
    const fullPath = path.join(process.cwd(), 'public', filePath)

    // 检查文件是否存在
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      )
    }

    // 删除文件
    await fs.unlink(fullPath)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete file error:', error)
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    )
  }
}
