import { getFilteredNews } from "@/actions/news.actions"
import { NewsFilterServer } from "@/components/shared/news-filter-server"
import Newsgrid from "@/components/shared/news-grid"
import { Suspense } from "react"
import { Spinner } from "@/components/shared/spinner"

interface HomeProps {
  searchParams: {
    categories?: string
    authors?: string
  }
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

async function NewsContent({ searchParams }: HomeProps) {
  const categories = searchParams.categories?.split(",").filter(Boolean)
  const authors = searchParams.authors?.split(",").filter(Boolean)

  const news = await getFilteredNews({
    categories,
    authors,
  })

  return <Newsgrid news={news} />
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <main className="container mx-auto py-6 px-4">
      <NewsFilterServer searchParams={searchParams} />
      <Suspense fallback={<NewsGridLoading />}>
        <NewsContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
