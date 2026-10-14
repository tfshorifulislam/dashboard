import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { createProjectSchema } from "@/lib/validations"
import { ProjectStatus } from "@/generated/prisma/enums"

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
    const formatted = statusParam.toUpperCase().replace(/[\s-_]+/g, "_") as ProjectStatus
    if (Object.values(ProjectStatus).includes(formatted)) {
      whereClause.status = formatted
    }
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { client: { company: { contains: search, mode: "insensitive" } } },
      { client: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        client: {
          select: { id: true, name: true, company: true, email: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        _count: {
          select: { approvals: true, files: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = projects.map((p) => {
      let displayStatus: string = "In progress"
      if (p.status === "REVIEW") displayStatus = "In review"
      else if (p.status === "COMPLETED") displayStatus = "Completed"
      else if (p.status === "PLANNING") displayStatus = "Planning"

      return {
        id: p.id,
        name: p.name,
        client: p.client.company,
        clientName: p.client.name,
        clientEmail: p.client.email,
        status: displayStatus,
        progress: p.progress,
        dueDate: p.dueDate ? p.dueDate.toISOString().split("T")[0] : "TBD",
        budget: `$${Number(p.budget).toLocaleString()}`,
        category: p.category,
        description: p.description,
        deliverablesCount: p._count.approvals,
        team: p.members.map((m) => ({
          name: m.user.name,
          avatar: m.user.image || "",
          role: m.role,
        })),
      }
    })

    return NextResponse.json({ projects: formatted })
  } catch (error) {
    console.error("[GET_PROJECTS_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const body = await req.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { name, clientId, category, description, budget, dueDate, status } = parsed.data

    // Verify client belongs to this workspace
    let resolvedClientId = clientId
    const client = await prisma.client.findFirst({
      where: {
        workspaceId,
        OR: [
          { id: clientId },
          { company: clientId },
          { name: clientId },
        ],
      },
    })

    if (!client) {
      return NextResponse.json(
        { error: "Invalid client. Client does not exist in your workspace." },
        { status: 400 }
      )
    }
    resolvedClientId = client.id

    const project = await prisma.project.create({
      data: {
        workspaceId,
        clientId: resolvedClientId,
        name,
        category,
        description,
        budget,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status as ProjectStatus,
        progress: 0,
        members: {
          create: {
            userId,
            role: "Lead",
          },
        },
      },
      include: {
        client: true,
      },
    })

    // Record activity audit event
    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "created project",
        target: project.name,
        projectId: project.id,
        projectName: project.name,
        category: "project",
      },
    })

    return NextResponse.json(
      {
        project: {
          id: project.id,
          name: project.name,
          client: client.company,
          clientName: client.name,
          clientEmail: client.email,
          status: "In progress",
          progress: 0,
          dueDate: project.dueDate ? project.dueDate.toISOString().split("T")[0] : "TBD",
          budget: `$${Number(project.budget).toLocaleString()}`,
          category: project.category,
          description: project.description,
          deliverablesCount: 0,
          team: [{ name: userName, avatar: "", role: "Lead" }],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[CREATE_PROJECT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    )
  }
}

