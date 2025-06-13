import type { NewsItem } from "../../../types"
import AddNewsDialog from "./add-news-form"
import { NewsCard } from "./news-card"
import { cn } from "@/lib/utils"

interface NewsGridProps {
  news: NewsItem[]
  query?: string
  variant?: "home" | "search" | "compact"
  className?: string
  isAdmin?: boolean
}

function NewsGrid({ news, query, variant = "home", className, isAdmin = false }: NewsGridProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          {query ? `Новости по запросу "${query}" не найдены` : "Новости не найдены"}
        </div>
        <p className="text-sm text-muted-foreground">Попробуйте изменить поисковый запрос или фильтры</p>
      </div>
    )
  }

  // Определяем вариант отображения автоматически, если не передан
  const displayVariant = query ? "search" : variant

  // Разные сетки для разных вариантов
  const gridClasses = {
    home: "grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6",
    search: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
    compact: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4",
  }

  return (
    <div className="space-y-4">
      {/* Информация о результатах */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {query ? (
            <div className="space-y-1">
              <div>
                Результаты поиска по запросу: <span className="font-medium text-foreground">"{query}"</span>
              </div>
              <div>Найдено новостей: {news.length}</div>
            </div>
          ) : (
            <div>Всего новостей: {news.length}</div>
          )}
        </div>
      <AddNewsDialog/>

        {/* Дополнительная информация для страницы поиска */}
        {query && (
          <div className="text-xs text-muted-foreground">
            {displayVariant === "search" ? "Режим поиска" : "Обычный режим"}
          </div>
        )}
      </div>

      {/* Сетка новостей */}
      <div className={cn(gridClasses[displayVariant], className)}>
        {news.map((item) => (
          <NewsCard key={item.id} newsItem={item} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  )
}

export default NewsGrid
