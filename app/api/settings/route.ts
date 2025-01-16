import { NextResponse } from "next/server"
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
