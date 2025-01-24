import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const db = mysql.createPool({
  host: '111.231.24.218',
  port: 3306,
  user: 'wmh',
  password: 'Wmh@zq761449',
  database: 'wallpaper'
})

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 检查用户是否存在
    const [users]: any = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 删除用户
    await db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    )
  }
}
