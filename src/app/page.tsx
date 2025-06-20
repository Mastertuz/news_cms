import { getFilteredNews } from "@/actions/news.actions"
import { NewsFilterServer } from "@/components/shared/news-filter-server"
import Newsgrid from "@/components/shared/news-grid"
import { getCurrentUser } from "@/lib/auth"
import { getUserFavorites } from "@/actions/favorites.actions"
import { redirect } from "next/navigation"

interface HomeProps {
  searchParams: Promise<{
    categories?: string
    authors?: string
  }>
}

async function NewsContent({
  categories,
  authors,
  isAdmin,
  userId,
}: {
  categories?: string[]
  authors?: string[]
  isAdmin: boolean
  userId?: string
}) {
  const news = await getFilteredNews({
    categories,
    authors,
  })

  let favoriteIds: string[] = []
  if (userId) {
    const favorites = await getUserFavorites()
    favoriteIds = favorites.map((n) => n.id)
  }

  return <Newsgrid news={news} isAdmin={isAdmin} favoriteIds={favoriteIds} />
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const categories = params.categories?.split(",").filter(Boolean)
  const authors = params.authors?.split(",").filter(Boolean)
  const user = await getCurrentUser()
  const isAdmin = user?.role === "admin"
  const userId = user?.id
  if (!user) redirect("/sign-in") 
  return (
    <main className="container mx-auto py-6 px-4">
      <NewsFilterServer searchParams={params} />
      <NewsContent categories={categories} authors={authors} isAdmin={isAdmin} userId={userId} />
    </main>
  )
}