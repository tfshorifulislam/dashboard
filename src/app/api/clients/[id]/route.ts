import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { updateClientSchema } from "@/lib/validations"
import { ClientStatus } from "@/generated/prisma/enums"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { id } = await params

  try {
    const client = await prisma.client.findFirst({
      where: { id, workspaceId },
      include: {
        projects: {
          select: { id: true, name: true, status: true, budget: true, progress: true },
        },
        invoices: {
          select: { id: true, invoiceNumber: true, amount: true, status: true, dueDate: true },
        },
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 })
    }

    return NextResponse.json({ client })
  } catch (error) {
    console.error("[GET_CLIENT_BY_ID_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch client details." }, { status: 500 })
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
    const client = await prisma.client.findFirst({
      where: { id, workspaceId },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateClientSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const dataToUpdate: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.status) {
      dataToUpdate.status = parsed.data.status.toUpperCase() as ClientStatus
    }

    const updated = await prisma.client.update({
      where: { id },
      data: dataToUpdate,
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "updated client details",
        target: `${updated.name} (${updated.company})`,
        category: "client",
      },
    })

    return NextResponse.json({ client: updated })
  } catch (error) {
    console.error("[UPDATE_CLIENT_ERROR]", error)
    return NextResponse.json({ error: "Failed to update client." }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx
  const { id } = await params

  try {
    const client = await prisma.client.findFirst({
      where: { id, workspaceId },
      include: {
        projects: { select: { id: true } },
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found." }, { status: 404 })
    }

    if (client.projects.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete client with active project workspaces. Archive the client or reassign projects first." },
        { status: 400 }
      )
    }

    await prisma.client.delete({
      where: { id },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "deleted client record",
        target: `${client.name} (${client.company})`,
        category: "client",
      },
    })

    return NextResponse.json({ success: true, message: "Client deleted successfully." })
  } catch (error) {
    console.error("[DELETE_CLIENT_ERROR]", error)
    return NextResponse.json({ error: "Failed to delete client." }, { status: 500 })
  }
}

