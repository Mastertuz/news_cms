import { getAllCategories, getAllAuthors } from "@/actions/news.actions"
import { NewsFilterClient } from "./news-filter-client"

interface NewsFilterServerProps {
  currentQuery?: string
  showSearch?: boolean
  searchParams?: {
    categories?: string
    authors?: string
  }
}

export async function NewsFilterServer({
  currentQuery = "",
  showSearch = true,
  searchParams = {},
}: NewsFilterServerProps) {
  // Загружаем данные на сервере
  const [categories, authors] = await Promise.all([getAllCategories(), getAllAuthors()])

  // Получаем текущие фильтры из URL
  const currentCategories = searchParams.categories?.split(",").filter(Boolean) || []
  const currentAuthors = searchParams.authors?.split(",").filter(Boolean) || []

  return (
    <NewsFilterClient
      categories={categories}
      authors={authors}
      currentQuery={currentQuery}
      showSearch={showSearch}
      currentCategories={currentCategories}
      currentAuthors={currentAuthors}
    />
  )
}
