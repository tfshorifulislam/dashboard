import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { createInvoiceSchema } from "@/lib/validations"
import { InvoiceStatus } from "@/generated/prisma/enums"

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
    const formatted = statusParam.toUpperCase() as InvoiceStatus
    if (Object.values(InvoiceStatus).includes(formatted)) {
      whereClause.status = formatted
    }
  }

  if (search) {
    whereClause.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { client: { company: { contains: search, mode: "insensitive" } } },
      { client: { name: { contains: search, mode: "insensitive" } } },
      { project: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        client: { select: { name: true, company: true, email: true } },
        project: { select: { name: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      client: inv.client.company,
      clientName: inv.client.name,
      clientEmail: inv.client.email,
      projectName: inv.project?.name || "Contract Retainer",
      amount: Number(inv.amount),
      issueDate: inv.issueDate.toISOString().split("T")[0],
      dueDate: inv.dueDate.toISOString().split("T")[0],
      status: inv.status.toLowerCase(),
      items: inv.items.map((it) => ({
        description: it.description,
        hours: Number(it.quantity),
        rate: Number(it.rate),
        total: Number(it.amount),
      })),
    }))

    return NextResponse.json({ invoices: formatted })
  } catch (error) {
    console.error("[GET_INVOICES_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch invoices." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const body = await req.json()
    const parsed = createInvoiceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { clientId, projectId, dueDate, notes, items } = parsed.data

    // Verify client belongs to this workspace
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
        { error: "Invalid client. Client not found in this workspace." },
        { status: 400 }
      )
    }

    // Verify project belongs to this workspace if supplied
    let verifiedProjectId: string | null = null
    let projectName = "Contract Work"
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, workspaceId },
      })
      if (project) {
        verifiedProjectId = project.id
        projectName = project.name
      }
    }

    // Calculate totals securely on the server
    let calculatedSubtotal = 0
    const calculatedItems = items.map((item) => {
      const qty = item.hours || item.quantity || 1
      const rate = item.rate || 0
      const total = Number((qty * rate).toFixed(2))
      calculatedSubtotal += total
      return {
        description: item.description,
        quantity: qty,
        rate,
        amount: total,
      }
    })

    // Sequential invoice numbering
    const currentCount = await prisma.invoice.count({ where: { workspaceId } })
    const year = new Date().getFullYear()
    const invoiceNumber = `INV-${year}-${String(currentCount + 1).padStart(3, "0")}`

    const invoice = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.create({
        data: {
          workspaceId,
          clientId: client.id,
          projectId: verifiedProjectId,
          invoiceNumber,
          status: InvoiceStatus.PENDING,
          subtotal: calculatedSubtotal,
          tax: 0,
          amount: calculatedSubtotal,
          issueDate: new Date(),
          dueDate: new Date(dueDate),
          notes,
          items: {
            create: calculatedItems,
          },
        },
        include: {
          items: true,
          client: true,
          project: true,
        },
      })

      await tx.activityLog.create({
        data: {
          workspaceId,
          userId,
          userName,
          action: "issued invoice",
          target: `${invoiceNumber} ($${calculatedSubtotal.toLocaleString()})`,
          projectId: projectId ?? null,
          projectName: projectName ?? null,
          category: "invoice",
        },
      })

      return inv
    })

    return NextResponse.json(
      {
        invoice: {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          client: client.company,
          clientName: client.name,
          clientEmail: client.email,
          projectName,
          amount: Number(invoice.amount),
          issueDate: invoice.issueDate.toISOString().split("T")[0],
          dueDate: invoice.dueDate.toISOString().split("T")[0],
          status: "pending",
          items: invoice.items.map((it) => ({
            description: it.description,
            hours: Number(it.quantity),
            rate: Number(it.rate),
            total: Number(it.amount),
          })),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[CREATE_INVOICE_ERROR]", error)
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 })
  }
}

