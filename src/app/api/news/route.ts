import { type NextRequest, NextResponse } from "next/server"
import { createNewsItem, deleteNewsItem, getFilteredNews } from "@/actions/news.actions"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Получаем параметры фильтрации из URL
    const categories = searchParams.get("categories")?.split(",").filter(Boolean)
    const authors = searchParams.get("authors")?.split(",").filter(Boolean)
    const keyword = searchParams.get("keyword") || undefined

    // Используем новую функцию фильтрации
    const news = await getFilteredNews({
      categories,
      authors,
      keyword,
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newProduct = await createNewsItem(body)
    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error creating news item:", error)
    return NextResponse.json({ error: "Failed to create news item" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await deleteNewsItem(id)
    return NextResponse.json({ message: "News item deleted" })
  } catch (err) {
    console.error("Error deleting news item:", err)
    return NextResponse.json({ error: "Failed to delete news item" }, { status: 500 })
  }
}
