"use client"

import * as React from "react"
import {
  FolderKanban,
  Plus,
  Search,
  Calendar,
  Layers,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboard } from "@/context/dashboard-context"

export default function ProjectsPage() {
  const { projects, setIsCreateProjectOpen } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  const filteredProjects = projects.filter((p) => {
    const clientStr = p.clientName || p.client || ""
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      p.status.toLowerCase().replace(/[\s-_]+/g, "") ===
        statusFilter.toLowerCase().replace(/[\s-_]+/g, "")
    return matchesSearch && matchesStatus
  })

  const inProgressCount = projects.filter((p) =>
    p.status.toLowerCase().includes("progress")
  ).length
  const reviewCount = projects.filter((p) =>
    p.status.toLowerCase().includes("review")
  ).length
  const completedCount = projects.filter((p) =>
    p.status.toLowerCase().includes("completed")
  ).length

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("progress")) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60 text-xs">
          In Progress
        </Badge>
      )
    }
    if (s.includes("review")) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60 text-xs">
          In Review
        </Badge>
      )
    }
    if (s.includes("completed")) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60 text-xs">
          Completed
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs">
        Planning
      </Badge>
    )
  }

  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Projects</h1>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold">
              {projects.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage timelines, client deliverables, budgets, and milestones.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateProjectOpen(true)}
          className="bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white shadow-md shadow-blue-950/20 text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Active Workstreams</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{inProgressCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Awaiting Client Review</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{reviewCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Completed Projects</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs">
          <p className="text-xs font-medium text-muted-foreground">Total Contract Value</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">$142,500</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, clients, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-muted/40 border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between">
          {/* Status Tabs */}
          <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
            {["all", "in-progress", "review", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                  statusFilter === status
                    ? "bg-card text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status === "all" ? "All" : status.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${
                viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${
                viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid or List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-xl border border-border">
          <FolderKanban className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">No projects found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new client project.
          </p>
          <Button
            onClick={() => setIsCreateProjectOpen(true)}
            size="sm"
            className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Create Project
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="border border-border bg-card text-card-foreground hover:border-primary/40 hover:shadow-md transition-all rounded-xl overflow-hidden group flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  {getStatusBadge(project.status)}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] bg-muted text-muted-foreground font-bold">
                      {(project.clientName || project.client).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{project.clientName || project.client}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Milestone Completion</span>
                    <span className="font-bold text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Meta details */}
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Due {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{project.deliverablesCount} items</span>
                  </div>
                </div>

                {/* Footer budget & actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Budget</span>
                    <span className="text-sm font-bold text-foreground">{project.budget}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuItem className="cursor-pointer">View Deliverables</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Edit Project Details</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Share Client Link</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-border bg-card text-card-foreground rounded-xl shadow-2xs overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4 sm:px-6">Project</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Progress</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Budget</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground">
                        {p.name}
                        <span className="block text-[11px] font-normal text-muted-foreground">{p.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground">{p.clientName || p.client}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>
                      <td className="py-3.5 px-4 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          <Progress value={p.progress} className="h-2 flex-1" />
                          <span className="font-semibold text-foreground">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{p.dueDate}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">{p.budget}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}
