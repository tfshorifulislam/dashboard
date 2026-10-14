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
import { UserPlus } from "lucide-react"

export function CreateClientDialog() {
  const { isCreateClientOpen, setIsCreateClientOpen, addClient } = useDashboard()

  const [name, setName] = React.useState("")
  const [company, setCompany] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) newErrors.name = "Contact name is required"
    if (!company.trim()) newErrors.company = "Company name is required"
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid work email is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    addClient({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim() || "+1 (555) 000-0000",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
      status: "Active",
      notes: notes.trim(),
    })

    // Reset and close
    setName("")
    setCompany("")
    setEmail("")
    setPhone("")
    setNotes("")
    setErrors({})
    setIsCreateClientOpen(false)
  }

  return (
    <Dialog open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-heading">Invite New Client</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Grant immediate access to shared deliverables and invoice tracking.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Contact Person *</label>
              <Input
                placeholder="e.g. Jessica Alba"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors({ ...errors, name: "" })
                }}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Company Name *</label>
              <Input
                placeholder="e.g. Acme Studio"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value)
                  if (errors.company) setErrors({ ...errors, company: "" })
                }}
                className={errors.company ? "border-destructive" : ""}
              />
              {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Work Email *</label>
            <Input
              type="email"
              placeholder="client@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Phone Number</label>
            <Input
              placeholder="+1 (555) 012-3456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Internal Notes</label>
            <Textarea
              placeholder="Billing preferences, meeting schedule, client context..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateClientOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-navy-btn text-white hover:opacity-95 shadow-sm"
            >
              Send Portal Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

