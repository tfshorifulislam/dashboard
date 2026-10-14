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
    <Card className="border border-slate-200/90 bg-white rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CheckSquare className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Pending Deliverable Sign-offs
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Review client milestones awaiting client approval or revision requests
          </CardDescription>
        </div>

        <Link
          href="/approvals"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>All Sign-offs</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-slate-900">
                  {item.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                  {item.version}
                </span>
                {item.status === "pending" ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Approval
                  </Badge>
                ) : item.status === "approved" ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <Check className="h-3 w-3 mr-1" />
                    Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Revision Requested
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Project: <strong className="text-slate-700">{item.projectName || item.project}</strong> • Client:{" "}
                <span className="text-slate-700 font-medium">{item.clientName || item.client}</span>
              </p>
              <p className="text-[11px] text-slate-400">
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
                    className="h-8 text-xs px-2.5 rounded border border-slate-300 w-full max-w-sm focus:outline-hidden focus:border-blue-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSendRevision(item.id)}
                    className="h-8 px-3 text-xs bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    Submit Note
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setActiveFeedbackId(null)}
                    className="h-8 px-2 text-xs text-slate-500"
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
                    className="h-8 px-3 text-xs border-slate-300 hover:bg-slate-100 text-slate-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    Request Change
                  </Button>
                </>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
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
