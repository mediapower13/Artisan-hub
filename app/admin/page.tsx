import { VerificationDashboard } from "@/components/admin/verification-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"
import type { AdminUser } from "@/lib/types"

export default function AdminDashboardPage() {
  // Mock admin user - in real app, this would come from auth context
  const admin: AdminUser = {
    id: "admin-1",
    email: "admin@unilorin.edu.ng",
    role: "admin",
    permissions: ["manage_verifications", "view_analytics", "manage_users"],
    department: "Student Affairs"
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage provider verifications and platform oversight.
          </p>
        </div>
        
        <VerificationDashboard admin={admin} />
      </div>
    </AuthGuard>
  )
}
