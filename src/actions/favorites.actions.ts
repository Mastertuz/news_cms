"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function addToFavorites(newsId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Пользователь не авторизован")
    }

    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      throw new Error("Новость не найдена")
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
      return { success: true, message: "Новость уже в избранном" }
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        newsId,
      },
      include: {
        news: true,
      },
    })

    revalidatePath("/favorites")
    revalidatePath("/")

    return { success: true, favorite }
  } catch (error) {
    console.error("Ошибка при добавлении в избранное:", error)
    throw new Error("Не удалось добавить новость в избранное")
  }
}

export async function removeFromFavorites(newsId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Пользователь не авторизован")
    }

    await prisma.favorite.delete({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    revalidatePath("/favorites")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error)
    throw new Error("Не удалось удалить новость из избранного")
  }
}

export async function isNewsFavorite(newsId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return false
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    return !!favorite
  } catch (error) {
    console.error("Ошибка при проверке избранного:", error)
    return false
  }
}

export async function getUserFavorites() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
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

    return favorites.map((favorite) => favorite.news)
  } catch (error) {
    console.error("Ошибка при получении избранных новостей:", error)
    return []
  }
}

export async function getFavoritesCount() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return 0
    }

    const count = await prisma.favorite.count({
      where: {
        userId: user.id,
      },
    })

    return count
  } catch (error) {
    console.error("Ошибка при получении количества избранных:", error)
    return 0
  }
}
