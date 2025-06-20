import { NewsFilterServer } from "@/components/shared/news-filter-server"
import NewsGrid from "@/components/shared/news-grid"
import { NewsItem } from "../../../../types"
import { getNewsByTitle } from "@/actions/news.actions"

interface SearchPageProps {
  params: Promise<{ query: string }>
  searchParams: Promise<{ categories?: string; authors?: string }>
}

async function getFilteredNews(query: string, categories?: string[], authors?: string[]): Promise<NewsItem[]> {
  const decodedQuery = decodeURIComponent(query)
  let news = await getNewsByTitle(decodedQuery)

  if (categories && categories.length > 0) {
    news = news.filter((item) => categories.includes(item.category))
  }

  if (authors && authors.length > 0) {
    news = news.filter((item) => authors.some((author) => item.author.toLowerCase().includes(author.toLowerCase())))
  }

  return news
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { query } = await params
  const { categories, authors } = await searchParams

  const categoryList = categories?.split(",").filter(Boolean)
  const authorList = authors?.split(",").filter(Boolean)

  const news = await getFilteredNews(query, categoryList, authorList)
  const decodedQuery = decodeURIComponent(query)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Поиск новостей</h1>
        <p className="text-muted-foreground">Найдите интересующие вас новости по ключевым словам</p>
      </div>

      <NewsFilterServer currentQuery={decodedQuery} searchParams={{ categories, authors }} />

      <NewsGrid news={news} query={decodedQuery} variant="search" />
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params
  const decodedQuery = decodeURIComponent(query)

  return {
    title: `Поиск: ${decodedQuery} | Новости`,
    description: `Результаты поиска новостей по запросу "${decodedQuery}"`,
  }
}
