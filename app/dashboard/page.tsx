import { AdminLayout } from "@/components/admin-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { DownloadStats } from "@/components/download-stats"

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <DashboardStats />
        <DownloadStats />
      </div>
    </AdminLayout>
  )
}

