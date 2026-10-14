"use client"

import * as React from "react"
import {
  FolderKanban,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"

export function KpiCards() {
  const { projects, clients, approvals, invoices } = useDashboard()

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length

  const outstandingTotal = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((acc, inv) => acc + inv.amount, 0)

  const formattedOutstanding = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(outstandingTotal)

  const cards = [
    {
      title: "Active Projects",
      value: projects.length.toString(),
      trend: "+2 this month",
      trendUp: true,
      subtitle: "8 on schedule • 4 in review",
      icon: FolderKanban,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50",
    },
    {
      title: "Active Clients",
      value: clients.length.toString(),
      trend: "+4 this quarter",
      trendUp: true,
      subtitle: "100% portal engagement",
      icon: Users,
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900/50",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovalsCount.toString(),
      badge: "Action Required",
      badgeVariant: "amber",
      subtitle: "Avg turnaround: 18 hrs",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50",
    },
    {
      title: "Outstanding Invoices",
      value: formattedOutstanding,
      trend: "2 pending payment",
      trendNeutral: true,
      subtitle: "Next payout scheduled in 3 days",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border border-border bg-card text-card-foreground hover:border-primary/40 transition-all hover:shadow-md rounded-xl overflow-hidden"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>

              {card.trend && (
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                    card.trendUp
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {card.trendUp && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
                  {card.trend}
                </span>
              )}

              {card.badge && (
                <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {card.badge}
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-muted-foreground border-t border-border pt-2.5">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
