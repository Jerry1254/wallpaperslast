import { NextResponse } from 'next/server'
import { createConnection } from '@/lib/db'

// 删除壁纸
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await createConnection()

    // 删除壁纸记录
    await connection.execute(
      'DELETE FROM wallpapers WHERE id = ?',
      [params.id]
    )

    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete wallpaper error:', error)
    return NextResponse.json(
      { error: '删除壁纸失败' },
      { status: 500 }
    )
  }
}
