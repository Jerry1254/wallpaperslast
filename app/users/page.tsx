"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { UserList } from "@/components/user-list"
import { Button } from "@/components/ui/button"
import { AddUserModal } from "@/components/add-user-modal"

export default function UsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [key, setKey] = useState(0) // 用于强制刷新UserList组件

  return (
    <AdminLayout>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">用户管理</h1>
          <Button variant="default" onClick={() => setIsAddModalOpen(true)}>新增用户</Button>
        </div>
      </div>
      <UserList key={key} />
      <AddUserModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          setKey(prev => prev + 1) // 强制刷新UserList组件
        }}
      />
    </AdminLayout>
  )
}
