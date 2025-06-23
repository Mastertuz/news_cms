import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ isFavorite: false })
    }

    const { searchParams } = new URL(req.url)
    const newsId = searchParams.get("newsId")

    if (!newsId) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 })
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error("Error checking favorite status:", error)
    return NextResponse.json({ isFavorite: false })
  }
}
