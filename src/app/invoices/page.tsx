"use client"

import * as React from "react"
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Send,
  MoreVertical,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboard } from "@/context/dashboard-context"

export default function InvoicesPage() {
  const { invoices, markInvoicePaid, setIsCreateInvoiceOpen } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredInvoices = invoices.filter((inv) => {
    const cli = inv.clientName || inv.client || ""
    const proj = inv.projectName || "Contract Work"
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cli.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const paidTotal = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const pendingTotal = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const overdueTotal = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const totalBilled = paidTotal + pendingTotal + overdueTotal

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Invoices & Billing</h1>
            <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 font-semibold">
              {invoices.length} Invoices
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Generate milestone invoices, monitor client payments, and track agency cash flow.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateInvoiceOpen(true)}
          className="bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white shadow-md shadow-blue-950/20 text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Create Invoice</span>
        </Button>
      </div>

      {/* Financial Breakdown KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Total Billed</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{formatCurrency(totalBilled)}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Collected Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(paidTotal)}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Pending Receivables</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{formatCurrency(pendingTotal)}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Overdue Invoices</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{formatCurrency(overdueTotal)}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice #, client, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/40 border-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
          {["all", "paid", "pending", "overdue"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                statusFilter === status
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="border border-border bg-card rounded-xl shadow-2xs overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4 sm:px-6">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-foreground">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {inv.clientName || inv.client}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {inv.projectName || "Contract Work"}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {inv.issueDate}
                    </td>
                    <td className="py-3.5 px-4 text-foreground font-medium">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground text-sm">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status === "paid" ? (
                        <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 text-xs">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : inv.status === "pending" ? (
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {inv.status !== "paid" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markInvoicePaid(inv.id)}
                            className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                          >
                            Mark Paid
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="h-3.5 w-3.5 mr-2" /> Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Send className="h-3.5 w-3.5 mr-2" /> Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
