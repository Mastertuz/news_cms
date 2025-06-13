import { getUserFavorites } from "@/actions/favorites.actions"
import { NewsCard } from "@/components/shared/news-card"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { BookmarkX } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
export const metadata = {
  title: "Избранные новости",
  description: "Ваши сохраненные новости",
}

export default async function FavoritesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const favorites = await getUserFavorites()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Избранные новости</h1>
        <p className="text-muted-foreground">Ваши сохраненные новости ({favorites.length})</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <BookmarkX className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">У вас пока нет избранных новостей</h2>
          <p className="text-muted-foreground mb-6">
            Добавляйте интересные новости в избранное, чтобы вернуться к ним позже
          </p>
          <Button asChild>
            <Link href="/">Перейти к новостям</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((news) => (
            <NewsCard key={news.id} newsItem={news} />
          ))}
        </div>
      )}
    </div>
  )
}
