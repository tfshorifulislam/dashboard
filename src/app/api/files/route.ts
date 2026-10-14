import { NextRequest, NextResponse } from "next/server"
import { authenticateWorkspace } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/zip",
  "application/x-zip-compressed",
  "application/json",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function detectCategory(mimeType: string, filename: string): string {
  const lower = filename.toLowerCase()
  if (lower.endsWith(".fig") || lower.endsWith(".psd") || lower.endsWith(".ai") || mimeType.startsWith("image/")) {
    return "design"
  }
  if (lower.endsWith(".zip") || lower.endsWith(".tar") || lower.endsWith(".gz")) {
    return "archive"
  }
  if (lower.endsWith(".ts") || lower.endsWith(".tsx") || lower.endsWith(".js") || lower.endsWith(".html") || lower.endsWith(".css")) {
    return "code"
  }
  return "document"
}

export async function GET(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId } = auth.ctx
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category")

  const whereClause: Record<string, unknown> = {
    workspaceId,
  }

  if (categoryParam && categoryParam !== "all") {
    whereClause.category = categoryParam.toLowerCase()
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { project: { name: { contains: search, mode: "insensitive" } } },
      { uploader: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  try {
    const files = await prisma.fileMetadata.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
        uploader: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = files.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
      size: formatFileSize(f.size),
      project: f.project?.name || "General Workspace",
      projectName: f.project?.name || "General Workspace",
      uploader: f.uploader?.name || "Agency Team",
      clientName: f.uploader?.name || "Agency Team",
      uploadedAt: f.createdAt.toISOString().split("T")[0],
      version: f.version,
      url: f.url || undefined,
    }))

    return NextResponse.json({ files: formatted })
  } catch (error) {
    console.error("[GET_FILES_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch files." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const auth = await authenticateWorkspace()
  if (!auth.success) return auth.response

  const { workspaceId, userName, userId } = auth.ctx

  try {
    const contentType = req.headers.get("content-type") || ""

    let filename = ""
    let size = 0
    let mimeType = "application/octet-stream"
    let category = "document"
    let projectId: string | null = null

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file") as File | null
      const projId = formData.get("projectId") as string | null

      if (!file) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 })
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds maximum allowed limit (${formatFileSize(MAX_FILE_SIZE)}).` },
          { status: 400 }
        )
      }

      filename = file.name
      size = file.size
      mimeType = file.type || "application/octet-stream"
      category = detectCategory(mimeType, filename)
      projectId = projId
    } else {
      // JSON body registration
      const body = await req.json()
      filename = body.name || "Untitled_Asset"
      size = typeof body.size === "number" ? body.size : 1024 * 1024
      mimeType = body.mimeType || "application/octet-stream"
      category = body.category || detectCategory(mimeType, filename)
      projectId = body.projectId || null
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType) && !mimeType.startsWith("image/")) {
      return NextResponse.json(
        { error: `File type ${mimeType} is not permitted.` },
        { status: 400 }
      )
    }

    // Verify project if provided
    let projectName = "General Deliverable"
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: { id: projectId, workspaceId },
      })
      if (project) {
        projectName = project.name
      } else {
        projectId = null
      }
    }

    // Generate secure storage key
    const storageKey = `workspaces/${workspaceId}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    const record = await prisma.$transaction(async (tx) => {
      const f = await tx.fileMetadata.create({
        data: {
          workspaceId,
          projectId,
          uploaderId: userId,
          name: filename,
          size,
          mimeType,
          category,
          storageKey,
          version: "v1.0",
        },
      })

      await tx.activityLog.create({
        data: {
          workspaceId,
          userId,
          userName,
          action: "uploaded file",
          target: filename,
          project: projectName,
          category: "file",
        },
      })

      return f
    })

    return NextResponse.json(
      {
        file: {
          id: record.id,
          name: record.name,
          category: record.category,
          size: formatFileSize(record.size),
          project: projectName,
          projectName,
          uploader: userName,
          clientName: userName,
          uploadedAt: "Just now",
          version: record.version,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[UPLOAD_FILE_ERROR]", error)
    return NextResponse.json({ error: "Failed to upload file asset." }, { status: 500 })
  }
}

