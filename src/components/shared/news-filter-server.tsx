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

export async function NewsFilterServer({ currentQuery = "", searchParams = {} }: NewsFilterServerProps) {
  const [categories, authors] = await Promise.all([getAllCategories(), getAllAuthors()])

  const currentCategories = searchParams.categories?.split(",").filter(Boolean) || []
  const currentAuthors = searchParams.authors?.split(",").filter(Boolean) || []

  return (
    <NewsFilterClient
      categories={categories}
      authors={authors}
      currentQuery={currentQuery}
      currentCategories={currentCategories}
      currentAuthors={currentAuthors}
    />
  )
}
