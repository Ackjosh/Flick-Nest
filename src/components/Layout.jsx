import React from 'react'
import { SidebarProvider, SidebarTrigger } from './ui/Sidebar'
import { AppSidebar } from './AppSidebar'

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex relative h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}