"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { UploadDropzone } from "@uploadthing/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createNewsItem } from "@/actions/news.actions"
import { PlusCircle, X } from "lucide-react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

const categories = ["Технологии", "Медицина", "Экология", "Спорт", "Политика", "Экономика", "Культура", "Наука",'Происшествия']

const newsSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  summary: z.string().min(1, "Краткое описание обязательно"),
  source: z.string().min(1, "Источник обязателен"),
  sourceUrl: z.string().min(1,"Некорректный URL источника"),
  category: z.string().min(1, "Категория обязательна"),
  author: z.string().min(1, "Автор обязателен"),
})

type NewsFormData = z.infer<typeof newsSchema>

export default function AddNewsDialog() {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      summary: "",
      source: "",
      sourceUrl: "",
      category: "",
      author: "",
    },
  })

  const onSubmit = async (data: NewsFormData) => {
    if (!imageUrl) {
      form.setError("root", {
        message: "Пожалуйста, загрузите изображение",
      })
      return
    }

    try {
      await createNewsItem({ ...data, imageUrl })
      form.reset()
      setImageUrl("")
      setOpen(false)
    } catch (err) {
      console.error("Ошибка при создании новости:", err)
      form.setError("root", {
        message: "Произошла ошибка при создании новости",
      })
    }
  }

  const resetForm = () => {
    form.reset()
    setImageUrl("")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          Добавить новость
          <PlusCircle className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавление новости</DialogTitle>
          <DialogDescription>Заполните информацию о новости и загрузите изображение.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
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
                  <FormLabel>Содержание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Добавьте текст к новости" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4 max-sm:flex max-sm:flex-col">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Автор *</FormLabel>
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
                  <FormItem >
                    <FormLabel>Категория *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem  key={category} value={category}>
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
                  <FormLabel>Источник *</FormLabel>
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
                  <FormLabel>URL источника *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/article" type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Изображение новости *</FormLabel>
              {imageUrl ? (
                <div className="relative mt-2">
                  <img src={imageUrl || "/placeholder.svg"} alt="Uploaded" className="h-40 rounded-md" />
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
                />
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
                {form.formState.isSubmitting ? "Добавление..." : "Добавить новость"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
