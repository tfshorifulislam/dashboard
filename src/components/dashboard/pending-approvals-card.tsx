"use client"

import * as React from "react"
import Link from "next/link"
import {
  CheckSquare,
  ArrowRight,
  Check,
  RotateCcw,
  Clock,
  FileCheck2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/dashboard-context"

export function PendingApprovalsCard() {
  const { approvals, approveDeliverable, requestRevision } = useDashboard()
  const [feedbackState, setFeedbackState] = React.useState<Record<string, string>>({})
  const [activeFeedbackId, setActiveFeedbackId] = React.useState<string | null>(null)

  // Show pending first, then others, max 3
  const pendingApprovals = approvals.slice(0, 3)

  const handleApprove = (id: string) => {
    approveDeliverable(id)
  }

  const handleSendRevision = (id: string) => {
    const note = feedbackState[id] || "Please adjust visual hierarchy and colors."
    requestRevision(id, note)
    setActiveFeedbackId(null)
  }

  return (
    <Card className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <CheckSquare className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Pending Deliverable Sign-offs
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Review client milestones awaiting client approval or revision requests
          </CardDescription>
        </div>

        <Link
          href="/approvals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>All Sign-offs</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-border bg-muted/40 hover:bg-muted/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-foreground">
                  {item.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  {item.version}
                </span>
                {item.status === "pending" ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Approval
                  </Badge>
                ) : item.status === "approved" ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60 text-[10px]">
                    <Check className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 text-[10px]">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Revision Requested
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Project: <strong className="text-foreground">{item.projectName || item.project}</strong> • Client:{" "}
                <span className="text-foreground font-medium">{item.clientName || item.client}</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Submitted on {item.submittedDate || item.submittedAt}
              </p>

              {activeFeedbackId === item.id && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter change request feedback..."
                    value={feedbackState[item.id] || ""}
                    onChange={(e) =>
                      setFeedbackState({ ...feedbackState, [item.id]: e.target.value })
                    }
                    className="h-8 text-xs px-2.5 rounded border border-input bg-background text-foreground w-full max-w-sm focus:outline-hidden focus:border-primary"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSendRevision(item.id)}
                    className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Submit Note
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveFeedbackId(null)}
                    className="h-8 px-2 text-xs text-muted-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              {item.status === "pending" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(item.id)}
                    className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveFeedbackId(item.id)}
                    className="h-8 px-3 text-xs border-border hover:bg-muted text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    Request Change
                  </Button>
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                  <FileCheck2 className="h-4 w-4" />
                  <span>Sign-off Complete</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
