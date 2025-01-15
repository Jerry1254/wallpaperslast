import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq7261449',
  database: 'wallpaper'
})

// 获取所有店铺
export async function GET() {
  try {
    const [rows] = await db.execute('SELECT id, name FROM shops ORDER BY id DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Get shops error:', error)
    return NextResponse.json(
      { error: '获取店铺列表失败' },
      { status: 500 }
    )
  }
}

// 创建新店铺
export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: '店铺名称不能为空' },
        { status: 400 }
      )
    }

    // 检查店铺名是否已存在
    const [existingShops]: any = await db.execute(
      'SELECT id FROM shops WHERE name = ?',
      [name]
    )

    if (existingShops.length > 0) {
      return NextResponse.json(
        { error: '店铺名称已存在' },
        { status: 400 }
      )
    }

    // 创建新店铺
    const [result]: any = await db.execute(
      'INSERT INTO shops (name) VALUES (?)',
      [name]
    )

    return NextResponse.json({
      success: true,
      id: result.insertId,
      name
    })

  } catch (error) {
    console.error('Create shop error:', error)
    return NextResponse.json(
      { error: '创建店铺失败' },
      { status: 500 }
    )
  }
}
