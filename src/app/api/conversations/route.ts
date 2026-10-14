import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""

  const whereClause: Record<string, unknown> = {
    workspaceId,
  }

  if (search) {
    whereClause.OR = [
      { client: { name: { contains: search, mode: "insensitive" } } },
      { client: { company: { contains: search, mode: "insensitive" } } },
      { project: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: whereClause,
      include: {
        client: { select: { id: true, name: true, company: true, email: true, avatar: true } },
        project: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    const formatted = conversations.map((conv) => {
      const unreadCount = conv.messages.filter(
        (m) => !m.read && m.senderType === "CLIENT"
      ).length

      return {
        id: conv.id,
        clientId: conv.client.id,
        clientName: conv.client.name,
        company: conv.client.company,
        email: conv.client.email,
        avatar: conv.client.avatar || "",
        unreadCount,
        lastMessage: conv.lastMessage || "No messages yet",
        lastTimestamp: conv.lastMessageAt
          ? conv.lastMessageAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "Just now",
        projectName: conv.project?.name || "Client Portal",
        messages: conv.messages.map((m) => ({
          id: m.id,
          sender: m.senderType === "AGENCY" ? "user" : "client",
          senderName: m.senderName,
          text: m.text,
          timestamp: m.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          time: m.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        })),
      }
    })

    return NextResponse.json({ conversations: formatted })
  } catch (error) {
    console.error("[GET_CONVERSATIONS_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch conversations." }, { status: 500 })
  }
}

