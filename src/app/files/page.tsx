"use client"

import * as React from "react"
import {
  FolderArchive,
  Upload,
  Search,
  FileText,
  FileCode,
  Image as ImageIcon,
  FileArchive,
  Download,
  Share2,
  MoreVertical,
  FolderKanban,
  HardDrive,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDashboard } from "@/context/dashboard-context"

export default function FilesPage() {
  const { files, addFile } = useDashboard()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [isUploading, setIsUploading] = React.useState(false)

  const filteredFiles = files.filter((f) => {
    const proj = f.projectName || f.project || ""
    const cli = f.clientName || f.uploader || ""
    const cat = f.category || f.type || "document"
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cli.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" ||
      cat.toLowerCase().includes(categoryFilter.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (category?: string) => {
    const cat = category || ""
    if (cat.includes("design") || cat.includes("figma") || cat.includes("image")) {
      return <ImageIcon className="h-6 w-6 text-purple-600" />
    }
    if (cat.includes("code")) {
      return <FileCode className="h-6 w-6 text-emerald-600" />
    }
    if (cat.includes("zip") || cat.includes("archive")) {
      return <FileArchive className="h-6 w-6 text-amber-600" />
    }
    return <FileText className="h-6 w-6 text-blue-600" />
  }

  const handleSimulateUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      addFile({
        name: "Client_Sprint_Brief_v3.pdf",
        size: "3.4 MB",
        category: "document",
        projectName: "Website Redesign",
        clientName: "Acme Corp",
      })
      setIsUploading(false)
    }, 600)
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Files & Assets</h1>
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60 font-semibold">
              {files.length} Assets
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Secure client file repository, deliverables library, contracts, and export bundles.
          </p>
        </div>

        <Button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white shadow-md shadow-blue-950/20 text-xs sm:text-sm h-10 px-4 rounded-xl"
        >
          <Upload className="h-4 w-4 mr-1.5" />
          <span>{isUploading ? "Uploading..." : "Upload Asset"}</span>
        </Button>
      </div>

      {/* Storage and Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Storage Used</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">4.2 GB / 50 GB</p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">8.4% capacity</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Deliverable Files</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">{files.length}</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">All synced with clients</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <FolderArchive className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Shared Links</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground mt-1">100% Secure</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">Encrypted at rest & in transit</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Share2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name, project, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/40 border-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center rounded-lg bg-muted p-1 text-xs">
          {["all", "design", "document", "code", "archive"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                categoryFilter === cat
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card
            key={file.id}
            className="border border-border bg-card hover:border-border/80 hover:shadow-md transition-all rounded-xl overflow-hidden group"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-muted/50 border border-border group-hover:bg-primary/10 transition-colors shrink-0">
                    {getFileIcon(file.category || file.type)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {file.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{file.size}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="h-3.5 w-3.5 mr-2" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Share2 className="h-3.5 w-3.5 mr-2" /> Copy Client Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="pt-2 border-t border-border space-y-1 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <FolderKanban className="h-3 w-3 text-muted-foreground" />
                    Project:
                  </span>
                  <span className="font-medium text-foreground text-[11px] truncate max-w-[140px]">
                    {file.projectName || file.project}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>Client:</span>
                  <span className="font-semibold text-foreground">{file.clientName || file.uploader}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground/80 text-[10px] pt-1">
                  <span>Uploaded {file.uploadedAt}</span>
                  <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border">
                    {file.category || file.type || "file"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
