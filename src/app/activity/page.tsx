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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Activity & Audit Log
            </h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident chronological audit trail of all approvals, asset uploads, and invoices.
          </p>
        </div>

        <Button
          variant="outline"
          className="border-slate-200 text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Download className="h-4 w-4 mr-1.5 text-slate-500" />
          <span>Export Audit Log</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search activity by user, action, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200"
          />
        </div>

        <div className="flex items-center rounded-lg bg-slate-100 p-1 text-xs">
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
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      <Card className="border border-slate-200 bg-white rounded-xl shadow-2xs overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 text-xs group">
                {/* Timeline node */}
                <div className="absolute -left-6 sm:-left-8 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-blue-600 shadow-2xs">
                  {getIcon(act.type || act.category)}
                </div>

                <div className="flex-1 bg-slate-50/60 hover:bg-slate-50 border border-slate-100 p-3.5 rounded-xl transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-slate-800 text-xs sm:text-sm">
                      <span className="font-bold text-slate-900">{act.userName || act.user}</span>{" "}
                      <span className="text-slate-600">{act.action}</span>{" "}
                      <strong className="text-slate-900 font-semibold">{act.target}</strong>
                    </p>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {act.time || act.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">Project:</span>
                    <span>{act.projectName || act.project || "Client Project"}</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-[10px] bg-white text-slate-600 border-slate-200">
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
