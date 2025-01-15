import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq7261449',
  database: 'wallpaper',
  charset: 'utf8mb4'  // 添加字符集设置
})

// 获取壁纸列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')
    const keyword = searchParams.get('keyword')

    let query = `
      SELECT w.*, s.name as shop_name 
      FROM wallpapers w 
      LEFT JOIN shops s ON w.shop_id = s.id 
      WHERE 1=1
    `
    const params: any[] = []

    if (shopId) {
      query += ' AND w.shop_id = ?'
      params.push(shopId)
    }

    if (keyword) {
      query += ' AND w.name LIKE ?'
      params.push(`%${keyword}%`)
    }

    query += ' ORDER BY w.created_at DESC'

    const [rows] = await db.execute(query, params)
    
    // 处理返回数据
    const processedRows = (rows as any[]).map(row => {
      const imageUrls = JSON.parse(row.image_urls)
      return {
        id: row.id,
        name: row.name,
        shopId: row.shop_id,
        shop_name: row.shop_name,
        image_count: row.image_count,
        created_at: row.created_at,
        files: imageUrls.map((file: any, index: number) => {
          const isVideo = typeof file === 'string' 
            ? file.toLowerCase().endsWith('.mp4')
            : file.url.toLowerCase().endsWith('.mp4')
          const url = typeof file === 'string' ? file : file.url
          const name = typeof file === 'string' 
            ? file.split('/').pop() || '未命名文件'
            : file.originalName || file.url.split('/').pop() || '未命名文件'
          return {
            id: `file-${index}`,
            name,
            url,
            type: isVideo ? 'video/mp4' : 'image/jpeg',
            thumbnail: url
          }
        })
      }
    })

    return NextResponse.json(processedRows)

  } catch (error) {
    console.error('Get wallpapers error:', error)
    return NextResponse.json(
      { error: '获取壁纸列表失败' },
      { status: 500 }
    )
  }
}

// 创建新壁纸
export async function POST(request: Request) {
  const connection = await db.getConnection()
  
  try {
    console.log('Creating wallpaper...')
    const body = await request.json()
    console.log('Request body:', body)

    const { name, shopId, files } = body

    if (!name || !shopId || !files || files.length === 0) {
      console.error('Missing required fields:', { name, shopId, files })
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
    console.log('Found shops:', shops)

    if (!Array.isArray(shops) || shops.length === 0) {
      console.error('Shop not found:', shopId)
      return NextResponse.json(
        { error: '店铺不存在' },
        { status: 400 }
      )
    }

    try {
      await connection.beginTransaction()
      console.log('Transaction started')

      // 准备数据
      const fileUrls = files.map(f => ({
        url: f.url,
        originalName: f.name
      }))
      const thumbnailUrl = files[0].url

      console.log('Prepared data:', {
        name,
        shopId,
        imageCount: files.length,
        thumbnailUrl,
        fileUrls
      })

      // 创建壁纸记录
      const [result]: any = await connection.execute(
        `INSERT INTO wallpapers 
        (name, shop_id, image_count, thumbnail_url, image_urls, created_at) 
        VALUES (?, ?, ?, CONVERT(? USING utf8mb4), CONVERT(? USING utf8mb4), NOW())`,
        [
          name,
          shopId,
          files.length,
          thumbnailUrl,
          JSON.stringify(fileUrls)
        ]
      )

      await connection.commit()
      console.log('Transaction committed')

      const response = {
        id: result.insertId,
        name,
        shopId,
        files: files.map(f => ({
          ...f,
          name: f.name || f.url.split('/').pop() || '未命名文件'
        })),
        shop_name: shops[0].name
      }
      console.log('Sending response:', response)

      return NextResponse.json(response)

    } catch (error) {
      console.error('Database error:', error)
      await connection.rollback()
      throw error
    }

  } catch (error) {
    console.error('Create wallpaper error:', error)
    return NextResponse.json(
      { error: '创建壁纸失败: ' + (error as Error).message },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

// 删除壁纸
export async function DELETE(request: Request) {
  try {
    const id = request.url.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: '缺少壁纸ID' },
        { status: 400 }
      )
    }

    const [result]: any = await db.execute(
      'DELETE FROM wallpapers WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: '壁纸不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete wallpaper error:', error)
    return NextResponse.json(
      { error: '删除壁纸失败' },
      { status: 500 }
    )
  }
}
