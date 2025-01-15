import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取当前路径
  const path = request.nextUrl.pathname

  // 定义需要保护的路径
  const protectedPaths = ['/dashboard', '/wallpapers', '/users']
  
  // 定义公开路径
  const publicPaths = ['/login']

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp))
  
  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp))

  // 获取认证状态
  const authToken = request.cookies.get('auth_token')?.value
  const isAuthenticated = !!authToken

  // 如果用户已登录且访问登录页，重定向到仪表盘
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 如果用户未登录且访问受保护的路径，重定向到登录页
  if (!isAuthenticated && isProtectedPath) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_token')
    return response
  }

  return NextResponse.next()
}

// 配置需要运行中间件的路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
