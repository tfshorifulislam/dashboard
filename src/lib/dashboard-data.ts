export interface Project {
  id: string
  name: string
  client: string
  clientName?: string
  clientEmail: string
  status: "In progress" | "In review" | "Planning" | "Completed" | "in-progress" | "review" | "planning" | "completed"
  progress: number
  dueDate: string
  budget: string
  category: string
  description: string
  team: { name: string; avatar: string; role: string }[]
  deliverablesCount: number
}

export interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  avatar: string
  activeProjects: number
  totalSpent: string | number
  status: "Active" | "Lead" | "Archived" | "active" | "lead" | "archived"
  joinedDate: string
  notes?: string
  contactName?: string
  contactEmail?: string
}

export interface MessageItem {
  id: string
  sender: "user" | "client" | string
  text: string
  timestamp: string
  time?: string
  avatar?: string
  senderName?: string
}

export interface Conversation {
  id: string
  clientId: string
  clientName: string
  company: string
  email?: string
  avatar: string
  unreadCount: number
  lastMessage: string
  lastTimestamp: string
  projectName: string
  messages: MessageItem[]
}

export interface FileItem {
  id: string
  name: string
  type?: "figma" | "pdf" | "image" | "zip" | "document" | string
  category?: string
  size: string
  project?: string
  projectName?: string
  uploader?: string
  clientName?: string
  uploadedAt: string
  version?: string
}

export interface ApprovalItem {
  id: string
  title: string
  project?: string
  projectName?: string
  client?: string
  clientName?: string
  submittedBy?: string
  submittedAt: string
  submittedDate?: string
  dueDate?: string
  version: string
  status: "pending" | "approved" | "revision_requested" | "revision"
  description: string
  feedback?: string
}

export interface InvoiceItem {
  id: string
  invoiceNumber?: string
  client: string
  clientName?: string
  clientEmail?: string
  projectName?: string
  amount: number
  issueDate: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  items?: { description: string; hours: number; rate: number; total: number }[]
}

export interface ActivityItem {
  id: string
  user?: string
  userName?: string
  avatar?: string
  action: string
  target: string
  project?: string
  projectName?: string
  timestamp?: string
  time?: string
  type?: string
  category?: "project" | "approval" | "file" | "invoice" | "client" | string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Designer" | "Developer" | "Client"
  avatar: string
  status: "Active" | "Invited"
}

/* ==========================================================================
   Initial Mock Data Store
   ========================================================================== */

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Website Redesign",
    client: "Acme Studio",
    clientEmail: "contact@acmestudio.design",
    status: "In progress",
    progress: 72,
    dueDate: "Oct 22, 2026",
    budget: "$12,500",
    category: "Web Design",
    description: "Complete redesign of marketing site with Next.js and Tailwind CSS.",
    team: [
      { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", role: "Lead Designer" },
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces", role: "Frontend Dev" }
    ],
    deliverablesCount: 8
  },
  {
    id: "proj-2",
    name: "Mobile App UI",
    client: "Nova Technologies",
    clientEmail: "ops@novatech.io",
    status: "In review",
    progress: 90,
    dueDate: "Oct 18, 2026",
    budget: "$18,000",
    category: "Product Design",
    description: "iOS and Android native components design system and user journey maps.",
    team: [
      { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", role: "Product Lead" },
      { name: "Marcus Brody", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces", role: "UI/UX" }
    ],
    deliverablesCount: 14
  },
  {
    id: "proj-3",
    name: "Brand Identity",
    client: "Bloom Creative",
    clientEmail: "hello@bloomcreative.co",
    status: "In progress",
    progress: 45,
    dueDate: "Oct 28, 2026",
    budget: "$6,500",
    category: "Branding",
    description: "Complete visual identity, logo mark, color system, and brand guidelines book.",
    team: [
      { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", role: "Art Director" }
    ],
    deliverablesCount: 5
  },
  {
    id: "proj-4",
    name: "E-commerce Store",
    client: "Northstar Goods",
    clientEmail: "jake@northstargoods.com",
    status: "Planning",
    progress: 20,
    dueDate: "Nov 05, 2026",
    budget: "$24,000",
    category: "Full Stack",
    description: "Shopify headless storefront architecture with custom checkout integration.",
    team: [
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces", role: "Tech Lead" },
      { name: "Marcus Brody", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces", role: "Design" }
    ],
    deliverablesCount: 12
  },
  {
    id: "proj-5",
    name: "SaaS Design System",
    client: "Horizon AI",
    clientEmail: "elena@horizonai.com",
    status: "Completed",
    progress: 100,
    dueDate: "Oct 04, 2026",
    budget: "$15,200",
    category: "Design System",
    description: "Figma tokens and React component library sync for generative AI platform.",
    team: [
      { name: "Alex Morgan", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces", role: "System Lead" }
    ],
    deliverablesCount: 22
  }
]

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "David Kim",
    company: "Acme Studio",
    email: "david@acmestudio.design",
    phone: "+1 (555) 234-8901",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    activeProjects: 1,
    totalSpent: "$28,500",
    status: "Active",
    joinedDate: "Mar 12, 2025",
    notes: "Requires weekly Friday async video Loom updates."
  },
  {
    id: "client-2",
    name: "Elena Rostova",
    company: "Nova Technologies",
    email: "elena@novatech.io",
    phone: "+1 (555) 492-1134",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
    activeProjects: 1,
    totalSpent: "$42,000",
    status: "Active",
    joinedDate: "Jan 18, 2025",
    notes: "Approvals handled by VP of Engineering."
  },
  {
    id: "client-3",
    name: "Marcus Vance",
    company: "Bloom Creative",
    email: "marcus@bloomcreative.co",
    phone: "+1 (555) 871-9920",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
    activeProjects: 1,
    totalSpent: "$14,800",
    status: "Active",
    joinedDate: "Jun 04, 2025",
    notes: "Quick communicator via ClientSpace portal."
  },
  {
    id: "client-4",
    name: "Rachel Green",
    company: "Northstar Goods",
    email: "rachel@northstargoods.com",
    phone: "+1 (555) 603-7721",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
    activeProjects: 1,
    totalSpent: "$24,000",
    status: "Active",
    joinedDate: "Sep 29, 2026",
    notes: "High growth D2C lifestyle brand."
  },
  {
    id: "client-5",
    name: "Simon Croft",
    company: "Horizon AI",
    email: "simon@horizonai.com",
    phone: "+1 (555) 312-8809",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    activeProjects: 0,
    totalSpent: "$31,500",
    status: "Active",
    joinedDate: "Aug 15, 2025",
    notes: "Contract renewal scheduled for Q1."
  }
]

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    clientId: "client-1",
    clientName: "David Kim",
    company: "Acme Studio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    unreadCount: 1,
    lastMessage: "The revised checkout prototype looks fantastic. Can we test on mobile?",
    lastTimestamp: "10:24 AM",
    projectName: "Website Redesign",
    messages: [
      { id: "m1", sender: "client", text: "Hey Alex! Did you get a chance to review the font licensing notes?", timestamp: "Yesterday 4:15 PM" },
      { id: "m2", sender: "user", text: "Hi David, yes! We opted for the commercial webfont bundle so we have zero domain restrictions.", timestamp: "Yesterday 4:32 PM" },
      { id: "m3", sender: "client", text: "The revised checkout prototype looks fantastic. Can we test on mobile?", timestamp: "10:24 AM" }
    ]
  },
  {
    id: "conv-2",
    clientId: "client-2",
    clientName: "Elena Rostova",
    company: "Nova Technologies",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
    unreadCount: 0,
    lastMessage: "Approved the wireframes! Waiting on the API specs.",
    lastTimestamp: "Yesterday",
    projectName: "Mobile App UI",
    messages: [
      { id: "m4", sender: "user", text: "Elena, I just published v2.4 of the wireframes with biometric auth flows.", timestamp: "Oct 12 11:00 AM" },
      { id: "m5", sender: "client", text: "Approved the wireframes! Waiting on the API specs.", timestamp: "Yesterday" }
    ]
  },
  {
    id: "conv-3",
    clientId: "client-3",
    clientName: "Marcus Vance",
    company: "Bloom Creative",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
    unreadCount: 0,
    lastMessage: "Color exploration palette 3 is our team's favorite.",
    lastTimestamp: "Oct 12",
    projectName: "Brand Identity",
    messages: [
      { id: "m6", sender: "client", text: "Color exploration palette 3 is our team's favorite.", timestamp: "Oct 12" }
    ]
  },
  {
    id: "conv-4",
    clientId: "client-4",
    clientName: "Rachel Green",
    company: "Northstar Goods",
    email: "rachel@northstargoods.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
    unreadCount: 2,
    lastMessage: "Looking forward to kicking off the sprint this Thursday!",
    lastTimestamp: "Oct 11",
    projectName: "E-commerce Store",
    messages: [
      { id: "m7", sender: "client", text: "Looking forward to kicking off the sprint this Thursday!", timestamp: "Oct 11" }
    ]
  }
]

export const INITIAL_FILES: FileItem[] = [
  {
    id: "file-1",
    name: "Homepage-final.fig",
    type: "figma",
    size: "48.2 MB",
    project: "Website Redesign",
    uploader: "Alex Morgan",
    uploadedAt: "Today, 9:30 AM",
    version: "v2.0"
  },
  {
    id: "file-2",
    name: "Nova-Mobile-Specs.pdf",
    type: "pdf",
    size: "4.8 MB",
    project: "Mobile App UI",
    uploader: "Sarah Chen",
    uploadedAt: "Yesterday",
    version: "v1.4"
  },
  {
    id: "file-3",
    name: "Brand-Guidelines-2026.pdf",
    type: "pdf",
    size: "12.6 MB",
    project: "Brand Identity",
    uploader: "Alex Morgan",
    uploadedAt: "Oct 12, 2026",
    version: "v1.1"
  },
  {
    id: "file-4",
    name: "Logo-Assets-Vector.zip",
    type: "zip",
    size: "82.4 MB",
    project: "Brand Identity",
    uploader: "Alex Morgan",
    uploadedAt: "Oct 10, 2026",
    version: "v1.0"
  },
  {
    id: "file-5",
    name: "Hero-Illustration-4K.png",
    type: "image",
    size: "8.1 MB",
    project: "Website Redesign",
    uploader: "Marcus Brody",
    uploadedAt: "Oct 08, 2026",
    version: "v2.1"
  },
  {
    id: "file-6",
    name: "Shopify-Architecture-Brief.docx",
    type: "document",
    size: "1.2 MB",
    project: "E-commerce Store",
    uploader: "Sarah Chen",
    uploadedAt: "Oct 05, 2026",
    version: "v1.0"
  }
]

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "appr-1",
    title: "Homepage design",
    project: "Website Redesign",
    client: "Acme Studio",
    submittedBy: "Alex Morgan",
    submittedAt: "Oct 13, 2026",
    version: "v2.2",
    status: "pending",
    description: "Desktop and mobile hero section, features grid, interactive testimonial carousel."
  },
  {
    id: "appr-2",
    title: "Mobile wireframes",
    project: "Mobile App UI",
    client: "Nova Technologies",
    submittedBy: "Sarah Chen",
    submittedAt: "Oct 12, 2026",
    version: "v1.8",
    status: "pending",
    description: "Complete user onboarding and biometric authorization screen flows."
  },
  {
    id: "appr-3",
    title: "Brand guidelines",
    project: "Brand Identity",
    client: "Bloom Creative",
    submittedBy: "Alex Morgan",
    submittedAt: "Oct 11, 2026",
    version: "v1.0",
    status: "pending",
    description: "Primary typography scale, dark & light mode color matrix, logo exclusion zone."
  },
  {
    id: "appr-4",
    title: "Checkout User Flow",
    project: "Website Redesign",
    client: "Acme Studio",
    submittedBy: "Alex Morgan",
    submittedAt: "Oct 08, 2026",
    version: "v1.4",
    status: "approved",
    description: "Single-page accordion checkout with Apple Pay and Stripe Elements.",
    feedback: "Approved! Clean, intuitive, and fast."
  },
  {
    id: "appr-5",
    title: "Catalog Filtering System",
    project: "E-commerce Store",
    client: "Northstar Goods",
    submittedBy: "Marcus Brody",
    submittedAt: "Oct 06, 2026",
    version: "v1.1",
    status: "revision_requested",
    description: "Multi-select faceted filter sidebar for collection pages.",
    feedback: "Please add price range slider and instant clear-all tag buttons."
  }
]

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-042",
    client: "Acme Studio",
    clientEmail: "billing@acmestudio.design",
    amount: 3200,
    issueDate: "Oct 01, 2026",
    dueDate: "Oct 15, 2026",
    status: "paid",
    items: [
      { description: "Sprint 1: Information Architecture & Wireframing", hours: 24, rate: 100, total: 2400 },
      { description: "Interactive Protoype Walkthrough", hours: 8, rate: 100, total: 800 }
    ]
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-043",
    client: "Nova Technologies",
    clientEmail: "accounts@novatech.io",
    amount: 4500,
    issueDate: "Oct 05, 2026",
    dueDate: "Oct 20, 2026",
    status: "pending",
    items: [
      { description: "Mobile App Screen System (iOS/Android)", hours: 30, rate: 125, total: 3750 },
      { description: "Design Tokens & Hand-off Specifications", hours: 6, rate: 125, total: 750 }
    ]
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-044",
    client: "Bloom Creative",
    clientEmail: "finance@bloomcreative.co",
    amount: 2750,
    issueDate: "Oct 08, 2026",
    dueDate: "Oct 22, 2026",
    status: "pending",
    items: [
      { description: "Brand Identity Design Exploration & Color Matrix", hours: 22, rate: 125, total: 2750 }
    ]
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-040",
    client: "Northstar Goods",
    clientEmail: "ap@northstargoods.com",
    amount: 1200,
    issueDate: "Sep 20, 2026",
    dueDate: "Oct 05, 2026",
    status: "overdue",
    items: [
      { description: "Discovery & Technical Feasibility Audit", hours: 10, rate: 120, total: 1200 }
    ]
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-039",
    client: "Horizon AI",
    clientEmail: "finance@horizonai.com",
    amount: 7600,
    issueDate: "Sep 15, 2026",
    dueDate: "Sep 30, 2026",
    status: "paid",
    items: [
      { description: "Design System Architecture & React Tokens", hours: 50, rate: 152, total: 7600 }
    ]
  }
]

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    user: "Alex Morgan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    action: "uploaded",
    target: "Homepage-final.fig",
    project: "Website Redesign",
    timestamp: "18 minutes ago",
    category: "file"
  },
  {
    id: "act-2",
    user: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    action: "approved",
    target: "Mobile App Wireframes (v1.8)",
    project: "Mobile App UI",
    timestamp: "2 hours ago",
    category: "approval"
  },
  {
    id: "act-3",
    user: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    action: "commented on",
    target: "Checkout user flow proposal",
    project: "Website Redesign",
    timestamp: "4 hours ago",
    category: "project"
  },
  {
    id: "act-4",
    user: "System",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop",
    action: "marked paid",
    target: "Invoice #INV-2026-042 ($3,200)",
    project: "Website Redesign",
    timestamp: "Yesterday, 3:15 PM",
    category: "invoice"
  },
  {
    id: "act-5",
    user: "Rachel Green",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces",
    action: "joined the workspace",
    target: "Northstar Goods Portal",
    timestamp: "2 days ago",
    category: "client"
  }
]

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Alex Morgan",
    email: "alex@clientspace.io",
    role: "Owner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    status: "Active"
  },
  {
    id: "tm-2",
    name: "Sarah Chen",
    email: "sarah@clientspace.io",
    role: "Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    status: "Active"
  },
  {
    id: "tm-3",
    name: "Marcus Brody",
    email: "marcus@clientspace.io",
    role: "Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    status: "Active"
  }
]
