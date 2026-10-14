import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { sendMessageSchema } from "@/lib/validations"
import { SenderType } from "@/generated/prisma/enums"

export async function GET(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get("conversationId")

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId query param is required." }, { status: 400 })
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 })
    }

    const messages = conversation.messages.map((m) => ({
      id: m.id,
      sender: m.senderType === "AGENCY" ? "user" : "client",
      senderName: m.senderName,
      text: m.text,
      timestamp: m.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      time: m.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const body = await req.json()
    const parsed = sendMessageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { conversationId, text } = parsed.data

    // Verify conversation belongs to workspace
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, workspaceId },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found in this workspace." },
        { status: 404 }
      )
    }

    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: userId,
          senderName: userName,
          senderType: SenderType.AGENCY,
          text,
          read: true,
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: text,
          lastMessageAt: new Date(),
        },
      }),
    ])

    return NextResponse.json(
      {
        message: {
          id: message.id,
          sender: "user",
          senderName: message.senderName,
          text: message.text,
          timestamp: message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          time: message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[SEND_MESSAGE_ERROR]", error)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}

