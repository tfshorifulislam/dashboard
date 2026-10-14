import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { createClientSchema } from "@/lib/validations"
import { ClientStatus } from "@/generated/prisma/enums"

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
    const formattedStatus = statusParam.toUpperCase() as ClientStatus
    if (Object.values(ClientStatus).includes(formattedStatus)) {
      whereClause.status = formattedStatus
    }
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  try {
    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        projects: {
          select: { id: true, status: true },
        },
        invoices: {
          select: { amount: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = clients.map((c) => {
      const activeProjects = c.projects.filter(
        (p) => p.status === "IN_PROGRESS" || p.status === "REVIEW"
      ).length

      const totalSpent = c.invoices
        .filter((inv) => inv.status === "PAID")
        .reduce((sum, inv) => sum + Number(inv.amount), 0)

      return {
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone || "",
        avatar: c.avatar || "",
        status: c.status.toLowerCase(),
        notes: c.notes || "",
        activeProjects,
        totalSpent: `$${totalSpent.toLocaleString()}`,
        joinedDate: c.createdAt.toISOString().split("T")[0],
      }
    })

    return NextResponse.json({ clients: formatted })
  } catch (error) {
    console.error("[GET_CLIENTS_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to retrieve clients list." },
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
    const parsed = createClientSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { name, company, email, phone, notes, status } = parsed.data

    // Check if client with this email already exists in this workspace
    const existing = await prisma.client.findFirst({
      where: {
        workspaceId,
        email: { equals: email, mode: "insensitive" },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A client with this email already exists in your workspace." },
        { status: 409 }
      )
    }

    const client = await prisma.client.create({
      data: {
        workspaceId,
        name,
        company,
        email,
        phone,
        notes,
        status: (status.toUpperCase() as ClientStatus) || ClientStatus.ACTIVE,
      },
    })

    // Record activity audit event
    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "added client",
        target: `${client.name} (${client.company})`,
        category: "client",
      },
    })

    return NextResponse.json(
      {
        client: {
          id: client.id,
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone || "",
          status: client.status.toLowerCase(),
          activeProjects: 0,
          totalSpent: "$0",
          joinedDate: client.createdAt.toISOString().split("T")[0],
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[CREATE_CLIENT_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create client account." },
      { status: 500 }
    )
  }
}

