import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        news: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(favorites.map((favorite) => favorite.news))
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { newsId } = await req.json()

    if (!newsId) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 })
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json({ message: "Already in favorites" })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        newsId,
      },
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return NextResponse.json({ error: "Failed to add to favorites" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const newsId = searchParams.get("newsId")

    if (!newsId) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 })
    }

    await prisma.favorite.delete({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return NextResponse.json({ error: "Failed to remove from favorites" }, { status: 500 })
  }
}
