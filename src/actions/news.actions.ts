'use server'

import { revalidatePath } from "next/cache"
import { NewsCreateInput } from "../../types"
import { prisma } from "@/lib/prisma"

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

      }
    })
    revalidatePath('/')
    return newsItem
  } catch (error) {
    console.error("Error creating news item:", error)
    throw new Error("Failed to create news item")
  }
}


export const getNewsItemById = async (id: string) => {
  return await prisma.news.findUnique({ where: { id } });
};

export const getNewsByTitle = async (query: string) => {

  const news = await prisma.news.findMany({
    where: {
      title: {
        contains: query,
        mode: 'insensitive'
      }
    }
  })
  return news
}

export const getAllNews = async () => {
  return await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
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
  });
};

export const updateNewsItem = async (id: string, data: NewsCreateInput) => {
  try {
    const updated = await prisma.news.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    return updated;
  } catch (err) {
    console.error('Error updating news item:', err);
    throw new Error('Failed to update news item');
  }
};

export const deleteNewsItem = async (id: string) => {
  return await prisma.news.delete({ where: { id } });
};