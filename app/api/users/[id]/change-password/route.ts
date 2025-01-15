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
    const { oldPassword, newPassword } = await request.json()

    // 验证输入
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    // 验证旧密码
    const md5OldPassword = crypto
      .createHash('md5')
      .update(oldPassword)
      .digest('hex')

    const [users]: any = await db.execute(
      'SELECT id FROM users WHERE id = ? AND password = ?',
      [id, md5OldPassword]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: '原密码错误' },
        { status: 400 }
      )
    }

    // 更新新密码
    const md5NewPassword = crypto
      .createHash('md5')
      .update(newPassword)
      .digest('hex')

    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [md5NewPassword, id]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: '修改密码失败' },
      { status: 500 }
    )
  }
}
