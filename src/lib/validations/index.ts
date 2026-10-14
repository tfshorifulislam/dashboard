import { z } from "zod"

// -----------------------------------------------------------------------------
// Client Schemas
// -----------------------------------------------------------------------------
export const createClientSchema = z.object({
  name: z.string().min(2, "Contact name must be at least 2 characters").max(100),
  company: z.string().min(2, "Company name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  status: z.enum(["ACTIVE", "LEAD", "ARCHIVED", "Active", "Lead", "Archived"]).default("ACTIVE"),
})

export const updateClientSchema = createClientSchema.partial()

// -----------------------------------------------------------------------------
// Project Schemas
// -----------------------------------------------------------------------------
export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters").max(120),
  clientId: z.string().min(1, "Client is required"),
  category: z.string().max(80).default("Web Design"),
  description: z.string().max(5000).default("New client project workspace"),
  budget: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === "number") return val
    const num = parseFloat(val.replace(/[^0-9.-]+/g, ""))
    return isNaN(num) ? 0 : num
  }),
  dueDate: z.string().optional().nullable(),
  status: z
    .enum([
      "PLANNING",
      "IN_PROGRESS",
      "REVIEW",
      "COMPLETED",
      "Planning",
      "In progress",
      "In review",
      "Completed",
      "in-progress",
      "review",
      "completed",
      "planning",
    ])
    .default("IN_PROGRESS")
    .transform((val) => {
      const v = val.toLowerCase().replace(/[\s-_]+/g, "")
      if (v.includes("review")) return "REVIEW" as const
      if (v.includes("complete")) return "COMPLETED" as const
      if (v.includes("plan")) return "PLANNING" as const
      return "IN_PROGRESS" as const
    }),
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  progress: z.number().min(0).max(100).optional(),
})

// -----------------------------------------------------------------------------
// Invoice Schemas
// -----------------------------------------------------------------------------
export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  quantity: z.number().min(0.01).default(1),
  rate: z.number().min(0),
  hours: z.number().optional(), // For compatibility with existing UI
})

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  projectId: z.string().optional().nullable(),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().max(2000).optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, "At least one line item is required"),
})

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["DRAFT", "PENDING", "PAID", "OVERDUE", "CANCELLED", "draft", "pending", "paid", "overdue", "cancelled"]),
})

// -----------------------------------------------------------------------------
// Approval Schemas
// -----------------------------------------------------------------------------
export const createApprovalSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  clientId: z.string().optional().nullable(),
  title: z.string().min(2, "Deliverable title is required").max(200),
  description: z.string().max(5000).optional().nullable(),
  version: z.string().max(20).default("v1.0"),
  dueDate: z.string().optional().nullable(),
})

export const decideApprovalSchema = z.object({
  status: z.enum(["APPROVED", "REVISION_REQUESTED", "approved", "revision_requested"]),
  feedback: z.string().max(2000).optional().nullable(),
})

// -----------------------------------------------------------------------------
// Message Schemas
// -----------------------------------------------------------------------------
export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  text: z.string().trim().min(1, "Message text cannot be empty").max(5000),
})

// -----------------------------------------------------------------------------
// File Metadata Schemas
// -----------------------------------------------------------------------------
export const createFileMetadataSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().int().min(0),
  mimeType: z.string().default("application/octet-stream"),
  category: z.string().default("document"),
  projectId: z.string().optional().nullable(),
  storageKey: z.string().min(1, "Storage key is required"),
  url: z.string().optional().nullable(),
  version: z.string().default("v1.0"),
})

// -----------------------------------------------------------------------------
// Workspace & Settings Schemas
// -----------------------------------------------------------------------------
export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  agencyEmail: z.string().email().optional().nullable(),
  customDomain: z.string().max(255).optional().nullable(),
  currency: z.string().max(20).optional(),
})

export const updateUserProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional().nullable(),
})
