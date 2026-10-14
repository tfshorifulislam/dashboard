import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WorkspaceRole } from "@/generated/prisma/enums"

export interface AuthContext {
  userId: string
  userEmail: string
  userName: string
  workspaceId: string
  role: WorkspaceRole
}

export type AuthResult =
  | { success: true; ctx: AuthContext }
  | { success: false; response: NextResponse }

/**
 * Validates Better Auth session and verifies membership in the active workspace.
 * Prevents cross-tenant data access, insecure direct object references (IDOR), and unauthenticated access.
 */
export async function authenticateWorkspace(
  requiredRoles?: WorkspaceRole[]
): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Unauthorized. Please sign in to access this resource." },
          { status: 401 }
        ),
      }
    }

    const userId = session.user.id
    const userEmail = session.user.email
    const userName = session.user.name || "User"

    // Check if client provided a specific workspace ID header (for switching workspaces)
    const reqHeaders = await headers()
    const requestedWorkspaceId = reqHeaders.get("x-workspace-id")

    let member = null

    if (requestedWorkspaceId) {
      member = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: requestedWorkspaceId,
            userId,
          },
        },
        include: {
          workspace: true,
        },
      })
    }

    // Default to the user's primary/first workspace if not explicitly set or not found
    if (!member) {
      member = await prisma.workspaceMember.findFirst({
        where: {
          userId,
        },
        include: {
          workspace: true,
        },
        orderBy: {
          joinedAt: "asc",
        },
      })
    }

    // If the user has no workspace yet, auto-provision their personal Agency Pro workspace
    if (!member) {
      const slug = `ws-${userId.slice(0, 8)}-${Date.now().toString(36)}`
      const newWs = await prisma.workspace.create({
        data: {
          name: `${userName}'s Agency`,
          slug,
          plan: "Agency Pro Tier",
          members: {
            create: {
              userId,
              role: WorkspaceRole.OWNER,
            },
          },
        },
        include: {
          members: true,
        },
      })

      return {
        success: true,
        ctx: {
          userId,
          userEmail,
          userName,
          workspaceId: newWs.id,
          role: WorkspaceRole.OWNER,
        },
      }
    }

    // Role-based access control check if specific roles are required
    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(member.role)) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Forbidden. Your role does not have permission to perform this action.",
            requiredRoles,
            currentRole: member.role,
          },
          { status: 403 }
        ),
      }
    }

    return {
      success: true,
      ctx: {
        userId,
        userEmail,
        userName,
        workspaceId: member.workspaceId,
        role: member.role,
      },
    }
  } catch (error: unknown) {
    const err = error as { digest?: string; name?: string }
    if (err?.digest === "HANGING_PROMISE_REJECTION" || err?.name === "DynamicServerError") {
      throw error
    }
    console.error("[AUTH_ERROR]", error)
    return {
      success: false,
      response: NextResponse.json(
        { error: "Authentication service error. Please check database connection." },
        { status: 500 }
      ),
    }
  }
}

