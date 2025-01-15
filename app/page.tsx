import { redirect } from 'next/navigation'

export default function Home() {
  // 这里可以添加验证登录状态的逻辑
  const isAuthenticated = false // 示例，实际应该从你的认证系统中获取

  if (!isAuthenticated) {
    redirect('/login')
  }

  redirect('/dashboard')
}

