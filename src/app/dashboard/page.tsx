"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { WelcomeBanner } from "@/components/dashboard/welcome-banner"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ProjectsOverview } from "@/components/dashboard/projects-overview"
import { PendingApprovalsCard } from "@/components/dashboard/pending-approvals-card"
import { InvoiceSummaryCard } from "@/components/dashboard/invoice-summary-card"
import { ActivityPanel } from "@/components/dashboard/activity-panel"
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines"

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* 1. Welcome Section with Navy-Blue Gradient */}
      <WelcomeBanner />

      {/* 2. Key Performance Metric Cards */}
      <KpiCards />

      {/* 3. Primary Projects Tracking Table */}
      <ProjectsOverview />

      {/* 4. Action-Oriented Operations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovalsCard />
        <InvoiceSummaryCard />
      </div>

      {/* 5. Schedule & Audit Stream Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingDeadlines />
        <ActivityPanel />
      </div>
    </DashboardShell>
  )
}
