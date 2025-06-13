"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Добавить новость в избранное
export async function addToFavorites(newsId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Пользователь не авторизован")
    }

    // Проверяем, существует ли новость
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      throw new Error("Новость не найдена")
    }

    // Проверяем, есть ли уже эта новость в избранном
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_newsId: {
          userId: user.id,
          newsId,
        },
      },
    })

    // Если уже в избранном, возвращаем существующую запись
    if (existingFavorite) {
      return { success: true, message: "Новость уже в избранном" }
    }

    // Добавляем в избранное
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

// Удалить новость из избранного
export async function removeFromFavorites(newsId: string) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Пользователь не авторизован")
    }

    // Удаляем из избранного
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

// Проверить, находится ли новость в избранном
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

// Получить все избранные новости пользователя
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

// Получить количество избранных новостей пользователя
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
