import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { updateWorkspaceSchema } from "@/lib/validations"
import { WorkspaceRole } from "@/generated/prisma/enums"

export async function GET() {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userId } = auth.ctx

  try {
    const [workspace, user, members] = await Promise.all([
      prisma.workspace.findUnique({
        where: { id: workspaceId },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, image: true },
      }),
      prisma.workspaceMember.findMany({
        where: { workspaceId },
        include: {
          user: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { joinedAt: "asc" },
      }),
    ])

    if (!workspace || !user) {
      return NextResponse.json({ error: "Workspace or User not found." }, { status: 404 })
    }

    const team = members.map((m) => ({
      id: m.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role.charAt(0) + m.role.slice(1).toLowerCase(),
      avatar: m.user.image || "",
      status: "Active",
    }))

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        plan: workspace.plan,
        customDomain: workspace.customDomain || "",
        agencyEmail: workspace.agencyEmail || "",
        currency: workspace.currency,
      },
      user,
      team,
    })
  } catch (error) {
    console.error("[GET_SETTINGS_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await authenticateWorkspace([WorkspaceRole.OWNER, WorkspaceRole.ADMIN])
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const body = await req.json()
    const parsed = updateWorkspaceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: parsed.data,
    })

    await prisma.activityLog.create({
      data: {
        workspaceId,
        userId,
        userName,
        action: "updated workspace settings",
        target: updated.name,
        category: "workspace",
      },
    })

    return NextResponse.json({
      workspace: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        plan: updated.plan,
        customDomain: updated.customDomain || "",
        agencyEmail: updated.agencyEmail || "",
        currency: updated.currency,
      },
    })
  } catch (error) {
    console.error("[UPDATE_SETTINGS_ERROR]", error)
    return NextResponse.json({ error: "Failed to update workspace settings." }, { status: 500 })
  }
}

