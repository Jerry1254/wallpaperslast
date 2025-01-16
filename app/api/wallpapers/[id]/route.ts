import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// 更新壁纸
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connection = await db.getConnection()
  
  try {
    const body = await request.json()
    const { name, shopId, files } = body

    if (!name || !shopId || !files || files.length === 0) {
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      )
    }

    // 检查店铺是否存在
    const [shops]: any = await connection.execute(
      'SELECT id, name FROM shops WHERE id = ?',
      [shopId]
    )

    if (!Array.isArray(shops) || shops.length === 0) {
      return NextResponse.json(
        { error: '店铺不存在' },
        { status: 400 }
      )
    }

    // 获取原来的壁纸信息
    const [wallpapers]: any = await connection.execute(
      'SELECT id, image_urls FROM wallpapers WHERE id = ?',
      [params.id]
    )

    if (!Array.isArray(wallpapers) || wallpapers.length === 0) {
      return NextResponse.json(
        { error: '壁纸不存在' },
        { status: 404 }
      )
    }

    // 获取原来的文件列表
    const oldFiles = JSON.parse(wallpapers[0].image_urls)
    console.log('Old files:', oldFiles)
    
    // 获取新的文件列表
    const newFiles = files.map((f: any) => ({
      url: f.url,
      originalName: f.name || f.url.split('/').pop() || '未命名文件'
    }))
    console.log('New files:', newFiles)

    // 找出被删除的文件
    const deletedFiles = oldFiles.filter((oldFile: any) => 
      !newFiles.some((newFile: any) => newFile.url === oldFile.url)
    )
    console.log('Deleted files:', deletedFiles)

    // 删除被移除的文件
    const publicDir = path.join(process.cwd(), 'public')
    for (const file of deletedFiles) {
      try {
        const relativePath = file.url.startsWith('/') ? file.url.slice(1) : file.url
        const fullPath = path.join(publicDir, relativePath)
        
        console.log('Attempting to delete:', fullPath)
        
        if (existsSync(fullPath)) {
          await fs.unlink(fullPath)
          console.log('Successfully deleted:', fullPath)
        } else {
          console.log('File does not exist:', fullPath)
        }
      } catch (error) {
        console.error('Error deleting file:', {
          url: file.url,
          error: error.message
        })
      }
    }

    // 更新壁纸记录
    await connection.execute(
      `UPDATE wallpapers 
      SET name = ?, 
          shop_id = ?, 
          image_count = ?, 
          thumbnail_url = CONVERT(? USING utf8mb4), 
          image_urls = CONVERT(? USING utf8mb4)
      WHERE id = ?`,
      [
        name,
        shopId,
        files.length,
        files[0].url,
        JSON.stringify(newFiles),
        params.id
      ]
    )

    return NextResponse.json({ 
      id: params.id,
      name,
      shopId,
      files: newFiles,
      shop_name: shops[0].name
    })

  } catch (error) {
    console.error('Update wallpaper error:', error)
    return NextResponse.json(
      { error: '更新壁纸失败' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

// 删除壁纸
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const connection = await db.getConnection()
  
  try {
    // 先获取壁纸信息
    const [wallpapers]: any = await connection.execute(
      'SELECT * FROM wallpapers WHERE id = ?',
      [params.id]
    )

    if (!Array.isArray(wallpapers) || wallpapers.length === 0) {
      return NextResponse.json(
        { error: '壁纸不存在' },
        { status: 404 }
      )
    }

    // 获取文件信息
    const files = JSON.parse(wallpapers[0].image_urls)
    console.log('Files to delete:', files)

    // 删除壁纸记录
    const [result]: any = await connection.execute(
      'DELETE FROM wallpapers WHERE id = ?',
      [params.id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '删除数据库记录失败' },
        { status: 500 }
      )
    }

    // 删除文件
    const uploadsDir = path.join(process.cwd(), 'public')
    console.log('Base directory:', uploadsDir)

    // 删除每个文件
    for (const file of files) {
      try {
        // 从 url 中提取相对路径
        const relativePath = file.url.startsWith('/') ? file.url.slice(1) : file.url
        const fullPath = path.join(uploadsDir, relativePath)
        
        console.log('Deleting file:', {
          url: file.url,
          originalName: file.originalName,
          fullPath
        })

        // 检查并删除文件
        if (existsSync(fullPath)) {
          await fs.unlink(fullPath)
          console.log('Successfully deleted:', fullPath)
        } else {
          console.log('File does not exist:', fullPath)
        }
      } catch (error) {
        console.error('Error deleting file:', {
          url: file.url,
          error: error.message
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete wallpaper error:', error)
    return NextResponse.json(
      { error: '删除壁纸失败' },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}
