"use client"

import React from "react"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addToFavorites, removeFromFavorites } from "@/actions/favorites.actions"

interface FavoriteButtonProps {
  newsId: string
  initialIsFavorite: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onStatusChange?: (isFavorite: boolean) => void
}

export function FavoriteButton({
  newsId,
  initialIsFavorite,
  variant = "outline",
  size = "icon",
  className,
  onStatusChange,
}: FavoriteButtonProps) {
  // Используем обычное состояние без useTransition
  const [isFavorite, setIsFavorite] = React.useState(initialIsFavorite)
  const [isPending, setIsPending] = React.useState(false)

  // Обновляем состояние, когда меняется initialIsFavorite
  React.useEffect(() => {
    setIsFavorite(initialIsFavorite)
  }, [initialIsFavorite])

  async function toggleFavorite() {
    if (isPending) return

    // Устанавливаем состояние загрузки
    setIsPending(true)

    // Оптимистично обновляем UI
    const newStatus = !isFavorite
    setIsFavorite(newStatus)
    if (onStatusChange) onStatusChange(newStatus)

    try {
      if (isFavorite) {
        await removeFromFavorites(newsId)
        toast.success("Удалено из избранного", {
          description: "Новость удалена из вашего списка избранного",
        })
      } else {
        await addToFavorites(newsId)
        toast.success("Добавлено в избранное", {
          description: "Новость добавлена в ваш список избранного",
        })
      }
    } catch (error) {
      // Возвращаем предыдущее состояние в случае ошибки
      setIsFavorite(!newStatus)
      if (onStatusChange) onStatusChange(!newStatus)

      console.error("Ошибка при изменении статуса избранного:", error)
      toast.error("Ошибка", {
        description: "Не удалось изменить статус избранного",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleFavorite}
      disabled={isPending}
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      title={isFavorite ? "Удалить из избранного" : "Добавить в избранного"}
    >
      {isFavorite ? (
        <BookmarkCheck className="h-[1.2rem] w-[1.2rem] text-primary" />
      ) : (
        <Bookmark className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}
