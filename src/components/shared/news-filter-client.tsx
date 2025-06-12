"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, Filter, Check, X } from "lucide-react"
import { useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

const searchFormSchema = z.object({
  input: z.string().optional(),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface NewsFilterClientProps {
  categories: string[]
  authors: string[]
  currentQuery: string
  showSearch: boolean
  currentCategories: string[]
  currentAuthors: string[]
}

export function NewsFilterClient({
  categories,
  authors,
  currentQuery,
  showSearch,
  currentCategories,
  currentAuthors,
}: NewsFilterClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Search form
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      input: currentQuery,
    },
  })

  const updateURL = useCallback(
    (categories: string[], authors: string[]) => {
      const newSearchParams = new URLSearchParams()

      // Сохраняем другие параметры, если они есть
      searchParams.forEach((value, key) => {
        if (key !== "categories" && key !== "authors") {
          newSearchParams.set(key, value)
        }
      })

      // Добавляем новые фильтры
      if (categories.length > 0) {
        newSearchParams.set("categories", categories.join(","))
      }

      if (authors.length > 0) {
        newSearchParams.set("authors", authors.join(","))
      }

      const queryString = newSearchParams.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(newUrl, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const onSearchSubmit = useCallback(
    (values: SearchFormValues) => {
      if (values.input && values.input.trim()) {
        const searchParams = new URLSearchParams()
        if (currentCategories.length > 0) {
          searchParams.set("categories", currentCategories.join(","))
        }
        if (currentAuthors.length > 0) {
          searchParams.set("authors", currentAuthors.join(","))
        }
        const queryString = searchParams.toString()
        const searchUrl = `/search/${encodeURIComponent(values.input.trim())}`
        router.push(queryString ? `${searchUrl}?${queryString}` : searchUrl)
      } else {
        updateURL(currentCategories, currentAuthors)
      }
    },
    [currentCategories, currentAuthors, updateURL, router],
  )

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const isSelected = currentCategories.includes(categoryId)
      const newCategories = isSelected
        ? currentCategories.filter((id) => id !== categoryId)
        : [...currentCategories, categoryId]

      updateURL(newCategories, currentAuthors)
    },
    [currentCategories, currentAuthors, updateURL],
  )

  const toggleAuthor = useCallback(
    (authorId: string) => {
      const isSelected = currentAuthors.includes(authorId)
      const newAuthors = isSelected ? currentAuthors.filter((id) => id !== authorId) : [...currentAuthors, authorId]

      updateURL(currentCategories, newAuthors)
    },
    [currentCategories, currentAuthors, updateURL],
  )

  const removeFilter = useCallback(
    (type: "categories" | "authors", id: string) => {
      if (type === "categories") {
        const newCategories = currentCategories.filter((item) => item !== id)
        updateURL(newCategories, currentAuthors)
      } else {
        const newAuthors = currentAuthors.filter((item) => item !== id)
        updateURL(currentCategories, newAuthors)
      }
    },
    [currentCategories, currentAuthors, updateURL],
  )

  const clearAllFilters = useCallback(() => {
    updateURL([], [])
  }, [updateURL])

  const hasActiveFilters = currentCategories.length > 0 || currentAuthors.length > 0

  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          {/* Search Form */}
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <FormField
                    control={searchForm.control}
                    name="input"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Поиск новостей (необязательно)..." className="pl-10 h-12" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="lg" className="h-12">
                    <Search className="mr-2 h-4 w-4" />
                    {searchForm.watch("input") ? "Поиск" : "Применить"}
                  </Button>

                  {/* Desktop Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="lg" className="h-12 relative hidden md:flex">
                        <Filter className="mr-2 h-4 w-4" />
                        Фильтры
                        {hasActiveFilters && (
                          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {currentCategories.length + currentAuthors.length}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>Фильтры</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Категории
                        </DropdownMenuLabel>
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <DropdownMenuItem
                              key={category}
                              className="flex items-center justify-between cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault()
                                toggleCategory(category)
                              }}
                            >
                              <span className="capitalize">{category}</span>
                              {currentCategories.includes(category) && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>Категории не найдены</DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Авторы
                        </DropdownMenuLabel>
                        {authors.length > 0 ? (
                          authors.slice(0, 10).map((author) => (
                            <DropdownMenuItem
                              key={author}
                              className="flex items-center justify-between cursor-pointer"
                              onSelect={(e) => {
                                e.preventDefault()
                                toggleAuthor(author)
                              }}
                            >
                              <span>{author}</span>
                              {currentAuthors.includes(author) && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>Авторы не найдены</DropdownMenuItem>
                        )}
                        {authors.length > 10 && (
                          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                            И еще {authors.length - 10} авторов...
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>

                      {hasActiveFilters && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center justify-center text-center cursor-pointer text-destructive focus:text-destructive"
                            onSelect={(e) => {
                              e.preventDefault()
                              clearAllFilters()
                            }}
                          >
                            Очистить все фильтры
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="lg" className="h-12 relative md:hidden">
                        <Filter className="mr-2 h-4 w-4" />
                        Фильтры
                        {hasActiveFilters && (
                          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                            {currentCategories.length + currentAuthors.length}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Фильтры</SheetTitle>
                        <SheetDescription>Выберите категории и авторов для фильтрации новостей</SheetDescription>
                      </SheetHeader>
                      <div className="py-6 space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Категории</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={currentCategories.includes(category)}
                                  onCheckedChange={() => toggleCategory(category)}
                                />
                                <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer capitalize">
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Авторы</h3>
                          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                            {authors.map((author) => (
                              <div key={author} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`author-${author}`}
                                  checked={currentAuthors.includes(author)}
                                  onCheckedChange={() => toggleAuthor(author)}
                                />
                                <Label htmlFor={`author-${author}`} className="text-sm cursor-pointer">
                                  {author}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <SheetFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={clearAllFilters}>
                          Очистить
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Active Filters Display - фиксированная высота для предотвращения прыжков */}
              <div className="h-8 flex items-center">
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 w-full">
                    {currentCategories.map((id) => (
                      <Badge key={`cat-${id}`} variant="secondary" className="cursor-pointer">
                        <span className="capitalize">{id}</span>
                        <button
                          type="button"
                          onClick={() => removeFilter("categories", id)}
                          className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                          aria-label={`Удалить фильтр ${id}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {currentAuthors.map((id) => (
                      <Badge key={`auth-${id}`} variant="secondary" className="cursor-pointer">
                        {id}
                        <button
                          type="button"
                          onClick={() => removeFilter("authors", id)}
                          className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                          aria-label={`Удалить фильтр ${id}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
                      Очистить все
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
