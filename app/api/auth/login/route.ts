import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import crypto from 'crypto'
import { cookies } from 'next/headers'

// 创建数据库连接
const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq7261449',
  database: 'wallpaper'
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 对密码进行MD5加密
    const md5Password = crypto
      .createHash('md5')
      .update(password)
      .digest('hex')

    // 查询用户
    const [rows]: any = await db.execute(
      'SELECT id, username, role FROM users WHERE username = ? AND password = ?',
      [username, md5Password]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const user = rows[0]

    // 创建认证token（这里使用简单的用户ID作为token）
    const authToken = crypto
      .createHash('sha256')
      .update(user.id.toString() + Date.now().toString())
      .digest('hex')

    // 创建响应
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role
    })

    // 设置认证cookie
    response.cookies.set({
      name: 'auth_token',
      value: authToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7天
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}
