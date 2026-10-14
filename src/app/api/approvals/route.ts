import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { createApprovalSchema } from "@/lib/validations"
import { ApprovalStatus } from "@/generated/prisma/enums"

export async function GET(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const statusParam = searchParams.get("status")

  const whereClause: Record<string, unknown> = {
    workspaceId,
  }

  if (statusParam && statusParam !== "all") {
    const formatted = statusParam.toUpperCase() as ApprovalStatus
    if (Object.values(ApprovalStatus).includes(formatted)) {
      whereClause.status = formatted
    }
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { project: { name: { contains: search, mode: "insensitive" } } },
      { client: { company: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const approvals = await prisma.approval.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true } },
        client: { select: { id: true, name: true, company: true } },
        submittedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = approvals.map((app) => ({
      id: app.id,
      title: app.title,
      project: app.project.name,
      projectName: app.project.name,
      client: app.client?.company || "Direct Client",
      clientName: app.client?.company || "Direct Client",
      submittedBy: app.submittedBy?.name || "Agency Team",
      submittedAt: app.createdAt.toISOString().split("T")[0],
      submittedDate: app.createdAt.toISOString().split("T")[0],
      dueDate: app.dueDate ? app.dueDate.toISOString().split("T")[0] : undefined,
      version: app.version,
      status: app.status.toLowerCase(),
      description: app.description || "",
      feedback: app.feedback || undefined,
    }))

    return NextResponse.json({ approvals: formatted })
  } catch (error) {
    console.error("[GET_APPROVALS_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch approvals." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const body = await req.json()
    const parsed = createApprovalSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { projectId, clientId, title, description, version, dueDate } = parsed.data

    // Verify project belongs to workspace
    const project = await prisma.project.findFirst({
      where: { id: projectId, workspaceId },
      include: { client: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: "Invalid project. Project not found in this workspace." },
        { status: 400 }
      )
    }

    const approval = await prisma.approval.create({
      data: {
        workspaceId,
        projectId: project.id,
        clientId: clientId || project.clientId,
        title,
        description,
        version: version || "v1.0",
        dueDate: dueDate ? new Date(dueDate) : null,
        submittedById: userId,
        status: ApprovalStatus.PENDING,
      },
      include: {
        project: true,
        client: true,
      },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "submitted deliverable for sign-off",
        target: `${approval.title} (${approval.version})`,
        projectId: project.id,
        projectName: project.name,
        category: "approval",
      },
    })

    return NextResponse.json(
      {
        approval: {
          id: approval.id,
          title: approval.title,
          project: project.name,
          projectName: project.name,
          client: approval.client?.company || "Direct Client",
          clientName: approval.client?.company || "Direct Client",
          submittedBy: userName,
          submittedAt: approval.createdAt.toISOString().split("T")[0],
          submittedDate: approval.createdAt.toISOString().split("T")[0],
          dueDate: approval.dueDate ? approval.dueDate.toISOString().split("T")[0] : undefined,
          version: approval.version,
          status: "pending",
          description: approval.description || "",
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[CREATE_APPROVAL_ERROR]", error)
    return NextResponse.json({ error: "Failed to submit approval." }, { status: 500 })
  }
}

