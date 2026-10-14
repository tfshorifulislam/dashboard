"use client"

import * as React from "react"
import { useDashboard } from "@/context/dashboard-context"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Search,
  FolderKanban,
  Users,
  FileText,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export function SearchDialog() {
  const { isSearchOpen, setIsSearchOpen, projects, clients, files, invoices } = useDashboard()
  const [query, setQuery] = React.useState("")
  const router = useRouter()

  const q = query.toLowerCase().trim()

  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
  )

  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
  )

  const filteredFiles = files.filter(
    (f) => f.name.toLowerCase().includes(q) || (f.project || f.projectName || "").toLowerCase().includes(q)
  )

  const filteredInvoices = invoices.filter(
    (i) => (i.invoiceNumber || i.id).toLowerCase().includes(q) || (i.client || i.clientName || "").toLowerCase().includes(q)
  )

  const handleSelect = (url: string) => {
    setIsSearchOpen(false)
    setQuery("")
    router.push(url)
  }

  return (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-[580px] border-border shadow-2xl">
        <div className="flex items-center border-b border-border px-4 py-3 bg-card">
          <Search className="size-4 text-muted-foreground mr-2.5 shrink-0" />
          <Input
            autoFocus
            placeholder="Search projects, clients, files, invoices..."
            className="border-0 shadow-none focus-visible:ring-0 px-0 text-sm bg-transparent h-9 placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline-flex select-none items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-border/40">
          {/* Quick Nav if no query */}
          {!q && (
            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Quick Navigation
              </div>
              <button
                onClick={() => handleSelect("/")}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="size-3.5 text-primary" />
                  Overview Dashboard
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleSelect("/projects")}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FolderKanban className="size-3.5 text-primary" />
                  Projects Management
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleSelect("/clients")}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="size-3.5 text-primary" />
                  Client Directory
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleSelect("/invoices")}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="size-3.5 text-primary" />
                  Billing & Invoices
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Projects ({filteredProjects.length})
              </div>
              {filteredProjects.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect("/projects")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-accent text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <FolderKanban className="size-3" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.client} • {p.status}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-primary">{p.progress}%</span>
                </button>
              ))}
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Clients ({filteredClients.length})
              </div>
              {filteredClients.slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect("/clients")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-accent text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-6 rounded bg-accent flex items-center justify-center text-foreground font-semibold text-[10px]">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.company} • {c.email}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{c.activeProjects} active</span>
                </button>
              ))}
            </div>
          )}

          {/* Files */}
          {filteredFiles.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Files ({filteredFiles.length})
              </div>
              {filteredFiles.slice(0, 3).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelect("/files")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-accent text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{f.name}</div>
                      <div className="text-[10px] text-muted-foreground">{f.project || f.projectName || "General"} • {f.size}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div className="p-2 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                Invoices ({filteredInvoices.length})
              </div>
              {filteredInvoices.slice(0, 2).map((i) => (
                <button
                  key={i.id}
                  onClick={() => handleSelect("/invoices")}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs hover:bg-accent text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Receipt className="size-4 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{i.invoiceNumber || i.id} — {i.client || i.clientName}</div>
                      <div className="text-[10px] text-muted-foreground">Due: {i.dueDate}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-heading">${i.amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {q &&
            filteredProjects.length === 0 &&
            filteredClients.length === 0 &&
            filteredFiles.length === 0 &&
            filteredInvoices.length === 0 && (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No results found for &ldquo;<span className="text-foreground font-medium">{query}</span>&rdquo;
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
