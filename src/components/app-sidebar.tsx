"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  FolderArchive,
  CheckSquare,
  Receipt,
  Activity,
  Settings,
  Plus,
  Sparkles,
  ChevronsUpDown,
  Building2,
  Check,
  LogOut,
  CreditCard,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboard } from "@/context/dashboard-context"

const WORKSPACES = [
  { id: "ws-1", name: "Acme Creative Agency", plan: "Agency Pro Tier" },
  { id: "ws-2", name: "Freelance Design Lab", plan: "Solo Creator Tier" },
  { id: "ws-3", name: "Starlight Digital", plan: "Agency Pro Tier" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { projects, clients, approvals, setIsCreateProjectOpen } = useDashboard()
  const { isMobile } = useSidebar()
  const [activeWorkspace, setActiveWorkspace] = React.useState(WORKSPACES[0])

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length

  const mainNav = [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard,
      isActive: pathname === "/" || pathname === "/dashboard",
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderKanban,
      badge: projects.length.toString(),
      isActive: pathname.startsWith("/projects"),
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
      badge: clients.length.toString(),
      isActive: pathname.startsWith("/clients"),
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
      badge: "3",
      isActive: pathname.startsWith("/messages"),
    },
    {
      title: "Files",
      url: "/files",
      icon: FolderArchive,
      isActive: pathname.startsWith("/files"),
    },
    {
      title: "Approvals",
      url: "/approvals",
      icon: CheckSquare,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount.toString() : undefined,
      badgeVariant: "warning",
      isActive: pathname.startsWith("/approvals"),
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Receipt,
      isActive: pathname.startsWith("/invoices"),
    },
  ]

  const secondaryNav = [
    {
      title: "Activity",
      url: "/activity",
      icon: Activity,
      isActive: pathname.startsWith("/activity"),
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      isActive: pathname.startsWith("/settings"),
    },
  ]

  return (
    <Sidebar collapsible="icon" className="app-sidebar border-r border-sidebar-border" {...props}>
      {/* Workspace / Brand Header */}
      <SidebarHeader className="border-b border-sidebar-border pb-3 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
                >
                  <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#2447A8] to-[#4778F5] text-white shadow-md shadow-blue-900/40">
                    <Sparkles className="size-4.5 text-white" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold tracking-tight text-sidebar-foreground">
                        ClientSpace
                      </span>
                      <span className="rounded bg-blue-500/10 dark:bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-medium text-blue-700 dark:text-blue-300 border border-blue-400/30">
                        Pro
                      </span>
                    </div>
                    <span className="truncate text-xs text-sidebar-muted">
                      {activeWorkspace.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto text-sidebar-muted size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl"
                align="start"
                side={isMobile ? "bottom" : "right"}
              >
                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                  Switch Workspace
                </DropdownMenuLabel>
                {WORKSPACES.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => setActiveWorkspace(ws)}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer hover:bg-accent text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-foreground">{ws.name}</p>
                        <p className="text-[10px] text-muted-foreground">{ws.plan}</p>
                      </div>
                    </div>
                    {activeWorkspace.id === ws.id && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-accent text-xs font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Quick action button inside sidebar */}
        <div className="px-2 pt-2 group-data-[collapsible=icon]:hidden">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#2447A8] to-[#3B66D4] hover:from-[#1E3E96] hover:to-[#2F55B8] text-white text-xs font-medium py-2 px-3 shadow-md shadow-blue-950/40 transition-all border border-blue-400/20 active:scale-[0.99]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-3 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-heading px-2 font-medium">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title}
                  className="rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all data-[active=true]:shadow-sm"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    {item.badge && (
                      <span
                        className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full group-data-[collapsible=icon]:hidden ${
                          item.badgeVariant === "warning"
                            ? "bg-amber-400 text-slate-900 shadow-xs"
                            : item.isActive
                            ? "bg-blue-600/15 text-blue-700 dark:bg-white/20 dark:text-white"
                            : "bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-blue-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-heading px-2 font-medium">
            Management
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {secondaryNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title}
                  className="rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all data-[active=true]:shadow-sm"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-blue-400/30">
                    <AvatarFallback className="rounded-lg bg-gradient-to-tr from-[#14265C] to-[#2447A8] text-white text-xs font-semibold">
                      AM
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium text-sidebar-foreground">Alex Morgan</span>
                    <span className="truncate text-xs text-sidebar-muted">
                      alex@clientspace.design
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto text-sidebar-muted size-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-foreground leading-none">
                      Alex Morgan
                    </p>
                    <p className="text-xs text-muted-foreground leading-none">
                      alex@clientspace.design
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-xs">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Account Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/invoices" className="flex items-center gap-2 cursor-pointer text-xs">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>Billing & Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-xs">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Workspace Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 dark:text-red-400 text-xs"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
