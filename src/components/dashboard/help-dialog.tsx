"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDashboard } from "@/context/dashboard-context"
import {
  FolderKanban,
  Users,
  CheckSquare,
  Receipt,
  Keyboard,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react"

export function HelpDialog() {
  const { isHelpOpen, setIsHelpOpen, setIsSearchOpen, setIsCreateProjectOpen } = useDashboard()

  return (
    <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-blue-600">
            <HelpCircle className="h-5 w-5" />
            <DialogTitle className="text-xl">ClientSpace Guide & Help</DialogTitle>
          </div>
          <DialogDescription>
            Learn shortcuts and understand how to manage your client deliverables and agency workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Quick Shortcuts */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
              <Keyboard className="h-3.5 w-3.5" />
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div
                onClick={() => {
                  setIsHelpOpen(false)
                  setIsSearchOpen(true)
                }}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 cursor-pointer transition-colors"
              >
                <span className="text-foreground font-medium">Global Search</span>
                <kbd className="px-2 py-0.5 text-[11px] font-semibold bg-card border border-border rounded shadow-xs text-foreground">
                  ⌘K / Ctrl+K
                </kbd>
              </div>
              <div
                onClick={() => {
                  setIsHelpOpen(false)
                  setIsCreateProjectOpen(true)
                }}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/40 hover:bg-muted/70 cursor-pointer transition-colors"
              >
                <span className="text-foreground font-medium">New Project</span>
                <kbd className="px-2 py-0.5 text-[11px] font-semibold bg-card border border-border rounded shadow-xs text-foreground">
                  ⌘P / Ctrl+P
                </kbd>
              </div>
            </div>
          </div>

          {/* Module Overview */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Platform Modules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-card shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                  <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Projects & Milestones
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Track project health, progress bars, deliverable counts, and deadlines with client transparency.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                  <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Client Workspaces
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Dedicated portals for every client with contact points, total spend, and ongoing project status.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                  <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Client Approvals
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Eliminate back-and-forth emails. Clients approve deliverables with single-click sign-offs or structured revisions.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                  <Receipt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  Invoicing & Billing
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Generate milestone and retainer invoices with automated tax calculation, payment tracking, and status alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Support */}
          <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-3.5 flex items-start gap-3 text-xs">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200">Need direct agency assistance?</p>
              <p className="text-blue-700 dark:text-blue-300 mt-0.5 text-[11px] leading-relaxed">
                ClientSpace Agency Pro includes dedicated priority support, custom domain portals, and white-label branding.
              </p>
              <a
                href="mailto:support@clientspace.design"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 dark:text-blue-400 hover:underline mt-2"
              >
                Contact Support <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
