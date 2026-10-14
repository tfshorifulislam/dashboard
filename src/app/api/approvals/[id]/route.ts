import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { decideApprovalSchema } from "@/lib/validations"
import { ApprovalStatus } from "@/generated/prisma/enums"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { id } = await params

  try {
    const approval = await prisma.approval.findFirst({
      where: { id, workspaceId },
      include: {
        project: true,
        client: true,
        submittedBy: { select: { name: true, email: true } },
        decidedBy: { select: { name: true, email: true } },
      },
    })

    if (!approval) {
      return NextResponse.json({ error: "Approval not found." }, { status: 404 })
    }

    return NextResponse.json({ approval })
  } catch (error) {
    console.error("[GET_APPROVAL_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch approval." }, { status: 500 })
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
    const approval = await prisma.approval.findFirst({
      where: { id, workspaceId },
      include: { project: true, client: true },
    })

    if (!approval) {
      return NextResponse.json({ error: "Approval not found." }, { status: 404 })
    }

    const body = await req.json()
    const parsed = decideApprovalSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const newStatus = parsed.data.status.toUpperCase() as ApprovalStatus
    const feedback = parsed.data.feedback || (newStatus === ApprovalStatus.APPROVED ? "Approved by client" : "Revision requested")

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.approval.update({
        where: { id },
        data: {
          status: newStatus,
          feedback,
          decidedAt: new Date(),
          decidedById: userId,
        },
      })

      const actionText =
        newStatus === ApprovalStatus.APPROVED
          ? "approved deliverable"
          : "requested revisions on"

      await tx.activityLog.create({
        data: {
          workspaceId,
          userId,
          userName,
          action: actionText,
          target: `${approval.title} (${approval.version})`,
          project: approval.project.name,
          category: "approval",
        },
      })

      return app
    })

    return NextResponse.json({
      approval: {
        id: updated.id,
        status: updated.status.toLowerCase(),
        feedback: updated.feedback,
        decidedAt: updated.decidedAt,
      },
    })
  } catch (error) {
    console.error("[UPDATE_APPROVAL_ERROR]", error)
    return NextResponse.json({ error: "Failed to update approval." }, { status: 500 })
  }
}

