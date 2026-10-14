"use client"

import * as React from "react"
import Link from "next/link"
import {
  Receipt,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/dashboard-context"

export function InvoiceSummaryCard() {
  const { invoices, markInvoicePaid, setIsCreateInvoiceOpen } = useDashboard()

  const paidTotal = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const pendingTotal = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const overdueTotal = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const total = paidTotal + pendingTotal + overdueTotal || 1
  const paidPercent = Math.round((paidTotal / total) * 100)
  const pendingPercent = Math.round((pendingTotal / total) * 100)
  const overduePercent = Math.round((overdueTotal / total) * 100)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  // Show top 3 invoices
  const recentInvoices = invoices.slice(0, 3)

  return (
    <Card className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Receipt className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Invoices & Billing Summary
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Financial pipeline and recent client billing status
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="h-8 px-2.5 text-xs text-primary border-primary/30 hover:bg-primary/10"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>New Invoice</span>
          </Button>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            <span>All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Metric breakdown cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              Paid
            </span>
            <span className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100 mt-0.5 block">
              {formatCurrency(paidTotal)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
              Pending
            </span>
            <span className="text-base sm:text-lg font-bold text-amber-950 dark:text-amber-100 mt-0.5 block">
              {formatCurrency(pendingTotal)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50">
            <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider block">
              Overdue
            </span>
            <span className="text-base sm:text-lg font-bold text-rose-950 dark:text-rose-100 mt-0.5 block">
              {formatCurrency(overdueTotal)}
            </span>
          </div>
        </div>

        {/* Visual segmented distribution bar */}
        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-muted flex overflow-hidden">
            <div
              style={{ width: `${paidPercent}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`Paid: ${paidPercent}%`}
            />
            <div
              style={{ width: `${pendingPercent}%` }}
              className="bg-amber-400 transition-all duration-300"
              title={`Pending: ${pendingPercent}%`}
            />
            <div
              style={{ width: `${overduePercent}%` }}
              className="bg-rose-500 transition-all duration-300"
              title={`Overdue: ${overduePercent}%`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {paidPercent}% collected
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {pendingPercent}% pending
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              {overduePercent}% overdue
            </span>
          </div>
        </div>

        {/* Recent invoices list */}
        <div className="divide-y divide-border border-t border-border pt-3">
          {recentInvoices.map((inv) => (
            <div
              key={inv.id}
              className="py-2.5 flex items-center justify-between text-xs hover:bg-accent/40 px-1 rounded-md transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{inv.id}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-medium">{inv.clientName || inv.client}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Due {inv.dueDate} • {inv.projectName || "Contract Work"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-foreground">
                  {formatCurrency(inv.amount)}
                </span>

                {inv.status === "paid" ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60 text-[10px]">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                ) : inv.status === "pending" ? (
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 text-[10px]">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markInvoicePaid(inv.id)}
                      className="h-6 px-1.5 text-[11px] text-primary hover:text-primary/80 hover:bg-primary/10"
                    >
                      Mark Paid
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 text-[10px]">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markInvoicePaid(inv.id)}
                      className="h-6 px-1.5 text-[11px] text-primary hover:text-primary/80 hover:bg-primary/10"
                    >
                      Mark Paid
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
