"use client"

import * as React from "react"
import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const UPCOMING_DEADLINES = [
  {
    id: "dl-1",
    title: "Design System Token Export",
    client: "Quantum AI",
    project: "Quantum Design System",
    dueDate: "Oct 16 (in 2 days)",
    priority: "urgent",
    status: "Awaiting Client Sign-off",
  },
  {
    id: "dl-2",
    title: "Mobile App Checkout Flow Prototype",
    client: "Horizon Health",
    project: "Patient Portal",
    dueDate: "Oct 18 (in 4 days)",
    priority: "normal",
    status: "In Development",
  },
  {
    id: "dl-3",
    title: "Final Brand Identity Asset Export",
    client: "Lumina Corp",
    project: "Brand Identity v2",
    dueDate: "Oct 20 (in 6 days)",
    priority: "normal",
    status: "Final Review",
  },
  {
    id: "dl-4",
    title: "E-Commerce Payment Gateway QA",
    client: "Stellar Media",
    project: "Storefront Revamp",
    dueDate: "Oct 24",
    priority: "low",
    status: "Testing",
  },
]

export function UpcomingDeadlines() {
  return (
    <Card className="border border-border bg-card text-card-foreground rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Calendar className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              Upcoming Milestones & Deadlines
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Deliverables due within the next 10 business days
          </CardDescription>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Schedule</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {UPCOMING_DEADLINES.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-border hover:border-primary/40 bg-muted/40 hover:bg-muted/80 transition-all flex items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {item.title}
                </p>
                {item.priority === "urgent" && (
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60 text-[10px] px-1.5 py-0">
                    Urgent
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {item.client} • <span className="text-foreground font-medium">{item.project}</span>
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="font-semibold text-foreground block flex items-center gap-1 justify-end">
                <Clock className="h-3 w-3 text-muted-foreground" />
                {item.dueDate}
              </span>
              <span className="text-[10px] text-muted-foreground">{item.status}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
