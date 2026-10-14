import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const typeParam = searchParams.get("type")

  const whereClause: Record<string, unknown> = {
    workspaceId,
  }

  if (typeParam && typeParam !== "all") {
    whereClause.category = typeParam.toLowerCase()
  }

  if (search) {
    whereClause.OR = [
      { userName: { contains: search, mode: "insensitive" } },
      { action: { contains: search, mode: "insensitive" } },
      { target: { contains: search, mode: "insensitive" } },
      { projectName: { contains: search, mode: "insensitive" } },
    ]
  }

  try {
    const activities = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    const formatted = activities.map((act) => ({
      id: act.id,
      user: act.userName,
      userName: act.userName,
      avatar: act.userAvatar || "",
      action: act.action,
      target: act.target,
      project: act.projectName || "General Workspace",
      projectName: act.projectName || "General Workspace",
      timestamp: act.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      time: act.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: act.category,
      category: act.category,
      createdAt: act.createdAt.toISOString(),
    }))

    return NextResponse.json({ activities: formatted })
  } catch (error) {
    console.error("[GET_ACTIVITY_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch activity logs." }, { status: 500 })
  }
}

