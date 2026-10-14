import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkspaceRole } from "@/generated/prisma/enums"
import { z } from "zod"

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters").max(100),
  plan: z.string().default("Agency Pro Tier"),
})

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const members = await prisma.workspaceMember.findMany({
      where: { userId: session.user.id },
      include: {
        workspace: true,
      },
      orderBy: { joinedAt: "asc" },
    })

    const workspaces = members.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      plan: m.workspace.plan,
      role: m.role,
    }))

    return NextResponse.json({ workspaces })
  } catch (error) {
    console.error("[GET_WORKSPACES_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch workspaces." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createWorkspaceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const slug = `${parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`

    const workspace = await prisma.workspace.create({
      data: {
        name: parsed.data.name,
        slug,
        plan: parsed.data.plan,
        members: {
          create: {
            userId: session.user.id,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    })

    return NextResponse.json(
      {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          plan: workspace.plan,
          role: "OWNER",
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[CREATE_WORKSPACE_ERROR]", error)
    return NextResponse.json({ error: "Failed to create workspace." }, { status: 500 })
  }
}

