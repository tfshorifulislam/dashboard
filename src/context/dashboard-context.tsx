"use client"

import * as React from "react"
import {
  Project,
  Client,
  Conversation,
  FileItem,
  ApprovalItem,
  InvoiceItem,
  ActivityItem,
  TeamMember,
  INITIAL_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_FILES,
  INITIAL_APPROVALS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITIES,
  INITIAL_TEAM,
} from "@/lib/dashboard-data"

interface DashboardContextType {
  projects: Project[]
  clients: Client[]
  conversations: Conversation[]
  files: FileItem[]
  approvals: ApprovalItem[]
  invoices: InvoiceItem[]
  activities: ActivityItem[]
  team: TeamMember[]

  // Modals state
  isCreateProjectOpen: boolean
  setIsCreateProjectOpen: (open: boolean) => void
  isCreateClientOpen: boolean
  setIsCreateClientOpen: (open: boolean) => void
  isCreateInvoiceOpen: boolean
  setIsCreateInvoiceOpen: (open: boolean) => void
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  isHelpOpen: boolean
  setIsHelpOpen: (open: boolean) => void

  // Actions
  addProject: (project: Omit<Project, "id" | "progress" | "team" | "deliverablesCount">) => void
  addClient: (client: Omit<Client, "id" | "activeProjects" | "totalSpent" | "joinedDate">) => void
  addInvoice: (invoice: Omit<InvoiceItem, "id" | "status">) => void
  addFile: (file: Omit<FileItem, "id" | "uploadedAt">) => void
  approveDeliverable: (approvalId: string) => void
  requestRevision: (approvalId: string, feedback: string) => void
  sendMessage: (conversationId: string, text: string) => void
  markInvoicePaid: (invoiceId: string) => void
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(INITIAL_PROJECTS)
  const [clients, setClients] = React.useState<Client[]>(INITIAL_CLIENTS)
  const [conversations, setConversations] = React.useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [files, setFiles] = React.useState<FileItem[]>(INITIAL_FILES)
  const [approvals, setApprovals] = React.useState<ApprovalItem[]>(INITIAL_APPROVALS)
  const [invoices, setInvoices] = React.useState<InvoiceItem[]>(INITIAL_INVOICES)
  const [activities, setActivities] = React.useState<ActivityItem[]>(INITIAL_ACTIVITIES)
  const [team] = React.useState<TeamMember[]>(INITIAL_TEAM)

  const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false)
  const [isCreateClientOpen, setIsCreateClientOpen] = React.useState(false)
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isHelpOpen, setIsHelpOpen] = React.useState(false)

  // Listen for Cmd+K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const addProject = (newProj: Omit<Project, "id" | "progress" | "team" | "deliverablesCount">) => {
    const project: Project = {
      ...newProj,
      id: `proj-${Date.now()}`,
      progress: 0,
      team: [
        {
          name: "Alex Morgan",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
          role: "Lead Designer",
        },
      ],
      deliverablesCount: 1,
    }
    setProjects((prev) => [project, ...prev])

    // Record activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "created project",
        target: project.name,
        project: project.name,
        timestamp: "Just now",
        category: "project",
      },
      ...prev,
    ])
  }

  const addClient = (newCl: Omit<Client, "id" | "activeProjects" | "totalSpent" | "joinedDate">) => {
    const client: Client = {
      ...newCl,
      id: `client-${Date.now()}`,
      activeProjects: 0,
      totalSpent: "$0",
      joinedDate: "Today",
    }
    setClients((prev) => [client, ...prev])

    // Record activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "added client",
        target: `${client.name} (${client.company})`,
        timestamp: "Just now",
        category: "client",
      },
      ...prev,
    ])
  }

  const addInvoice = (newInv: Omit<InvoiceItem, "id" | "status">) => {
    const invoice: InvoiceItem = {
      ...newInv,
      id: `inv-${Date.now()}`,
      status: "pending",
    }
    setInvoices((prev) => [invoice, ...prev])

    // Record activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "issued invoice",
        target: `${invoice.invoiceNumber} ($${invoice.amount.toLocaleString()})`,
        timestamp: "Just now",
        category: "invoice",
      },
      ...prev,
    ])
  }

  const addFile = (newFile: Omit<FileItem, "id" | "uploadedAt">) => {
    const file: FileItem = {
      ...newFile,
      id: `file-${Date.now()}`,
      uploadedAt: "Just now",
    }
    setFiles((prev) => [file, ...prev])

    // Record activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "uploaded file",
        target: file.name,
        project: file.project,
        timestamp: "Just now",
        category: "file",
      },
      ...prev,
    ])
  }

  const approveDeliverable = (approvalId: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? { ...item, status: "approved" as const, feedback: "Approved by client" }
          : item
      )
    )

    const item = approvals.find((a) => a.id === approvalId)
    if (item) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: item.client,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
          action: "approved deliverable",
          target: item.title,
          project: item.project,
          timestamp: "Just now",
          category: "approval",
        },
        ...prev,
      ])
    }
  }

  const requestRevision = (approvalId: string, feedback: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === approvalId
          ? { ...item, status: "revision_requested" as const, feedback }
          : item
      )
    )

    const item = approvals.find((a) => a.id === approvalId)
    if (item) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: item.client,
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
          action: "requested revisions on",
          target: item.title,
          project: item.project,
          timestamp: "Just now",
          category: "approval",
        },
        ...prev,
      ])
    }
  }

  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      text: text.trim(),
      timestamp: "Just now",
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastTimestamp: "Just now",
              messages: [...c.messages, newMessage],
            }
          : c
      )
    )
  }

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "paid" as const } : inv))
    )

    const inv = invoices.find((i) => i.id === invoiceId)
    if (inv) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: "System",
          avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
          action: "marked paid",
          target: `${inv.invoiceNumber} ($${inv.amount.toLocaleString()})`,
          timestamp: "Just now",
          category: "invoice",
        },
        ...prev,
      ])
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        clients,
        conversations,
        files,
        approvals,
        invoices,
        activities,
        team,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isCreateClientOpen,
        setIsCreateClientOpen,
        isCreateInvoiceOpen,
        setIsCreateInvoiceOpen,
        isSearchOpen,
        setIsSearchOpen,
        isHelpOpen,
        setIsHelpOpen,
        addProject,
        addClient,
        addInvoice,
        addFile,
        approveDeliverable,
        requestRevision,
        sendMessage,
        markInvoicePaid,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

