"use client"

import * as React from "react"
import { useDashboard } from "@/context/dashboard-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FolderKanban, Sparkles } from "lucide-react"

export function CreateProjectDialog() {
  const { isCreateProjectOpen, setIsCreateProjectOpen, addProject, clients } = useDashboard()

  const [name, setName] = React.useState("")
  const [client, setClient] = React.useState("")
  const [category, setCategory] = React.useState("Web Design")
  const [budget, setBudget] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) newErrors.name = "Project name is required"
    if (!client) newErrors.client = "Please select a client"
    if (!budget.trim()) newErrors.budget = "Budget amount is required"
    if (!dueDate.trim()) newErrors.dueDate = "Due date is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const selectedClient = clients.find((c) => c.company === client)
    const clientEmail = selectedClient ? selectedClient.email : "contact@client.com"

    addProject({
      name: name.trim(),
      client,
      clientEmail,
      status: "In progress",
      dueDate: dueDate.trim(),
      budget: budget.startsWith("$") ? budget.trim() : `$${budget.trim()}`,
      category,
      description: description.trim() || "New workspace project",
    })

    // Reset and close
    setName("")
    setClient("")
    setBudget("")
    setDueDate("")
    setDescription("")
    setErrors({})
    setIsCreateProjectOpen(false)
  }

  return (
    <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-heading">Create New Project</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up a new client deliverable workspace with automatic portal access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Project Name *</label>
            <Input
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Client *</label>
              <Select
                value={client}
                onValueChange={(val) => {
                  setClient(val)
                  if (errors.client) setErrors({ ...errors, client: "" })
                }}
              >
                <SelectTrigger className={errors.client ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.company}>
                      {c.company} ({c.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client && <p className="text-xs text-destructive">{errors.client}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Design">Web Design</SelectItem>
                  <SelectItem value="Product Design">Product Design</SelectItem>
                  <SelectItem value="Branding">Branding</SelectItem>
                  <SelectItem value="Full Stack">Full Stack</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Total Budget *</label>
              <Input
                placeholder="e.g. 15,000"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value)
                  if (errors.budget) setErrors({ ...errors, budget: "" })
                }}
                className={errors.budget ? "border-destructive" : ""}
              />
              {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Due Date *</label>
              <Input
                placeholder="e.g. Nov 15, 2026"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (errors.dueDate) setErrors({ ...errors, dueDate: "" })
                }}
                className={errors.dueDate ? "border-destructive" : ""}
              />
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Scope Summary</label>
            <Textarea
              placeholder="Brief description of the deliverables and client goals..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateProjectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-navy-btn text-white hover:opacity-95 shadow-sm"
            >
              <Sparkles className="mr-1.5 size-4" />
              Launch Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

