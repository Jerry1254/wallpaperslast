import { NextRequest, NextResponse } from "next/server"
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq761449',
  database: 'wallpaper',
  charset: 'utf8mb4'  // 添加字符集设置
})

// 获取壁纸列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const shopId = searchParams.get('shopId')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const offset = (page - 1) * pageSize

    console.log('[API] Request params:', { search, shopId, page, pageSize, offset })

    // 首先获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM wallpapers w WHERE 1=1'
    const countParams: any[] = []

    if (search) {
      countQuery += ' AND w.name LIKE ?'
      countParams.push(`%${search}%`)
    }

    if (shopId) {
      countQuery += ' AND w.shop_id = ?'
      countParams.push(shopId)
    }

    console.log('[API] Count query:', {
      sql: countQuery,
      params: countParams
    })

    // 测试数据库连接
    try {
      const connection = await db.getConnection()
      console.log('[API] Database connection successful')
      
      try {
        // 获取总数
        const [countRows]: any = await connection.query(countQuery, countParams)
        console.log('[API] Count result:', countRows[0])
        const total = countRows[0].total

        // 获取分页数据
        let query = `
          SELECT w.*, s.name as shop_name
          FROM wallpapers w
          LEFT JOIN shops s ON w.shop_id = s.id
          WHERE 1=1
        `
        const params: any[] = []

        if (search) {
          query += ' AND w.name LIKE ?'
          params.push(`%${search}%`)
        }

        if (shopId) {
          query += ' AND w.shop_id = ?'
          params.push(shopId)
        }

        query += ' ORDER BY w.created_at DESC LIMIT ? OFFSET ?'
        params.push(Number(pageSize), Number(offset))

        console.log('[API] Data query:', {
          sql: query,
          params: params
        })

        const [rows] = await connection.query(query, params)
        console.log('[API] Query result:', {
          count: (rows as any[]).length,
          first: (rows as any[]).length > 0 ? (rows as any[])[0] : null
        })
        
        // 处理返回数据
        const processedRows = (rows as any[]).map((row, index) => {
          try {
            console.log(`[API] Processing row ${index}:`, {
              id: row.id,
              name: row.name,
              image_urls: row.image_urls,
              image_url: row.image_url
            })

            const imageUrls = JSON.parse(row.image_urls || row.image_url)
            console.log(`[API] Parsed imageUrls for row ${index}:`, imageUrls)
            
            return {
              id: row.id,
              name: row.name,
              shopId: row.shop_id,
              shop_name: row.shop_name,
              image_count: imageUrls.length,
              created_at: row.created_at,
              files: imageUrls.map((file: any) => {
                if (typeof file === 'string') {
                  const name = file.split('/').pop() || '未命名文件'
                  return {
                    id: name,
                    name,
                    url: file,
                    type: file.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
                    thumbnail: file
                  }
                } else {
                  return {
                    id: file.originalName || file.url.split('/').pop() || '未命名文件',
                    name: file.originalName || file.url.split('/').pop() || '未命名文件',
                    url: file.url,
                    type: file.url.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
                    thumbnail: file.url
                  }
                }
              })
            }
          } catch (err) {
            console.error(`[API] Error processing row ${index}:`, {
              error: err,
              row: row
            })
            throw new Error(`处理数据错误: ${err.message}`)
          }
        })

        console.log('[API] Successfully processed all rows')
        return NextResponse.json({
          code: 0,
          data: {
            list: processedRows,
            pagination: {
              current: page,
              pageSize,
              total
            }
          }
        })
      } catch (queryError) {
        console.error('[API] Query error:', {
          error: queryError,
          message: queryError.message,
          code: queryError.code,
          errno: queryError.errno,
          sqlState: queryError.sqlState,
          sqlMessage: queryError.sqlMessage
        })
        throw new Error(`数据库查询错误: ${queryError.message}`)
      } finally {
        connection.release()
      }
    } catch (dbError) {
      console.error('[API] Database error:', {
        error: dbError,
        message: dbError.message,
        code: dbError.code,
        errno: dbError.errno,
        sqlState: dbError.sqlState,
        sqlMessage: dbError.sqlMessage
      })
      throw new Error(`数据库连接错误: ${dbError.message}`)
    }
  } catch (error) {
    console.error('[API] Error:', {
      error,
      message: error.message,
      stack: error.stack
    })
    
    return NextResponse.json(
      {
        error: '获取壁纸列表失败',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// 创建新壁纸
export async function POST(request: NextRequest) {
  const connection = await db.getConnection()
  
  try {
    console.log('[API] Creating wallpaper...')
    const body = await request.json()
    console.log('[API] Request body:', body)

    const { name, shopId, files } = body

    if (!name || !shopId || !files || files.length === 0) {
      console.error('[API] Missing required fields:', { name, shopId, files })
      return NextResponse.json(
        { error: '请填写完整信息' },
        { status: 400 }
      )
    }

    // 检查店铺是否存在
    const [shops]: any = await connection.query(
      'SELECT id, name FROM shops WHERE id = ?',
      [shopId]
    )
    console.log('[API] Found shops:', shops)

    if (!Array.isArray(shops) || shops.length === 0) {
      console.error('[API] Shop not found:', shopId)
      return NextResponse.json(
        { error: '店铺不存在' },
        { status: 400 }
      )
    }

    try {
      await connection.beginTransaction()
      console.log('[API] Transaction started')

      // 准备数据
      const fileUrls = files.map(f => ({
        url: f.url,
        originalName: f.name || f.url.split('/').pop() || '未命名文件'
      }))
      const thumbnailUrl = files[0].url

      console.log('[API] Prepared data:', {
        name,
        shopId,
        imageCount: files.length,
        thumbnailUrl,
        fileUrls
      })

      // 创建壁纸记录
      const [result]: any = await connection.query(
        `INSERT INTO wallpapers 
        (name, shop_id, image_count, thumbnail_url, image_urls, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          name,
          shopId,
          files.length,
          thumbnailUrl,
          JSON.stringify(fileUrls)
        ]
      )

      await connection.commit()
      console.log('[API] Transaction committed')

      const response = {
        id: result.insertId,
        name,
        shopId,
        files: fileUrls.map(f => ({
          id: f.originalName,
          name: f.originalName,
          url: f.url,
          type: f.url.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
          thumbnail: f.url
        })),
        shop_name: shops[0].name
      }
      console.log('[API] Sending response:', response)

      return NextResponse.json(response)

    } catch (error) {
      console.error('[API] Database error:', error)
      if (error instanceof Error) {
        console.error('[API] Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
      await connection.rollback()
      throw error
    }

  } catch (error) {
    console.error('[API] Create wallpaper error:', error)
    if (error instanceof Error) {
      console.error('[API] Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { 
        error: '创建壁纸失败: ' + (error instanceof Error ? error.message : String(error)),
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    connection.release()
  }
}

// 删除壁纸
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: '缺少壁纸ID' },
        { status: 400 }
      )
    }

    const [result]: any = await db.query(
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
    console.error('[API] Delete wallpaper error:', error)
    if (error instanceof Error) {
      console.error('[API] Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { 
        error: '删除壁纸失败: ' + (error instanceof Error ? error.message : String(error)),
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
