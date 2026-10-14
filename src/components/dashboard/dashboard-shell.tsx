"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog"
import { CreateClientDialog } from "@/components/dashboard/create-client-dialog"
import { CreateInvoiceDialog } from "@/components/dashboard/create-invoice-dialog"
import { SearchDialog } from "@/components/dashboard/search-dialog"
import { HelpDialog } from "@/components/dashboard/help-dialog"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="dashboard-content-bg min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </SidebarInset>

      {/* Global Interactive Modals */}
      <CreateProjectDialog />
      <CreateClientDialog />
      <CreateInvoiceDialog />
      <SearchDialog />
      <HelpDialog />
    </SidebarProvider>
  )
}

