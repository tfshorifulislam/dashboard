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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Receipt, Plus, Trash2 } from "lucide-react"

export function CreateInvoiceDialog() {
  const { isCreateInvoiceOpen, setIsCreateInvoiceOpen, addInvoice, clients } = useDashboard()

  const [client, setClient] = React.useState("")
  const [dueDate, setDueDate] = React.useState("Oct 30, 2026")
  const [items, setItems] = React.useState([
    { description: "Sprint Deliverables & Handoff", hours: 20, rate: 125, total: 2500 },
  ])
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({})

  const totalAmount = items.reduce((acc, curr) => acc + curr.total, 0)
  const invoiceNumber = "INV-2026-088"

  const handleAddItem = () => {
    setItems([...items, { description: "Additional Scope / Consulting", hours: 10, rate: 125, total: 1250 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleUpdateItem = (index: number, field: "description" | "hours" | "rate", value: string | number) => {
    const updated = [...items]
    const current = updated[index]

    if (field === "description") {
      current.description = String(value)
    } else if (field === "hours") {
      current.hours = Number(value) || 0
      current.total = current.hours * current.rate
    } else if (field === "rate") {
      current.rate = Number(value) || 0
      current.total = current.hours * current.rate
    }
    setItems(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!client) {
      setErrors({ client: "Please select a recipient client" })
      return
    }

    const selectedClient = clients.find((c) => c.company === client)
    const clientEmail = selectedClient ? selectedClient.email : "billing@client.com"

    addInvoice({
      invoiceNumber,
      client,
      clientEmail,
      amount: totalAmount,
      issueDate: "Today",
      dueDate,
      items,
    })

    setClient("")
    setIsCreateInvoiceOpen(false)
  }

  return (
    <Dialog open={isCreateInvoiceOpen} onOpenChange={setIsCreateInvoiceOpen}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-heading">Generate Client Invoice</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Issue a branded invoice payable online via ClientSpace payments.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Client *</label>
              <Select value={client} onValueChange={(val) => { setClient(val); setErrors({}) }}>
                <SelectTrigger className={errors.client ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select client" />
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
              <label className="text-xs font-medium text-foreground">Due Date</label>
              <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-heading uppercase tracking-wider">Line Items</label>
              <Button type="button" variant="ghost" size="xs" onClick={handleAddItem} className="text-primary hover:text-primary">
                <Plus className="mr-1 size-3" /> Add item
              </Button>
            </div>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border">
                  <Input
                    className="flex-1 h-8 text-xs bg-background"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                    placeholder="Description"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      className="h-8 text-xs bg-background"
                      value={item.hours}
                      onChange={(e) => handleUpdateItem(idx, "hours", e.target.value)}
                      placeholder="Hrs"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      className="h-8 text-xs bg-background"
                      value={item.rate}
                      onChange={(e) => handleUpdateItem(idx, "rate", e.target.value)}
                      placeholder="$/hr"
                    />
                  </div>
                  <div className="w-20 text-right text-xs font-semibold text-heading">
                    ${item.total.toLocaleString()}
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs font-medium text-muted-foreground">Total Invoiced Amount</span>
            <span className="text-lg font-bold text-heading text-primary">${totalAmount.toLocaleString()}</span>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateInvoiceOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-navy-btn text-white hover:opacity-95 shadow-sm">
              Create & Send Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
