"use client"

import * as React from "react"
import {
  Activity,
  Search,
  FileCheck,
  CreditCard,
  Upload,
  MessageSquare,
  Clock,
  Download,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"

export default function ActivityPage() {
  const { activities } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")

  const filteredActivities = activities.filter((act) => {
    const userStr = act.userName || act.user || ""
    const projStr = act.projectName || act.project || ""
    const typeStr = act.type || act.category || ""
    const matchesSearch =
      userStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      projStr.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || typeStr.toLowerCase().includes(typeFilter.toLowerCase())
    return matchesSearch && matchesType
  })

  const getIcon = (type?: string) => {
    const t = type || ""
    if (t.includes("approval")) {
      return <FileCheck className="h-4 w-4 text-emerald-600" />
    }
    if (t.includes("invoice")) {
      return <CreditCard className="h-4 w-4 text-blue-600" />
    }
    if (t.includes("file")) {
      return <Upload className="h-4 w-4 text-indigo-600" />
    }
    if (t.includes("message")) {
      return <MessageSquare className="h-4 w-4 text-slate-600" />
    }
    return <Activity className="h-4 w-4 text-slate-600" />
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Activity & Audit Log
            </h1>
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tamper-evident chronological audit trail of all approvals, asset uploads, and invoices.
          </p>
        </div>

        <Button
          variant="outline"
          className="border-border hover:bg-muted text-foreground text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Download className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <span>Export Audit Log</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activity by user, action, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/40 border-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
          {[
            { id: "all", label: "All Events" },
            { id: "approval", label: "Approvals" },
            { id: "invoice", label: "Invoices" },
            { id: "file", label: "Files" },
            { id: "message", label: "Messages" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === tab.id
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <Card className="border border-border bg-card rounded-xl shadow-2xs overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 text-xs group">
                {/* Timeline node */}
                <div className="absolute -left-6 sm:-left-8 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-card border-2 border-blue-600 dark:border-blue-500 shadow-2xs">
                  {getIcon(act.type || act.category)}
                </div>

                <div className="flex-1 bg-muted/40 hover:bg-muted/70 border border-border p-3.5 rounded-xl transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-foreground text-xs sm:text-sm">
                      <span className="font-bold text-foreground">{act.userName || act.user}</span>{" "}
                      <span className="text-muted-foreground">{act.action}</span>{" "}
                      <strong className="text-foreground font-semibold">{act.target}</strong>
                    </p>
                    <span className="text-[11px] text-muted-foreground/80 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {act.time || act.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">Project:</span>
                    <span>{act.projectName || act.project || "Client Project"}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[10px] bg-card text-muted-foreground border-border">
                      {act.type || act.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
