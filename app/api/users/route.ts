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

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT id, username, role, created_at as createdAt FROM users')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, role } = body

    // 验证输入
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const [existingUsers]: any = await db.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 400 }
      )
    }

    // 对密码进行MD5加密
    const md5Password = crypto
      .createHash('md5')
      .update(password)
      .digest('hex')

    // 创建新用户
    const [result]: any = await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, md5Password, role]
    )

    return NextResponse.json({ 
      success: true,
      id: result.insertId
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    )
  }
}
