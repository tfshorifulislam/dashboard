"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Mail,
  ExternalLink,
  DollarSign,
  FolderKanban,
  Calendar,
  MoreVertical,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboard } from "@/context/dashboard-context"

export default function ClientsPage() {
  const { clients, setIsCreateClientOpen } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const parseSpent = (val: string | number) => {
    if (typeof val === "number") return val
    return parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0
  }

  const filteredClients = clients.filter((c) => {
    const contactName = c.contactName || c.name || ""
    const contactEmail = c.contactEmail || c.email || ""
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      c.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const activeCount = clients.filter((c) => c.status.toLowerCase() === "active").length
  const totalRevenue = clients.reduce((acc, c) => acc + parseSpent(c.totalSpent), 0)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-semibold">
              {clients.length} Accounts
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage client relationships, portal access, project assignments, and total billings.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateClientOpen(true)}
          className="bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white shadow-md shadow-blue-950/20 text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Add New Client</span>
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Active Retainers</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Client Spend</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Avg. Client Value</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalRevenue / (clients.length || 1))}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Portal Satisfaction</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">99.2%</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by client name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
          />
        </div>

        <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">
          {["all", "active", "lead"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                statusFilter === status
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <Card
            key={client.id}
            className="border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all rounded-xl overflow-hidden flex flex-col justify-between"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarFallback className="text-sm font-bold bg-gradient-to-tr from-[#14265C] to-[#2447A8] text-white">
                      {client.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{client.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      Client since {client.joinedDate}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={
                    client.status.toLowerCase() === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                      : "bg-amber-50 text-amber-700 border-amber-200 text-xs"
                  }
                >
                  {client.status}
                </Badge>
              </div>

              {/* Contact Information */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs space-y-1">
                <p className="font-semibold text-slate-800">{client.contactName || client.name}</p>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1 text-[11px] truncate">
                    <Mail className="h-3 w-3 text-slate-400" />
                    {client.contactEmail || client.email}
                  </span>
                  <a
                    href={`mailto:${client.contactEmail || client.email}`}
                    className="text-blue-600 hover:underline text-[11px] font-medium"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Active Projects
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                    <FolderKanban className="h-3.5 w-3.5 text-blue-600" />
                    {client.activeProjects} Ongoing
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Lifetime Spend
                  </span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    {typeof client.totalSpent === "number" ? formatCurrency(client.totalSpent) : client.totalSpent}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>View Projects</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem className="cursor-pointer">Copy Portal Invite Link</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Create Client Invoice</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer text-red-600">Archive Client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
