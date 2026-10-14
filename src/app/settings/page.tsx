"use client"

import * as React from "react"
import {
  Building2,
  Users,
  Bell,
  Palette,
  Save,
  Plus,
  Check,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboard } from "@/context/dashboard-context"

export default function SettingsPage() {
  const { team } = useDashboard()
  const [isSaved, setIsSaved] = React.useState(false)

  // Form states
  const [workspaceName, setWorkspaceName] = React.useState("Acme Creative Agency")
  const [agencyEmail, setAgencyEmail] = React.useState("contact@acmecreative.agency")
  const [customDomain, setCustomDomain] = React.useState("portal.acmecreative.agency")
  const [currency, setCurrency] = React.useState("USD ($)")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workspaceName,
          agencyEmail,
          customDomain,
          currency,
        }),
      })
    } catch (err) {
      console.warn("Failed to save settings to API:", err)
    }
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure agency profile, white-label client portal branding, team members, and notifications.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg text-xs font-semibold">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            General & Profile
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-lg text-xs font-semibold">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Team Members ({team.length})
          </TabsTrigger>
          <TabsTrigger value="branding" className="rounded-lg text-xs font-semibold">
            <Palette className="h-3.5 w-3.5 mr-1.5" />
            Branding & Portal
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-xs font-semibold">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* 1. General Profile Tab */}
        <TabsContent value="general">
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="border border-border bg-card rounded-xl shadow-2xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold text-foreground">
                  Agency Workspace Information
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Visible to clients inside their dedicated ClientSpace portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Workspace Name</label>
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Agency Contact Email</label>
                    <Input
                      value={agencyEmail}
                      onChange={(e) => setAgencyEmail(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Custom Portal Domain</label>
                    <Input
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Billing Currency</label>
                    <Input
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white text-xs h-9 px-4 rounded-xl shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* 2. Team Members Tab */}
        <TabsContent value="team">
          <Card className="border border-border bg-card rounded-xl shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Agency Team Members
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Manage member roles, permissions, and project assignees.
                </CardDescription>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded-lg">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Invite Member
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{member.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-muted text-foreground border-border text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Branding & Portal */}
        <TabsContent value="branding">
          <Card className="border border-border bg-card rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                White-Label Portal Branding
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Customize how your clients perceive your agency portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Signature Color Palette</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border-2 border-blue-600 bg-blue-50/30 dark:bg-blue-950/30 flex items-center gap-3 cursor-pointer">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-[#0B1537] via-[#14265C] to-[#2447A8] shadow-xs" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Navy & Royal Gradient</p>
                      <p className="text-[10px] text-muted-foreground">Default Brand Theme</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-border bg-card flex items-center gap-3 cursor-pointer hover:bg-muted/50">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-slate-900 to-indigo-900 shadow-xs" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Midnight Indigo</p>
                      <p className="text-[10px] text-muted-foreground">Deep Contrast</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-border bg-card flex items-center gap-3 cursor-pointer hover:bg-muted/50">
                    <div className="h-6 w-6 rounded-lg bg-gradient-to-r from-emerald-800 to-teal-700 shadow-xs" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Emerald Forest</p>
                      <p className="text-[10px] text-muted-foreground">Organic Modern</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-medium text-foreground">Client Portal Footer Disclaimer</label>
                <textarea
                  defaultValue="All deliverables, brand assets, and creative assets remain the property of Acme Creative Agency until invoice balance is settled in full."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => {
                    setIsSaved(true)
                    setTimeout(() => setIsSaved(false), 3000)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 rounded-xl"
                >
                  Save Branding Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border border-border bg-card rounded-xl shadow-2xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Email & In-App Alert Triggers
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Control notifications sent to your agency team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              {[
                { title: "Deliverable Sign-offs", desc: "Notify immediately when a client approves a milestone or requests a revision.", checked: true },
                { title: "Invoice Settlements", desc: "Send confirmation when a client completes payment on an outstanding invoice.", checked: true },
                { title: "Client Messages", desc: "Send immediate notification for unread client messages.", checked: true },
                { title: "Weekly Workspace Digest", desc: "Receive summary of open projects, billables, and deadlines every Monday.", checked: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-muted/30">
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={item.checked}
                    className="h-4 w-4 mt-1 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
