import { NextRequest, NextResponse } from "next/server"
import { createConnection } from "@/lib/db"

// 获取所有店铺
export async function GET() {
  try {
    const connection = await createConnection()

    // 获取所有店铺
    const [rows]: any = await connection.execute(
      'SELECT id, name FROM shops ORDER BY name'
    )

    await connection.end()

    // 确保 id 是字符串类型
    const processedRows = rows.map((row: any) => ({
      ...row,
      id: String(row.id)
    }))

    return NextResponse.json({
      code: 0,
      data: processedRows
    })
  } catch (error: any) {
    return NextResponse.json({
      code: 1,
      message: error.message
    }, { status: 500 })
  }
}

// 创建新店铺
export async function POST(request: Request) {
  const connection = await createConnection()
  
  try {
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: '店铺名称不能为空' },
        { status: 400 }
      )
    }

    // 检查店铺名是否已存在
    const [existingShops]: any = await connection.execute(
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
    const [result]: any = await connection.execute(
      'INSERT INTO shops (name) VALUES (?)',
      [name]
    )

    await connection.end()

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
  } finally {
    await connection.end()
  }
}
