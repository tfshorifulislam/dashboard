"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity,
  ArrowRight,
  FileCheck,
  CreditCard,
  Upload,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboard } from "@/context/dashboard-context"

export function ActivityPanel() {
  const { activities } = useDashboard()

  const getIcon = (type?: string) => {
    const t = type || ""
    if (t.includes("approval")) {
      return <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
    }
    if (t.includes("invoice")) {
      return <CreditCard className="h-3.5 w-3.5 text-blue-600" />
    }
    if (t.includes("file")) {
      return <Upload className="h-3.5 w-3.5 text-indigo-600" />
    }
    if (t.includes("message")) {
      return <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
    }
    return <Activity className="h-3.5 w-3.5 text-slate-600" />
  }

  // Display top 5 activities
  const recentActivities = activities.slice(0, 5)

  return (
    <Card className="border border-slate-200/90 bg-white rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-900">
              Workspace Activity
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Real-time feed of client interactions and project updates
          </CardDescription>
        </div>

        <Link
          href="/activity"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>Full Log</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {recentActivities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 text-xs hover:bg-slate-50 p-2 rounded-lg transition-colors"
          >
            <Avatar className="h-7 w-7 mt-0.5">
              <AvatarFallback className="text-[10px] bg-slate-100 text-slate-700 font-semibold">
                {(item.userName || item.user || "TM").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-slate-800">
                <span className="font-semibold text-slate-900">{item.userName || item.user}</span>{" "}
                <span className="text-slate-600">{item.action}</span>{" "}
                <strong className="text-slate-800 font-medium">{item.target}</strong>
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  {getIcon(item.type || item.category)}
                  <span>{item.time || item.timestamp}</span>
                </span>
                <span>•</span>
                <span className="truncate">{item.projectName || item.project || "Client Project"}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
