import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { updateProjectSchema } from "@/lib/validations"
import { ProjectStatus } from "@/generated/prisma/enums"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { id } = await params

  try {
    const project = await prisma.project.findFirst({
      where: { id, workspaceId },
      include: {
        client: true,
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        approvals: true,
        files: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("[GET_PROJECT_BY_ID_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch project." }, { status: 500 })
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
    const project = await prisma.project.findFirst({
      where: { id, workspaceId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateProjectSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const dataToUpdate: Record<string, unknown> = {}
    if (parsed.data.name !== undefined) dataToUpdate.name = parsed.data.name
    if (parsed.data.category !== undefined) dataToUpdate.category = parsed.data.category
    if (parsed.data.description !== undefined) dataToUpdate.description = parsed.data.description
    if (parsed.data.budget !== undefined) dataToUpdate.budget = parsed.data.budget
    if (parsed.data.progress !== undefined) dataToUpdate.progress = parsed.data.progress
    if (parsed.data.status !== undefined) dataToUpdate.status = parsed.data.status as ProjectStatus
    if (parsed.data.dueDate !== undefined) {
      dataToUpdate.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    }

    const updated = await prisma.project.update({
      where: { id },
      data: dataToUpdate,
      include: { client: true },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "updated project",
        target: updated.name,
        project: updated.name,
        category: "project",
      },
    })

    return NextResponse.json({ project: updated })
  } catch (error) {
    console.error("[UPDATE_PROJECT_ERROR]", error)
    return NextResponse.json({ error: "Failed to update project." }, { status: 500 })
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
    const project = await prisma.project.findFirst({
      where: { id, workspaceId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id },
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "deleted project",
        target: project.name,
        category: "project",
      },
    })

    return NextResponse.json({ success: true, message: "Project deleted." })
  } catch (error) {
    console.error("[DELETE_PROJECT_ERROR]", error)
    return NextResponse.json({ error: "Failed to delete project." }, { status: 500 })
  }
}

