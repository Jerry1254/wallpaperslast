"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  username: string
  role: string
}

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSuccess?: () => void
}

export function EditUserModal({
  open,
  onOpenChange,
  user,
  onSuccess
}: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "密码长度至少8位"
    }

    let score = 0
    if (/[A-Z]/.test(password)) score++ // 大写字母
    if (/[a-z]/.test(password)) score++ // 小写字母
    if (/[0-9]/.test(password)) score++ // 数字
    if (/[^A-Za-z0-9]/.test(password)) score++ // 特殊符号

    if (score < 3) {
      return "密码需包含大写字母、小写字母、数字、特殊符号中的至少三种"
    }

    return ""
  }

  const validateForm = async () => {
    const newErrors: Record<string, string> = {}

    // 验证必填项
    if (!formData.oldPassword) newErrors.oldPassword = "原密码不能为空"
    if (!formData.newPassword) newErrors.newPassword = "新密码不能为空"
    if (!formData.confirmPassword) newErrors.confirmPassword = "确认密码不能为空"

    // 验证新密码
    if (formData.newPassword) {
      const passwordError = validatePassword(formData.newPassword)
      if (passwordError) {
        newErrors.newPassword = passwordError
      }
    }

    // 验证确认密码
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致"
    }

    // 验证原密码
    if (formData.oldPassword && !newErrors.oldPassword && user) {
      try {
        const response = await fetch(`/api/users/${user.id}/verify-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: formData.oldPassword
          })
        })
        const data = await response.json()
        if (!data.valid) {
          newErrors.oldPassword = "原密码错误"
        }
      } catch (error) {
        newErrors.oldPassword = "验证原密码失败"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const isValid = await validateForm()
      if (!isValid) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/users/${user.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '修改密码失败')
      }

      toast({
        description: "密码修改成功！",
      })
      
      onOpenChange(false)
      onSuccess?.()
      
      // 重置表单
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setErrors({})
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "修改密码失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 如果没有用户数据，不显示弹窗
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>修改用户密码</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={user.username}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">原密码</Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500">{errors.oldPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "修改中..." : "修改密码"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
