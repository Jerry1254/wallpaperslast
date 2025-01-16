"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ImageIcon, LayoutDashboard, Users, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
}

const menuItems = [
  {
    title: "仪表盘",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "壁纸管理",
    icon: ImageIcon,
    href: "/wallpapers",
  },
  {
    title: "用户管理",
    icon: Users,
    href: "/users",
  },
  {
    title: "分享页设置",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()
  return (
    <aside
      className={cn(
        "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform md:sticky",
        !isOpen && "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}
