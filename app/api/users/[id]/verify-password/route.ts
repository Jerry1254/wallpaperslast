import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq7261449',
  database: 'wallpaper'
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: '密码不能为空' },
        { status: 400 }
      )
    }

    const md5Password = crypto
      .createHash('md5')
      .update(password)
      .digest('hex')

    const [users]: any = await db.execute(
      'SELECT id FROM users WHERE id = ? AND password = ?',
      [id, md5Password]
    )

    return NextResponse.json({
      valid: users.length > 0
    })

  } catch (error) {
    console.error('Verify password error:', error)
    return NextResponse.json(
      { error: '验证密码失败' },
      { status: 500 }
    )
  }
}
