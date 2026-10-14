"use client"

import * as React from "react"
import Link from "next/link"
import {
  FolderKanban,
  ArrowRight,
  MoreVertical,
  Calendar,
  Layers,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/dashboard-context"

export function ProjectsOverview() {
  const { projects } = useDashboard()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
            In Progress
          </Badge>
        )
      case "review":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
            In Review
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
            Completed
          </Badge>
        )
      case "planning":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-medium">
            Planning
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Display top 4 projects
  const recentProjects = projects.slice(0, 4)

  return (
    <Card className="border border-slate-200/90 bg-white rounded-xl shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <FolderKanban className="h-4 w-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              Active Client Projects
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 mt-1">
            Tracking milestones, deliverables, and progress across client workspaces
          </CardDescription>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span>View All ({projects.length})</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4 sm:px-6">Project Name</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Budget</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {project.name}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Layers className="h-3 w-3 text-slate-400" />
                        {project.category} • {project.deliverablesCount} deliverables
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-semibold">
                          {(project.clientName || project.client).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-slate-700 font-medium">{project.clientName || project.client}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">
                    <div className="flex items-center gap-2.5">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-[11px] font-semibold text-slate-700 min-w-[28px]">
                        {project.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{project.dueDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-semibold text-slate-900">
                    {project.budget}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-800">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem asChild>
                          <Link href="/projects" className="flex items-center gap-2 cursor-pointer">
                            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                            <span>View Details</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/approvals" className="flex items-center gap-2 cursor-pointer">
                            <span>Check Deliverables</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
