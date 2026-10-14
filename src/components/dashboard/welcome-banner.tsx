"use client"

import * as React from "react"
import { Sparkles, Plus, UserPlus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/dashboard-context"

export function WelcomeBanner() {
  const {
    projects,
    approvals,
    setIsCreateProjectOpen,
    setIsCreateClientOpen,
  } = useDashboard()

  const pendingApprovalsCount = approvals.filter((a) => a.status === "pending").length

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1537] via-[#14265C] to-[#2447A8] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 border border-blue-900/40">
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-blue-200 border border-white/15 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Agency Pro Workspace • All systems operational</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, Alex 👋
          </h1>

          <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed">
            You have <span className="font-semibold text-white">{projects.length} active projects</span> and{" "}
            <span className="font-semibold text-amber-300">{pendingApprovalsCount} deliverables pending client sign-off</span> today.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-blue-200/70">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <strong className="text-white font-medium">$48.5k</strong> invoiced this month
            </span>
            <span className="hidden sm:inline">•</span>
            <span>98.4% on-time milestone delivery</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setIsCreateProjectOpen(true)}
            className="bg-white hover:bg-slate-100 text-[#0B1537] font-semibold text-xs sm:text-sm h-10 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 mr-1.5 text-blue-700" />
            <span>New Project</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsCreateClientOpen(true)}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm h-10 px-4 rounded-xl backdrop-blur-sm transition-all"
          >
            <UserPlus className="h-4 w-4 mr-1.5 text-blue-200" />
            <span>Invite Client</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
