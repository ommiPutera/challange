import { Outlet } from "@remix-run/react";

// import DashboardHeader from "./header";
import DashboardSidebar from "./sidebar";

export default function DashboardLayout() {

  return (
    <div className="bg-muted/50 relative">
      <div className="flex">
        <div className="bg-grey-50 fixed z-50 hidden h-full w-full max-w-[var(--sidebar-width)] overflow-hidden md:block">
          <DashboardSidebar />
        </div>
        <div className="relative h-full w-full md:ml-auto md:w-[calc(100%_-_var(--sidebar-width))]">
          <div className="container mx-auto h-full w-full px-6 py-10 min-h-screen">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}