import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // 检查壁纸是否存在
    const [wallpapers]: any = await connection.execute(
      'SELECT id FROM wallpapers WHERE id = ?',
      [params.id]
    )

    if (!Array.isArray(wallpapers) || wallpapers.length === 0) {
      return NextResponse.json(
        { error: '壁纸不存在' },
        { status: 404 }
      )
    }

    // 准备数据
    const fileUrls = files.map((f: any) => f.url)
    const thumbnailUrl = files[0].url

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
        thumbnailUrl,
        JSON.stringify(fileUrls),
        params.id
      ]
    )

    return NextResponse.json({ 
      id: params.id,
      name,
      shopId,
      files: files.map((f: any) => ({
        ...f,
        name: f.name || f.url.split('/').pop() || '未命名文件',
        thumbnail: f.url
      })),
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
    // 删除壁纸记录
    const [result]: any = await connection.execute(
      'DELETE FROM wallpapers WHERE id = ?',
      [params.id]
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
  } finally {
    connection.release()
  }
}
