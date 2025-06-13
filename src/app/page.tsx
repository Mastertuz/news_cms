import { getFilteredNews } from "@/actions/news.actions"
import { NewsFilterServer } from "@/components/shared/news-filter-server"
import Newsgrid from "@/components/shared/news-grid"
import { Suspense } from "react"
import { Spinner } from "@/components/shared/spinner"
import { getCurrentUser } from "@/lib/auth"
import AddNewsDialog from "@/components/shared/add-news-form"

interface HomeProps {
  searchParams: Promise<{
    categories?: string
    authors?: string
  }>
}

function NewsGridLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">Загрузка новостей...</p>
      </div>
    </div>
  )
}

async function NewsContent({
  categories,
  authors,
  isAdmin,
}: {
  categories?: string[]
  authors?: string[]
  isAdmin: boolean
}) {
  const news = await getFilteredNews({
    categories,
    authors,
  })

  return <Newsgrid news={news} isAdmin={isAdmin} />
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const categories = params.categories?.split(",").filter(Boolean)
  const authors = params.authors?.split(",").filter(Boolean)

  // Проверка роли пользователя на уровне страницы
  const user = await getCurrentUser()
  const isAdmin = user?.role === "user"

  return (
    <main className="container mx-auto py-6 px-4">
      <NewsFilterServer searchParams={params} />
      <Suspense fallback={<NewsGridLoading />}>
        <NewsContent categories={categories} authors={authors} isAdmin={isAdmin} />
      </Suspense>
    </main>
  )
}
