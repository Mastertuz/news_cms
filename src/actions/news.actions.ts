"use server"

import { revalidatePath } from "next/cache"
import type { NewsCreateInput } from "../../types"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export const createNewsItem = async (newsItemData: NewsCreateInput) => {
  try {
    const newsItem = await prisma.news.create({
      data: {
        title: newsItemData.title,
        summary: newsItemData.summary,
        imageUrl: newsItemData.imageUrl,
        author: newsItemData.author,
        sourceUrl: newsItemData.sourceUrl,
        source: newsItemData.source,
        category: newsItemData.category,
      },
    })
    revalidatePath("/")
    return newsItem
  } catch (error) {
    console.error("Error creating news item:", error)
    throw new Error("Failed to create news item")
  }
}

export const getNewsItemById = async (id: string) => {
  return await prisma.news.findUnique({ where: { id } })
}

export const getNewsByTitle = async (query: string) => {
  const news = await prisma.news.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return news
}

export const getNewsByCategory = async (category: string) => {
  const news = await prisma.news.findMany({
    where: {
      category: {
        equals: category,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return news
}

export const getNewsByCategoryAndKeyword = async (category: string, keyword: string) => {
  const news = await prisma.news.findMany({
    where: {
      AND: [
        {
          category: {
            equals: category,
            mode: "insensitive",
          },
        },
        {
          OR: [
            {
              title: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  })
  return news
}

export const getFilteredNews = async (filters: {
  categories?: string[]
  authors?: string[]
  keyword?: string
}) => {
  const { categories, authors, keyword } = filters

  const andConditions: Prisma.NewsWhereInput[] = []

  if (categories && categories.length > 0) {
    andConditions.push({
      category: {
        in: categories,
        mode: "insensitive",
      },
    })
  }

  if (authors && authors.length > 0) {
    andConditions.push({
      author: {
        in: authors,
        mode: "insensitive",
      },
    })
  }

  if (keyword) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    })
  }

  const news = await prisma.news.findMany({
    where: andConditions.length > 0 ? { AND: andConditions } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      summary: true,
      imageUrl: true,
      publishedAt: true,
      author: true,
      sourceUrl: true,
      source: true,
      category: true,
    },
  })

  return news
}

export const getAllNews = async () => {
  return await prisma.news.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      summary: true,
      imageUrl: true,
      publishedAt: true,
      author: true,
      sourceUrl: true,
      source: true,
      category: true,
    },
  })
}

export const getAllCategories = async () => {
  const categories = await prisma.news.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  })

  return categories.map((item) => item.category).filter(Boolean)
}
export const getAllAuthors = async () => {
  const authors = await prisma.news.findMany({
    select: {
      author: true,
    },
    distinct: ["author"],
  })

  return authors.map((item) => item.author).filter(Boolean)
}

export const updateNewsItem = async (id: string, data: NewsCreateInput) => {
  try {
    const updated = await prisma.news.update({
      where: { id },
      data,
    })

    revalidatePath("/")
    return updated
  } catch (err) {
    console.error("Error updating news item:", err)
    throw new Error("Failed to update news item")
  }
}

export const deleteNewsItem = async (id: string) => {
  return await prisma.news.delete({ where: { id } })
}
