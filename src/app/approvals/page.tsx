"use client"

import * as React from "react"
import {
  Check,
  RotateCcw,
  Clock,
  Search,
  FileCheck2,
  MessageSquare,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"

export default function ApprovalsPage() {
  const { approvals, approveDeliverable, requestRevision } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [activeFeedbackId, setActiveFeedbackId] = React.useState<string | null>(null)
  const [feedbackText, setFeedbackText] = React.useState("")

  const filteredApprovals = approvals.filter((a) => {
    const proj = a.projectName || a.project || ""
    const cli = a.clientName || a.client || ""
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cli.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      a.status.toLowerCase().replace(/[\s-_]+/g, "") ===
        statusFilter.toLowerCase().replace(/[\s-_]+/g, "")
    return matchesSearch && matchesStatus
  })

  const pendingCount = approvals.filter((a) => a.status === "pending").length
  const approvedCount = approvals.filter((a) => a.status === "approved").length
  const revisionCount = approvals.filter(
    (a) => a.status === "revision_requested" || a.status === "revision"
  ).length

  const handleApprove = (id: string) => {
    approveDeliverable(id)
  }

  const handleRequestRevision = (id: string) => {
    const note = feedbackText || "Please revise the typography hierarchy and color contrast."
    requestRevision(id, note)
    setActiveFeedbackId(null)
    setFeedbackText("")
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Deliverable Approvals
            </h1>
            <Badge variant="secondary" className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 font-semibold">
              {pendingCount} Pending Sign-off
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track client sign-offs, eliminate scope creep, and record feedback in an audit-ready log.
          </p>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Awaiting Sign-off</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Approved Milestones</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Revisions in Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{revisionCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Avg. Turnaround Time</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">18 Hours</p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deliverables, projects, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/40 border-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "revision", label: "Revisions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === tab.id
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Cards Stream */}
      <div className="space-y-4">
        {filteredApprovals.map((item) => (
          <Card
            key={item.id}
            className="border border-border bg-card hover:border-border/80 transition-all rounded-xl overflow-hidden shadow-2xs"
          >
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted border border-border text-foreground font-semibold">
                    {item.version}
                  </span>

                  {item.status === "pending" ? (
                    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending Client Approval
                    </Badge>
                  ) : item.status === "approved" ? (
                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Approved & Signed Off
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60 text-xs">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Revision Requested
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span>
                    Project: <strong className="text-foreground">{item.projectName || item.project}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Client: <strong className="text-foreground">{item.clientName || item.client}</strong>
                  </span>
                  <span>•</span>
                  <span className="text-muted-foreground/70">Submitted {item.submittedDate || item.submittedAt}</span>
                  {item.dueDate && (
                    <>
                      <span>•</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">Due for sign-off: {item.dueDate}</span>
                    </>
                  )}
                </div>

                {item.feedback && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-950 dark:text-amber-200">Client Feedback Note:</p>
                      <p className="mt-0.5">{item.feedback}</p>
                    </div>
                  </div>
                )}

                {activeFeedbackId === item.id && (
                  <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Specify requested design/scope adjustments..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="h-9 text-xs px-3 rounded-lg border border-input w-full max-w-md focus:outline-hidden focus:border-blue-500 bg-background text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequestRevision(item.id)}
                        className="h-9 px-3 text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-primary dark:hover:bg-primary/90"
                      >
                        Submit Request
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActiveFeedbackId(null)
                          setFeedbackText("")
                        }}
                        className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                {item.status === "pending" ? (
                  <>
                    <Button
                      onClick={() => handleApprove(item.id)}
                      className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs rounded-xl"
                    >
                      <Check className="h-4 w-4 mr-1.5" />
                      Approve Deliverable
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveFeedbackId(item.id)
                        setFeedbackText("")
                      }}
                      className="h-9 px-3 text-xs border-border hover:bg-muted text-foreground rounded-xl"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      Request Revision
                    </Button>
                  </>
                ) : item.status === "approved" ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60">
                    <FileCheck2 className="h-4 w-4" />
                    <span>Client Sign-off Recorded</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleApprove(item.id)}
                    variant="outline"
                    className="h-9 px-3 text-xs text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl"
                  >
                    Resubmit for Approval
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
