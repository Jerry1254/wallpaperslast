import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { existsSync } from 'fs'

const uploadDir = join(process.cwd(), 'public/uploads')

export async function POST(request: Request) {
  try {
    console.log('Upload request received')
    
    // 确保上传目录存在
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory:', uploadDir)
      await mkdir(uploadDir, { recursive: true })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('No file in request')
      return NextResponse.json(
        { error: '请选择文件' },
        { status: 400 }
      )
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // 生成文件名
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const fileName = `${uuidv4()}.${ext}`
    const filePath = join(uploadDir, fileName)
    
    console.log('Writing file to:', filePath)

    try {
      // 将文件内容转换为 Buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // 写入文件
      await writeFile(filePath, buffer)
      console.log('File written successfully')
      
      // 返回文件URL
      const fileUrl = `/uploads/${fileName}`
      console.log('File URL:', fileUrl)
      
      return NextResponse.json({ 
        url: fileUrl,
        name: file.name,
        type: file.type,
        size: file.size
      })

    } catch (writeError) {
      console.error('File write error:', writeError)
      return NextResponse.json(
        { error: '文件写入失败: ' + (writeError as Error).message },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '文件上传失败: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
