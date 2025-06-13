"use client"

import Image from "next/image"
import { Calendar, ExternalLink, User, Edit } from "lucide-react"
import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { isNewsFavorite } from "@/actions/favorites.actions"
import { FavoriteButton } from "./add-to-favorite-button"
import type { NewsItem } from "../../../types"
import { EditNewsDialog } from "./edit-news-form"
import { DeleteNewsButton } from "./remove-news-button"

interface NewsCardProps {
  newsItem: NewsItem
  isAdmin?: boolean
}

export function NewsCard({ newsItem, isAdmin = false }: NewsCardProps) {
  const { id, title, summary, imageUrl, publishedAt, author, category, source, sourceUrl } = newsItem
  const [favoriteStatus, setFavoriteStatus] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Проверяем статус избранного
  React.useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        setIsLoading(true)
        const status = await isNewsFavorite(id)
        setFavoriteStatus(status)
      } catch (error) {
        console.error("Ошибка при проверке статуса избранного:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkFavoriteStatus()
  }, [id])

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Дата не указана"

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) {
        return "Неверная дата"
      }

      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(dateObj)
    } catch (error) {
      console.error("Ошибка форматирования даты:", error)
      return "Ошибка даты"
    }
  }

  // Функция для обновления статуса избранного
  const updateFavoriteStatus = (newStatus: boolean) => {
    setFavoriteStatus(newStatus)
  }

  return (
    <Card className="hover:shadow-lg shadow-gray-500 transition-all duration-200 group p-0 flex flex-col">
      <div className="aspect-video overflow-hidden rounded-t-lg relative">
        <Image
          src={imageUrl || "/placeholder.svg?height=200&width=300"}
          alt={title || "Изображение новости"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          priority
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 leading-tight">{title || "Заголовок не указан"}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {category || "Без категории"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{source || "Источник не указан"}</span>
          {author && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {author}
              </span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="mb-4 line-clamp-3">{summary || "Описание не указано"}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(publishedAt)}
          </div>
          <div className="flex items-center gap-2">
            <FavoriteButton
              newsId={id}
              initialIsFavorite={favoriteStatus}
              variant="ghost"
              size="sm"
              onStatusChange={updateFavoriteStatus}
            />
            {sourceUrl ? (
              <Button variant="outline" size="sm" className="flex items-center gap-1 cursor-pointer" asChild>
                <Link href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  Читать
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                Читать
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Кнопки администратора на всю ширину внизу карточки */}
      {isAdmin && (
        <CardFooter className="flex flex-col gap-2 p-4 pt-0">
          <EditNewsDialog
            newsItem={newsItem}
            trigger={
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            }
          />
          <DeleteNewsButton
            newsId={id}
            newsTitle={title || "Без названия"}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            fullWidth
          />
        </CardFooter>
      )}
    </Card>
  )
}
