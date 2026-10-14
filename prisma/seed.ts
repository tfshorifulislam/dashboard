import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Please set it in .env before seeding.")
    process.exit(1)
  }

  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  console.log("Seeding ClientSpace database...")

  // Clean existing data in reverse relation order
  await prisma.activityLog.deleteMany({})
  await prisma.invoiceItem.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.approval.deleteMany({})
  await prisma.fileMetadata.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.conversation.deleteMany({})
  await prisma.projectMember.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.client.deleteMany({})
  await prisma.workspaceMember.deleteMany({})
  await prisma.workspace.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.user.deleteMany({})

  // 1. Create Main User
  const mainUser = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "alex@clientspace.design",
      emailVerified: true,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
  })

  // Team users
  const teamUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: "Sarah Connor",
        email: "sarah@clientspace.design",
        emailVerified: true,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        name: "Michael Chang",
        email: "michael@clientspace.design",
        emailVerified: true,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Kim",
        email: "david@clientspace.design",
        emailVerified: true,
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
    }),
  ])

  // 2. Create Workspaces
  const primaryWorkspace = await prisma.workspace.create({
    data: {
      name: "Acme Creative Agency",
      slug: "acme-creative-agency",
      plan: "Agency Pro Tier",
      agencyEmail: "contact@acmecreative.agency",
      customDomain: "portal.acmecreative.agency",
      currency: "USD ($)",
      members: {
        create: [
          { userId: mainUser.id, role: "OWNER" },
          { userId: teamUsers[0].id, role: "ADMIN" },
          { userId: teamUsers[1].id, role: "DEVELOPER" },
          { userId: teamUsers[2].id, role: "DESIGNER" },
        ],
      },
    },
  })

  // Secondary workspaces
  await prisma.workspace.create({
    data: {
      name: "Freelance Design Lab",
      slug: "freelance-design-lab",
      plan: "Solo Creator Tier",
      members: {
        create: [{ userId: mainUser.id, role: "OWNER" }],
      },
    },
  })

  await prisma.workspace.create({
    data: {
      name: "Starlight Digital",
      slug: "starlight-digital",
      plan: "Agency Pro Tier",
      members: {
        create: [{ userId: mainUser.id, role: "ADMIN" }],
      },
    },
  })

  // 3. Create Clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        workspaceId: primaryWorkspace.id,
        name: "Rachel Green",
        company: "Acme Studio",
        email: "contact@acmestudio.design",
        phone: "+1 (555) 234-5678",
        status: "ACTIVE",
        notes: "Preferred deliverable review days: Tuesdays and Thursdays.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: primaryWorkspace.id,
        name: "David Sterling",
        company: "Quantum AI",
        email: "sarah@quantumai.tech",
        phone: "+1 (555) 876-5432",
        status: "ACTIVE",
        notes: "Focusing on enterprise AI UI components and dark mode tokens.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: primaryWorkspace.id,
        name: "Dr. Evelyn Reed",
        company: "Horizon Health",
        email: "david@horizonhealth.org",
        phone: "+1 (555) 345-6789",
        status: "ACTIVE",
        notes: "HIPAA-compliant client patient portal design.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: primaryWorkspace.id,
        name: "Marcus Vance",
        company: "Apex Labs",
        email: "michael@apexlabs.dev",
        phone: "+1 (555) 901-2345",
        status: "ACTIVE",
        notes: "Series A startup, rapid bi-weekly sprint cycle.",
      },
    }),
    prisma.client.create({
      data: {
        workspaceId: primaryWorkspace.id,
        name: "Elena Rostova",
        company: "Lumina Media",
        email: "elena@luminamedia.com",
        phone: "+1 (555) 432-1098",
        status: "LEAD",
        notes: "Brand guidelines proposal sent.",
      },
    }),
  ])

  // 4. Create Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        workspaceId: primaryWorkspace.id,
        clientId: clients[0].id,
        name: "Website Redesign",
        category: "Web Design",
        description: "Complete agency website redesign with Next.js App Router and responsive Tailwind styling.",
        budget: 12500,
        status: "IN_PROGRESS",
        progress: 72,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        members: {
          create: [{ userId: mainUser.id, role: "Lead Designer" }],
        },
      },
    }),
    prisma.project.create({
      data: {
        workspaceId: primaryWorkspace.id,
        clientId: clients[1].id,
        name: "Quantum Design System",
        category: "Design System",
        description: "Comprehensive tokenized Figma and React component system for Quantum AI platform.",
        budget: 24000,
        status: "IN_PROGRESS",
        progress: 45,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        members: {
          create: [{ userId: mainUser.id, role: "Design Architect" }],
        },
      },
    }),
    prisma.project.create({
      data: {
        workspaceId: primaryWorkspace.id,
        clientId: clients[2].id,
        name: "Patient Portal",
        category: "Mobile App",
        description: "Patient engagement and appointments scheduling web app with real-time health data.",
        budget: 18500,
        status: "REVIEW",
        progress: 90,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        members: {
          create: [{ userId: teamUsers[1].id, role: "Lead Engineer" }],
        },
      },
    }),
    prisma.project.create({
      data: {
        workspaceId: primaryWorkspace.id,
        clientId: clients[3].id,
        name: "Storefront Revamp",
        category: "E-Commerce",
        description: "Headless Shopify store with custom cart and checkout flows.",
        budget: 32000,
        status: "COMPLETED",
        progress: 100,
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        members: {
          create: [{ userId: mainUser.id, role: "Project Manager" }],
        },
      },
    }),
  ])

  // 5. Create Invoices
  await prisma.invoice.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[0].id,
      projectId: projects[0].id,
      invoiceNumber: "INV-2026-001",
      status: "PAID",
      subtotal: 12500,
      tax: 0,
      amount: 12500,
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      items: {
        create: [
          { description: "UX Research & Wireframing", quantity: 40, rate: 125, amount: 5000 },
          { description: "High-Fidelity UI Design & Prototypes", quantity: 60, rate: 125, amount: 7500 },
        ],
      },
    },
  })

  await prisma.invoice.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[1].id,
      projectId: projects[1].id,
      invoiceNumber: "INV-2026-002",
      status: "PAID",
      subtotal: 24000,
      tax: 0,
      amount: 24000,
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      items: {
        create: [
          { description: "Design Token Architecture", quantity: 60, rate: 150, amount: 9000 },
          { description: "Component Library Implementation", quantity: 100, rate: 150, amount: 15000 },
        ],
      },
    },
  })

  await prisma.invoice.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[2].id,
      projectId: projects[2].id,
      invoiceNumber: "INV-2026-003",
      status: "PENDING",
      subtotal: 8500,
      tax: 0,
      amount: 8500,
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      items: {
        create: [
          { description: "Patient Dashboard Flow Design", quantity: 50, rate: 170, amount: 8500 },
        ],
      },
    },
  })

  await prisma.invoice.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[1].id,
      projectId: projects[1].id,
      invoiceNumber: "INV-2026-004",
      status: "OVERDUE",
      subtotal: 3600,
      tax: 0,
      amount: 3600,
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      items: {
        create: [
          { description: "Component Accessibility Audit & Remediation", quantity: 24, rate: 150, amount: 3600 },
        ],
      },
    },
  })

  // 6. Create Approvals
  await prisma.approval.create({
    data: {
      workspaceId: primaryWorkspace.id,
      projectId: projects[1].id,
      clientId: clients[1].id,
      title: "Design System Token Export",
      description: "Color tokens, typography scale, elevation shadows, and component border radius specs.",
      version: "v2.0",
      status: "PENDING",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      submittedById: mainUser.id,
    },
  })

  await prisma.approval.create({
    data: {
      workspaceId: primaryWorkspace.id,
      projectId: projects[2].id,
      clientId: clients[2].id,
      title: "Mobile App Checkout Flow Prototype",
      description: "Interactive Figma prototype covering step 1-4 checkout and biometric authorization.",
      version: "v1.4",
      status: "PENDING",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      submittedById: mainUser.id,
    },
  })

  await prisma.approval.create({
    data: {
      workspaceId: primaryWorkspace.id,
      projectId: projects[0].id,
      clientId: clients[0].id,
      title: "Final Brand Identity Asset Export",
      description: "Export package including SVG vectors, brand book PDF, and favicon package.",
      version: "v3.0",
      status: "APPROVED",
      feedback: "Approved by client sign-off. Ready for release.",
      submittedById: mainUser.id,
      decidedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    },
  })

  await prisma.approval.create({
    data: {
      workspaceId: primaryWorkspace.id,
      projectId: projects[3].id,
      clientId: clients[3].id,
      title: "Storefront Checkout Flow Wireframes",
      description: "Initial low-fidelity wireframes for single-page checkout.",
      version: "v1.1",
      status: "REVISION_REQUESTED",
      feedback: "Please revise payment method icons and spacing between billing fields.",
      submittedById: mainUser.id,
      decidedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  })

  // 7. Create Conversations & Messages
  const conv1 = await prisma.conversation.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[0].id,
      projectId: projects[0].id,
      lastMessage: "Thanks Alex! The updated landing page look fantastic.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 15),
    },
  })

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv1.id,
        senderId: mainUser.id,
        senderType: "AGENCY",
        senderName: "Alex Morgan",
        text: "Hi Rachel! We just uploaded the latest revision of the landing page mockups for your review.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        conversationId: conv1.id,
        senderType: "CLIENT",
        senderName: "Rachel Green",
        text: "Thanks Alex! The updated landing page look fantastic. Team will review this afternoon.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    ],
  })

  const conv2 = await prisma.conversation.create({
    data: {
      workspaceId: primaryWorkspace.id,
      clientId: clients[1].id,
      projectId: projects[1].id,
      lastMessage: "Looking over the token documentation now.",
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 45),
    },
  })

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        senderId: mainUser.id,
        senderType: "AGENCY",
        senderName: "Alex Morgan",
        text: "David, the design tokens have been exported and are ready for developer handoff.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
      },
      {
        conversationId: conv2.id,
        senderType: "CLIENT",
        senderName: "David Sterling",
        text: "Looking over the token documentation now. Will sign off the deliverable shortly.",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
      },
    ],
  })

  // 8. Create Files
  await prisma.fileMetadata.createMany({
    data: [
      {
        workspaceId: primaryWorkspace.id,
        projectId: projects[0].id,
        uploaderId: mainUser.id,
        name: "Acme_Brand_Identity_Guidelines_v2.pdf",
        size: 8500000,
        mimeType: "application/pdf",
        category: "document",
        storageKey: `workspaces/${primaryWorkspace.id}/Acme_Brand_Identity_Guidelines_v2.pdf`,
        version: "v2.0",
      },
      {
        workspaceId: primaryWorkspace.id,
        projectId: projects[1].id,
        uploaderId: mainUser.id,
        name: "Quantum_Tokens_Export.fig",
        size: 34200000,
        mimeType: "application/octet-stream",
        category: "design",
        storageKey: `workspaces/${primaryWorkspace.id}/Quantum_Tokens_Export.fig`,
        version: "v2.4",
      },
      {
        workspaceId: primaryWorkspace.id,
        projectId: projects[2].id,
        uploaderId: teamUsers[1].id,
        name: "Horizon_Portal_API_Spec.ts",
        size: 450000,
        mimeType: "text/plain",
        category: "code",
        storageKey: `workspaces/${primaryWorkspace.id}/Horizon_Portal_API_Spec.ts`,
        version: "v1.2",
      },
      {
        workspaceId: primaryWorkspace.id,
        projectId: projects[3].id,
        uploaderId: mainUser.id,
        name: "Storefront_Icon_Pack.zip",
        size: 14200000,
        mimeType: "application/zip",
        category: "archive",
        storageKey: `workspaces/${primaryWorkspace.id}/Storefront_Icon_Pack.zip`,
        version: "v1.0",
      },
    ],
  })

  // 9. Create Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        workspaceId: primaryWorkspace.id,
        userId: mainUser.id,
        userName: "Alex Morgan",
        action: "created project",
        target: "Website Redesign",
        projectName: "Website Redesign",
        category: "project",
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
      {
        workspaceId: primaryWorkspace.id,
        userId: mainUser.id,
        userName: "Alex Morgan",
        action: "issued invoice",
        target: "INV-2026-003 ($8,500)",
        projectName: "Patient Portal",
        category: "invoice",
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        workspaceId: primaryWorkspace.id,
        userName: "Sarah Connor",
        action: "approved deliverable",
        target: "Brand Identity Asset Export",
        projectName: "Website Redesign",
        category: "approval",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        workspaceId: primaryWorkspace.id,
        userId: mainUser.id,
        userName: "Alex Morgan",
        action: "uploaded file",
        target: "Quantum_Tokens_Export.fig",
        projectName: "Quantum Design System",
        category: "file",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
      {
        workspaceId: primaryWorkspace.id,
        userName: "System",
        action: "marked paid",
        target: "INV-2026-001 ($12,500)",
        category: "invoice",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ],
  })

  console.log("Database seeded successfully!")
  await pool.end()
}

main().catch((e) => {
  console.error("Seed error:", e)
  process.exit(1)
})

