import { NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx

  try {
    const [
      projectCount,
      clientCount,
      pendingApprovalsCount,
      invoices,
      recentProjects,
      recentActivities,
    ] = await Promise.all([
      // Total active projects
      prisma.project.count({
        where: { workspaceId },
      }),

      // Total active clients
      prisma.client.count({
        where: { workspaceId, status: "ACTIVE" },
      }),

      // Pending approvals awaiting client sign-off
      prisma.approval.count({
        where: { workspaceId, status: "PENDING" },
      }),

      // Invoices for calculating financial totals
      prisma.invoice.findMany({
        where: { workspaceId },
        select: {
          id: true,
          amount: true,
          status: true,
        },
      }),

      // Recent projects
      prisma.project.findMany({
        where: { workspaceId },
        include: {
          client: {
            select: { name: true, company: true, email: true },
          },
          _count: {
            select: { approvals: true, files: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Recent activities
      prisma.activityLog.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ])

    // Calculate invoice totals
    let totalOutstanding = 0
    let totalCollected = 0
    let overdueCount = 0

    for (const inv of invoices) {
      const amt = Number(inv.amount)
      if (inv.status === "PAID") {
        totalCollected += amt
      } else if (inv.status === "PENDING" || inv.status === "OVERDUE") {
        totalOutstanding += amt
        if (inv.status === "OVERDUE") overdueCount++
      }
    }

    return NextResponse.json({
      metrics: {
        activeProjects: projectCount,
        activeClients: clientCount,
        pendingApprovals: pendingApprovalsCount,
        outstandingAmount: totalOutstanding,
        collectedAmount: totalCollected,
        overdueCount,
      },
      recentProjects: recentProjects.map((p) => ({
        id: p.id,
        name: p.name,
        client: p.client.company,
        clientName: p.client.name,
        clientEmail: p.client.email,
        status: p.status,
        progress: p.progress,
        dueDate: p.dueDate ? p.dueDate.toISOString().split("T")[0] : null,
        budget: `$${Number(p.budget).toLocaleString()}`,
        category: p.category,
        description: p.description,
        deliverablesCount: p._count.approvals,
      })),
      recentActivities: recentActivities.map((act) => ({
        id: act.id,
        userName: act.userName,
        userAvatar: act.userAvatar,
        action: act.action,
        target: act.target,
        category: act.category,
        projectName: act.projectName,
        createdAt: act.createdAt,
      })),
    })
  } catch (error) {
    console.error("[OVERVIEW_API_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to load dashboard overview data." },
      { status: 500 }
    )
  }
}

