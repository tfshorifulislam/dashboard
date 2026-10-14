import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { updateInvoiceStatusSchema } from "@/lib/validations"
import { InvoiceStatus } from "@/generated/prisma/enums"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { id } = await params

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, workspaceId },
      include: {
        client: true,
        project: true,
        items: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 })
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("[GET_INVOICE_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch invoice." }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx
  const { id } = await params

  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id, workspaceId },
      include: { client: true },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateInvoiceStatusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid invoice status", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const newStatus = parsed.data.status.toUpperCase() as InvoiceStatus
    const paidAt = newStatus === InvoiceStatus.PAID ? new Date() : null

    const updated = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.update({
        where: { id },
        data: {
          status: newStatus,
          paidAt,
        },
      })

      if (newStatus === InvoiceStatus.PAID) {
        await tx.activityLog.create({
          data: {
            workspaceId,
            userId,
            userName,
            action: "marked paid",
            target: `${invoice.invoiceNumber} ($${Number(invoice.amount).toLocaleString()})`,
            category: "invoice",
          },
        })
      }

      return inv
    })

    return NextResponse.json({
      invoice: {
        id: updated.id,
        status: updated.status.toLowerCase(),
        paidAt: updated.paidAt,
      },
    })
  } catch (error) {
    console.error("[UPDATE_INVOICE_ERROR]", error)
    return NextResponse.json({ error: "Failed to update invoice status." }, { status: 500 })
  }
}

