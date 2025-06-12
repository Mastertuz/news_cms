import { Suspense } from "react"
import { NewsFilterServer } from "@/components/shared/news-filter-server"
import NewsGrid from "@/components/shared/news-grid"
import { NewsItem } from "../../../../types"
import { getNewsByTitle } from "@/actions/news.actions"
import { Spinner } from "@/components/shared/spinner"
interface SearchPageProps {
  params: {
    query: string
  }
  searchParams: {
    categories?: string
    authors?: string
  }
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

function SearchResultsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Поиск новостей...</p>
      </div>
    </div>
  )
}

async function SearchResults({ params, searchParams }: SearchPageProps) {
  const { query } = params
  const { categories, authors } = searchParams

  const categoryList = categories?.split(",").filter(Boolean)
  const authorList = authors?.split(",").filter(Boolean)

  const news = await getFilteredNews(query, categoryList, authorList)
  const decodedQuery = decodeURIComponent(query)

  return <NewsGrid news={news} query={decodedQuery} variant="search" />
}

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const decodedQuery = decodeURIComponent(params.query)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Поиск новостей</h1>
        <p className="text-muted-foreground">Найдите интересующие вас новости по ключевым словам</p>
      </div>

      <NewsFilterServer currentQuery={decodedQuery} searchParams={searchParams} />

      <Suspense fallback={<SearchResultsLoading />}>
        <SearchResults params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { query: string } }) {
  const decodedQuery = decodeURIComponent(params.query)

  return {
    title: `Поиск: ${decodedQuery} | Новости`,
    description: `Результаты поиска новостей по запросу "${decodedQuery}"`,
  }
}
