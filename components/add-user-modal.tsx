"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: ""
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
    if (!formData.username) newErrors.username = "用户名不能为空"
    if (!formData.password) newErrors.password = "密码不能为空"
    if (!formData.confirmPassword) newErrors.confirmPassword = "确认密码不能为空"
    if (!formData.role) newErrors.role = "请选择角色"

    // 验证密码
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    // 验证确认密码
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次输入的密码不一致"
    }

    // 验证用户名唯一性
    if (formData.username && !newErrors.username) {
      try {
        const response = await fetch('/api/users/check-username?username=' + encodeURIComponent(formData.username))
        const data = await response.json()
        if (!data.available) {
          newErrors.username = "用户名已存在"
        }
      } catch (error) {
        newErrors.username = "验证用户名失败"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const isValid = await validateForm()
      if (!isValid) {
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '创建用户失败')
      }

      toast({
        description: "用户创建成功！",
      })
      
      onOpenChange(false)
      onSuccess?.()
      
      // 重置表单
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        role: ""
      })
      setErrors({})

    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "创建用户失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增用户</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              error={errors.username}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={errors.password}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="user">核销员</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "创建中..." : "确定"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
