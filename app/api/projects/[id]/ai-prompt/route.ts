import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserById } from "@/lib/auth"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user || user.role !== "FACULTY") {
      return NextResponse.json({ error: "Access denied - Faculty only" }, { status: 403 })
    }

    const body = await request.json()
    const { ai_prompt_custom } = body

    // Verify project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.created_by !== userId) {
      return NextResponse.json({ 
        error: "Access denied - You can only modify your own projects" 
      }, { status: 403 })
    }

    // Update the project with custom AI prompt
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: { 
        ai_prompt_custom: ai_prompt_custom || null,
        modified_by: userId,
        modified_date: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: "AI prompt updated successfully",
      ai_prompt_custom: updatedProject.ai_prompt_custom
    })

  } catch (error) {
    console.error("Error updating AI prompt:", error)
    return NextResponse.json({ 
      error: "Failed to update AI prompt" 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    const user = await getUserById(userId)
    if (!user || user.role !== "FACULTY") {
      return NextResponse.json({ error: "Access denied - Faculty only" }, { status: 403 })
    }

    // Verify project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        description: true,
        created_by: true,
        ai_prompt_custom: true,
        expected_completion_date: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.created_by !== userId) {
      return NextResponse.json({ 
        error: "Access denied - You can only view your own projects" 
      }, { status: 403 })
    }

    // Generate default prompt
    const defaultPrompt = `
Project: ${project.name}

Description: ${project.description}

Requirements: Looking for candidates with relevant skills and experience for this project.

Expected completion: ${new Date(project.expected_completion_date).toLocaleDateString()}
    `.trim()

    return NextResponse.json({ 
      success: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description
      },
      ai_prompt_custom: project.ai_prompt_custom,
      default_prompt: defaultPrompt
    })

  } catch (error) {
    console.error("Error fetching AI prompt:", error)
    return NextResponse.json({ 
      error: "Failed to fetch AI prompt" 
    }, { status: 500 })
  }
}
