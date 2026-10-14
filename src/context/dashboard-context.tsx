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

export interface WorkspaceItem {
  id: string
  name: string
  slug?: string
  plan: string
  role?: string
}

const DEFAULT_WORKSPACES: WorkspaceItem[] = [
  { id: "ws-1", name: "Acme Creative Agency", plan: "Agency Pro Tier" },
  { id: "ws-2", name: "Freelance Design Lab", plan: "Solo Creator Tier" },
  { id: "ws-3", name: "Starlight Digital", plan: "Agency Pro Tier" },
]

interface DashboardContextType {
  projects: Project[]
  clients: Client[]
  conversations: Conversation[]
  files: FileItem[]
  approvals: ApprovalItem[]
  invoices: InvoiceItem[]
  activities: ActivityItem[]
  team: TeamMember[]
  workspaces: WorkspaceItem[]
  activeWorkspace: WorkspaceItem
  setActiveWorkspace: (ws: WorkspaceItem) => void
  isLoading: boolean

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
  addProject: (project: Omit<Project, "id" | "progress" | "team" | "deliverablesCount">) => Promise<void>
  addClient: (client: Omit<Client, "id" | "activeProjects" | "totalSpent" | "joinedDate">) => Promise<void>
  addInvoice: (invoice: Omit<InvoiceItem, "id" | "status">) => Promise<void>
  addFile: (file: Omit<FileItem, "id" | "uploadedAt">) => Promise<void>
  approveDeliverable: (approvalId: string) => Promise<void>
  requestRevision: (approvalId: string, feedback: string) => Promise<void>
  sendMessage: (conversationId: string, text: string) => Promise<void>
  markInvoicePaid: (invoiceId: string) => Promise<void>
  refreshData: () => Promise<void>
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
  const [workspaces, setWorkspaces] = React.useState<WorkspaceItem[]>(DEFAULT_WORKSPACES)
  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspaceItem>(DEFAULT_WORKSPACES[0])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false)
  const [isCreateClientOpen, setIsCreateClientOpen] = React.useState(false)
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isHelpOpen, setIsHelpOpen] = React.useState(false)

  // Header helper for active workspace scoping
  const getAuthHeaders = React.useCallback(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" }
    if (activeWorkspace?.id && !activeWorkspace.id.startsWith("ws-")) {
      h["x-workspace-id"] = activeWorkspace.id
    }
    return h
  }, [activeWorkspace])

  // Fetch real data from backend
  const refreshData = React.useCallback(async () => {
    try {
      const headers = getAuthHeaders()
      await Promise.resolve()
      setIsLoading(true)

      // Fetch in parallel
      const [
        projectsRes,
        clientsRes,
        invoicesRes,
        approvalsRes,
        filesRes,
        conversationsRes,
        activityRes,
        workspacesRes,
      ] = await Promise.allSettled([
        fetch("/api/projects", { headers }),
        fetch("/api/clients", { headers }),
        fetch("/api/invoices", { headers }),
        fetch("/api/approvals", { headers }),
        fetch("/api/files", { headers }),
        fetch("/api/conversations", { headers }),
        fetch("/api/activity", { headers }),
        fetch("/api/workspaces", { headers }),
      ])

      if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
        const data = await projectsRes.value.json()
        if (data.projects && data.projects.length > 0) {
          setProjects(data.projects)
        }
      }

      if (clientsRes.status === "fulfilled" && clientsRes.value.ok) {
        const data = await clientsRes.value.json()
        if (data.clients && data.clients.length > 0) {
          setClients(data.clients)
        }
      }

      if (invoicesRes.status === "fulfilled" && invoicesRes.value.ok) {
        const data = await invoicesRes.value.json()
        if (data.invoices && data.invoices.length > 0) {
          setInvoices(data.invoices)
        }
      }

      if (approvalsRes.status === "fulfilled" && approvalsRes.value.ok) {
        const data = await approvalsRes.value.json()
        if (data.approvals && data.approvals.length > 0) {
          setApprovals(data.approvals)
        }
      }

      if (filesRes.status === "fulfilled" && filesRes.value.ok) {
        const data = await filesRes.value.json()
        if (data.files && data.files.length > 0) {
          setFiles(data.files)
        }
      }

      if (conversationsRes.status === "fulfilled" && conversationsRes.value.ok) {
        const data = await conversationsRes.value.json()
        if (data.conversations && data.conversations.length > 0) {
          setConversations(data.conversations)
        }
      }

      if (activityRes.status === "fulfilled" && activityRes.value.ok) {
        const data = await activityRes.value.json()
        if (data.activities && data.activities.length > 0) {
          setActivities(data.activities)
        }
      }

      if (workspacesRes.status === "fulfilled" && workspacesRes.value.ok) {
        const data = await workspacesRes.value.json()
        if (data.workspaces && data.workspaces.length > 0) {
          setWorkspaces(data.workspaces)
          if (!activeWorkspace || activeWorkspace.id.startsWith("ws-")) {
            setActiveWorkspace(data.workspaces[0])
          }
        }
      }
    } catch (err) {
      console.warn("Backend data sync failed, using local store:", err)
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders, activeWorkspace])

  React.useEffect(() => {
    let isMounted = true
    const timer = setTimeout(() => {
      if (isMounted) {
        void refreshData()
      }
    }, 0)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [refreshData])

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

  const addProject = async (newProj: Omit<Project, "id" | "progress" | "team" | "deliverablesCount">) => {
    const tempId = `proj-${Date.now()}`
    const optimisticProject: Project = {
      ...newProj,
      id: tempId,
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
    setProjects((prev) => [optimisticProject, ...prev])

    // Optimistic activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        userName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "created project",
        target: optimisticProject.name,
        project: optimisticProject.name,
        timestamp: "Just now",
        time: "Just now",
        category: "project",
      },
      ...prev,
    ])

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newProj.name,
          clientId: newProj.client,
          category: newProj.category,
          description: newProj.description,
          budget: newProj.budget,
          dueDate: newProj.dueDate,
          status: newProj.status,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.project) {
          setProjects((prev) =>
            prev.map((p) => (p.id === tempId ? { ...data.project } : p))
          )
        }
      }
    } catch (err) {
      console.warn("Project sync to backend failed:", err)
    }
  }

  const addClient = async (newCl: Omit<Client, "id" | "activeProjects" | "totalSpent" | "joinedDate">) => {
    const tempId = `client-${Date.now()}`
    const optimisticClient: Client = {
      ...newCl,
      id: tempId,
      activeProjects: 0,
      totalSpent: "$0",
      joinedDate: "Today",
    }
    setClients((prev) => [optimisticClient, ...prev])

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        userName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "added client",
        target: `${optimisticClient.name} (${optimisticClient.company})`,
        timestamp: "Just now",
        time: "Just now",
        category: "client",
      },
      ...prev,
    ])

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newCl),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.client) {
          setClients((prev) =>
            prev.map((c) => (c.id === tempId ? { ...data.client } : c))
          )
        }
      }
    } catch (err) {
      console.warn("Client sync to backend failed:", err)
    }
  }

  const addInvoice = async (newInv: Omit<InvoiceItem, "id" | "status">) => {
    const tempId = `inv-${Date.now()}`
    const optimisticInvoice: InvoiceItem = {
      ...newInv,
      id: tempId,
      status: "pending",
    }
    setInvoices((prev) => [optimisticInvoice, ...prev])

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        userName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "issued invoice",
        target: `${optimisticInvoice.invoiceNumber || "New Invoice"} ($${optimisticInvoice.amount.toLocaleString()})`,
        timestamp: "Just now",
        time: "Just now",
        category: "invoice",
      },
      ...prev,
    ])

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          clientId: newInv.client,
          projectName: newInv.projectName,
          dueDate: newInv.dueDate,
          items: newInv.items || [
            { description: "Agency Milestone", quantity: 1, rate: newInv.amount },
          ],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.invoice) {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === tempId ? { ...data.invoice } : inv))
          )
        }
      }
    } catch (err) {
      console.warn("Invoice sync to backend failed:", err)
    }
  }

  const addFile = async (newFile: Omit<FileItem, "id" | "uploadedAt">) => {
    const tempId = `file-${Date.now()}`
    const optimisticFile: FileItem = {
      ...newFile,
      id: tempId,
      uploadedAt: "Just now",
    }
    setFiles((prev) => [optimisticFile, ...prev])

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Alex Morgan",
        userName: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
        action: "uploaded file",
        target: optimisticFile.name,
        project: optimisticFile.project,
        timestamp: "Just now",
        time: "Just now",
        category: "file",
      },
      ...prev,
    ])

    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newFile.name,
          category: newFile.category,
          size: 1024 * 1024,
          storageKey: `files/${newFile.name}`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.file) {
          setFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...data.file } : f))
          )
        }
      }
    } catch (err) {
      console.warn("File sync to backend failed:", err)
    }
  }

  const approveDeliverable = async (approvalId: string) => {
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
          user: item.client || "Client",
          userName: item.client || "Client",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
          action: "approved deliverable",
          target: item.title,
          project: item.project,
          timestamp: "Just now",
          time: "Just now",
          category: "approval",
        },
        ...prev,
      ])
    }

    try {
      await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "APPROVED",
          feedback: "Approved by client sign-off",
        }),
      })
    } catch (err) {
      console.warn("Approval sync failed:", err)
    }
  }

  const requestRevision = async (approvalId: string, feedback: string) => {
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
          user: item.client || "Client",
          userName: item.client || "Client",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
          action: "requested revisions on",
          target: item.title,
          project: item.project,
          timestamp: "Just now",
          time: "Just now",
          category: "approval",
        },
        ...prev,
      ])
    }

    try {
      await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "REVISION_REQUESTED",
          feedback,
        }),
      })
    } catch (err) {
      console.warn("Revision request sync failed:", err)
    }
  }

  const sendMessage = async (conversationId: string, text: string) => {
    if (!text.trim()) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      text: text.trim(),
      timestamp: "Just now",
      time: "Just now",
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

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          conversationId,
          text: text.trim(),
        }),
      })
    } catch (err) {
      console.warn("Message sync failed:", err)
    }
  }

  const markInvoicePaid = async (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "paid" as const } : inv))
    )

    const inv = invoices.find((i) => i.id === invoiceId)
    if (inv) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          user: "System",
          userName: "System",
          avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
          action: "marked paid",
          target: `${inv.invoiceNumber || "Invoice"} ($${inv.amount.toLocaleString()})`,
          timestamp: "Just now",
          time: "Just now",
          category: "invoice",
        },
        ...prev,
      ])
    }

    try {
      await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: "PAID",
        }),
      })
    } catch (err) {
      console.warn("Invoice status update failed:", err)
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
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        isLoading,
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
        refreshData,
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
