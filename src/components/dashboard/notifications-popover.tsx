"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Check, Clock, FileCheck, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: "approval" | "file" | "invoice" | "message"
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Deliverable Approved",
    description: "Sarah Connor approved Brand Identity Guidelines v2.4",
    time: "12m ago",
    type: "approval",
    read: false,
  },
  {
    id: "notif-2",
    title: "New Assets Uploaded",
    description: "Apex Labs uploaded 4 design assets for Mobile App UI",
    time: "45m ago",
    type: "file",
    read: false,
  },
  {
    id: "notif-3",
    title: "Invoice Overdue Alert",
    description: "Invoice #INV-2026-004 ($3,600) from Quantum AI is 3 days past due",
    time: "2h ago",
    type: "invoice",
    read: false,
  },
  {
    id: "notif-4",
    title: "Revision Requested",
    description: "Michael Chang requested revisions on checkout flow wireframes",
    time: "4h ago",
    type: "approval",
    read: true,
  },
  {
    id: "notif-5",
    title: "New Message",
    description: "David Kim: 'Shared the updated Figma link with the team'",
    time: "6h ago",
    type: "message",
    read: true,
  },
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [open, setOpen] = React.useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "approval":
        return <FileCheck className="h-4 w-4 text-emerald-600" />
      case "file":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "invoice":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-indigo-600" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 md:w-96 p-0 shadow-xl border-border bg-popover text-popover-foreground rounded-xl"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
            {unreadCount > 0 ? (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs px-2 py-0.5">
                {unreadCount} new
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-xs px-2 py-0.5">
                All read
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 transition-colors cursor-pointer hover:bg-accent/60 flex items-start gap-3 ${
                !item.read ? "bg-blue-50/40 dark:bg-blue-950/30" : ""
              }`}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-card border border-border shadow-2xs">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {item.title}
                  </p>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>
              {!item.read && (
                <span className="h-2 w-2 mt-1.5 rounded-full bg-blue-600 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-border bg-muted/30 rounded-b-xl text-center">
          <Link
            href="/activity"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary py-1"
          >
            <span>View workspace activity log</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}

