import { NextRequest, NextResponse } from "next/server"
import { createConnection } from "@/lib/db"

export async function GET() {
  try {
    const connection = await createConnection()

    // 获取系统设置
    const [rows]: any = await connection.execute(
      'SELECT * FROM system_settings LIMIT 1'
    )

    await connection.end()

    return NextResponse.json({
      code: 0,
      data: rows[0] || {}
    })
  } catch (error: any) {
    return NextResponse.json({
      code: 1,
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { share_header_text, share_button_text } = body

    // 验证必填字段
    if (!share_header_text?.trim() || !share_button_text?.trim()) {
      return NextResponse.json({
        code: 1,
        message: '所有字段都不能为空'
      }, { status: 400 })
    }

    const connection = await createConnection()

    // 更新系统设置
    await connection.execute(
      `ALTER TABLE system_settings 
       MODIFY COLUMN share_header_text TEXT,
       MODIFY COLUMN share_button_text VARCHAR(255)`
    )

    await connection.execute(
      `UPDATE system_settings SET 
       share_header_text = ?,
       share_button_text = ?`,
      [share_header_text, share_button_text]
    )

    await connection.end()

    return NextResponse.json({
      code: 0,
      message: '保存成功'
    })
  } catch (error: any) {
    return NextResponse.json({
      code: 1,
      message: error.message
    }, { status: 500 })
  }
}
