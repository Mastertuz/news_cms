"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { UploadDropzone } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { updateNewsItem } from "@/actions/news.actions"
import type { NewsItem } from "../../../types"
import { X, Edit } from "lucide-react"

const newsItemSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  summary: z.string().min(1, "Краткое описание обязательно"),
  source: z.string().min(1, "Источник обязателен"),
  sourceUrl: z.string().url("Некорректный URL источника"),
  category: z.string().min(1, "Категория обязательна"),
  author: z.string().min(1, "Автор обязателен"),
})

type NewsItemFormData = z.infer<typeof newsItemSchema>

interface EditNewsItemDialogProps {
  newsItem: NewsItem
  trigger?: React.ReactNode
}

export function EditNewsDialog({ newsItem, trigger }: EditNewsItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(newsItem.imageUrl || "")

  const categories = [
    "Технологии",
    "Медицина",
    "Экология",
    "Спорт",
    "Политика",
    "Экономика",
    "Культура",
    "Наука",
    "Происшествия",
  ]

  const form = useForm<NewsItemFormData>({
    resolver: zodResolver(newsItemSchema),
    defaultValues: {
      title: newsItem.title,
      summary: newsItem.summary,
      source: newsItem.source || "",
      sourceUrl: newsItem.sourceUrl || "",
      category: newsItem.category,
      author: newsItem.author,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: newsItem.title,
        summary: newsItem.summary,
        source: newsItem.source || "",
        sourceUrl: newsItem.sourceUrl || "",
        category: newsItem.category,
        author: newsItem.author,
      })
      setImageUrl(newsItem.imageUrl || "")
    }
  }, [open, newsItem, form])

  const onSubmit = async (data: NewsItemFormData) => {
    if (!imageUrl) {
      form.setError("root", {
        message: "Пожалуйста, загрузите изображение новости",
      })
      return
    }

    try {
      await updateNewsItem(newsItem.id, { ...data, imageUrl })
      setOpen(false) 
      form.reset()
    } catch (err) {
      console.error("Ошибка при обновлении новости:", err)
      form.setError("root", {
        message: "Произошла ошибка при обновлении новости",
      })
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.clearErrors()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать новость</DialogTitle>
          <DialogDescription>Измените необходимые поля и нажмите Сохранить.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок </FormLabel>
                  <FormControl>
                    <Input placeholder="Введите заголовок новости" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Добавьте текст к новости" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Автор </FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя автора" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Источник</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите источник" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL источника </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/article" type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Изображение новости </FormLabel>
              {imageUrl ? (
                <div className="relative mt-2">
                  <img src={imageUrl || "/placeholder.svg"} alt="Uploaded" className="h-40 rounded-md object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 border rounded-md overflow-hidden" style={{ maxHeight: "150px" }}>
                  <UploadDropzone<OurFileRouter, "postImage">
                    endpoint="postImage"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]?.ufsUrl) {
                        setImageUrl(res[0].ufsUrl)
                      }
                    }}
                    onUploadError={(error: Error) => {
                      console.error(`Ошибка загрузки: ${error.message}`)
                      form.setError("root", {
                        message: `Ошибка загрузки: ${error.message}`,
                      })
                    }}
                    className="ut-upload-dropzone:min-h-0 ut-upload-dropzone:h-[120px] ut-label:text-sm ut-button:py-1 ut-button:text-sm"
                  />
                </div>
              )}
            </div>

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
