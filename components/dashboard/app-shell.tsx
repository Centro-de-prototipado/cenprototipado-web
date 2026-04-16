import { FullWidthDivider } from "@/components/ui/full-width-divider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppNavbar } from "@/components/dashboard/app-navbar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <SidebarProvider className="relative mx-auto h-svh w-full max-w-7xl lg:border-x">
        <FullWidthDivider className="top-14 z-60 -translate-y-px" />
        <AppSidebar />
        <SidebarInset>
          <AppNavbar />
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
            {children || <DashboardSkeleton />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
