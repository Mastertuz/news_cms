"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

const categories = [
  { id: "politics", label: "Политика" },
  { id: "technology", label: "Технологии" },
  { id: "science", label: "Наука" },
  { id: "health", label: "Здоровье" },
  { id: "sports", label: "Спорт" },
  { id: "culture", label: "Культура" },
]

const authors = [
  { id: "author1", name: "Алексей Петров" },
  { id: "author2", name: "Мария Иванова" },
  { id: "author3", name: "Дмитрий Соколов" },
  { id: "author4", name: "Елена Смирнова" },
  { id: "author5", name: "Игорь Козлов" },
]

const filterFormSchema = z.object({
  search: z
    .string()
    .trim()
    .min(3, { message: "Поисковый запрос должен содержать минимум 3 символа" })
    .max(50, { message: "Поисковый запрос не должен превышать 50 символов" })
    .optional()
    .or(z.literal("")),
  categories: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
})

type FilterFormValues = z.infer<typeof filterFormSchema>

export function NewsFilter() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[]
    authors: string[]
  }>({
    categories: [],
    authors: [],
  })

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      search: "",
      categories: [],
      authors: [],
    },
  })

  function onSubmit(data: FilterFormValues) {
    console.log("Применены фильтры:", data)
    setActiveFilters({
      categories: data.categories || [],
      authors: data.authors || [],
    })
  }

  function removeFilter(type: "categories" | "authors", id: string) {
    const currentValues = form.getValues()[type] || []
    const newValues = currentValues.filter((item) => item !== id)
    form.setValue(type, newValues)
    setActiveFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== id),
    }))
    form.handleSubmit(onSubmit)()
  }

  function getFilterLabel(type: "categories" | "authors", id: string) {
    if (type === "categories") {
      return categories.find((cat) => cat.id === id)?.label || id
    } else {
      return authors.find((author) => author.id === id)?.name || id
    }
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Поиск новостей..."
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Применить</Button>
              </div>
            </div>

            {(activeFilters.categories.length > 0 ||
              activeFilters.authors.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.categories.map((id) => (
                  <Badge key={`cat-${id}`} variant="secondary">
                    {getFilterLabel("categories", id)}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => removeFilter("categories", id)}
                    />
                  </Badge>
                ))}
                {activeFilters.authors.map((id) => (
                  <Badge key={`auth-${id}`} variant="secondary">
                    {getFilterLabel("authors", id)}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => removeFilter("authors", id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild className="md:hidden">
                <Button variant="outline" type="button" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Фильтры
                  {isFiltersOpen ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 mt-4 md:mt-0">
                <div className="hidden md:block">
                  <h3 className="text-lg font-medium mb-4">Фильтры</h3>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Категории</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  return checked
                                    ? field.onChange([...current, category.id])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== category.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <div className="text-sm font-normal">
                              {category.label}
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Авторы</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {authors.map((author) => (
                      <FormField
                        key={author.id}
                        control={form.control}
                        name="authors"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(author.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  return checked
                                    ? field.onChange([...current, author.id])
                                    : field.onChange(
                                        current.filter(
                                          (value) => value !== author.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <div className="text-sm font-normal">
                              {author.name}
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
