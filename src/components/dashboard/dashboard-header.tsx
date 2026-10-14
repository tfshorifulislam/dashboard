"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  HelpCircle,
  Plus,
  FolderKanban,
  Users,
  Receipt,
  ChevronDown,
} from "lucide-react"
import { NotificationsPopover } from "@/components/dashboard/notifications-popover"
import { useDashboard } from "@/context/dashboard-context"

const ROUTE_LABELS: Record<string, string> = {
  "/": "Overview",
  "/dashboard": "Overview",
  "/projects": "Projects",
  "/clients": "Clients",
  "/messages": "Messages",
  "/files": "Files & Assets",
  "/approvals": "Approvals & Sign-offs",
  "/invoices": "Invoices & Billing",
  "/activity": "Activity Audit Log",
  "/settings": "Workspace Settings",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const {
    setIsSearchOpen,
    setIsHelpOpen,
    setIsCreateProjectOpen,
    setIsCreateClientOpen,
    setIsCreateInvoiceOpen,
  } = useDashboard()

  const currentTitle = ROUTE_LABELS[pathname] || "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 transition-all">
      {/* Left: Sidebar toggle & breadcrumbs */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-slate-700 hover:text-slate-900" />
        <Separator orientation="vertical" className="h-4 bg-slate-200" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbLink asChild>
                <Link href="/" className="text-slate-500 hover:text-blue-600 font-medium">
                  ClientSpace
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-slate-900">
                {currentTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Search, Quick create, Help, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 h-9 w-36 sm:w-64 md:w-72 rounded-lg border border-slate-200 bg-slate-50/80 px-3 text-xs text-slate-500 hover:bg-slate-100/80 hover:border-slate-300 transition-all text-left shadow-2xs"
          aria-label="Open search"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate flex-1">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white font-medium text-xs shadow-sm shadow-blue-900/20 rounded-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-lg border-slate-200">
            <DropdownMenuItem
              onClick={() => setIsCreateProjectOpen(true)}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer font-medium text-slate-800 hover:bg-blue-50"
            >
              <FolderKanban className="h-4 w-4 text-blue-600" />
              <span>New Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsCreateClientOpen(true)}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer font-medium text-slate-800 hover:bg-blue-50"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Add New Client</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="flex items-center gap-2 text-xs py-2 cursor-pointer font-medium text-slate-800 hover:bg-blue-50"
            >
              <Receipt className="h-4 w-4 text-emerald-600" />
              <span>Create Invoice</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Popover */}
        <NotificationsPopover />

        {/* Help Dialog Trigger */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsHelpOpen(true)}
          className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-600"
          aria-label="Help and shortcuts"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

