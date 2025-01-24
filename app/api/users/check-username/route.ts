import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq761449',
  database: 'wallpaper'
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: '用户名不能为空' },
        { status: 400 }
      )
    }

    const [rows]: any = await db.execute(
      'SELECT COUNT(*) as count FROM users WHERE username = ?',
      [username]
    )

    const isAvailable = rows[0].count === 0

    return NextResponse.json({ available: isAvailable })
  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { error: '验证用户名失败' },
      { status: 500 }
    )
  }
}
