"use client"

import type React from "react"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Search, Check, X } from "lucide-react"
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
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
  currentCategories: string[]
  currentAuthors: string[]
}

export function NewsFilterClient({
  categories,
  authors,
  currentQuery,
  currentCategories,
  currentAuthors,
}: NewsFilterClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      input: currentQuery || "",
    },
  })

  const updateURL = useCallback(
    (categories: string[], authors: string[]) => {
      const newSearchParams = new URLSearchParams()

      searchParams.forEach((value, key) => {
        if (key !== "categories" && key !== "authors") {
          newSearchParams.set(key, value)
        }
      })

      if (categories.length) {
        newSearchParams.set("categories", categories.join(","))
      }

      if (authors.length) {
        newSearchParams.set("authors", authors.join(","))
      }

      const newUrl = `${pathname}?${newSearchParams.toString()}`
      router.replace(newUrl, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const onSearchSubmit = useCallback(
    (values: SearchFormValues) => {
      const query = values.input?.trim()
      if (query) {
        const params = new URLSearchParams()
        if (currentCategories.length) params.set("categories", currentCategories.join(","))
        if (currentAuthors.length) params.set("authors", currentAuthors.join(","))
        const searchUrl = `/search/${encodeURIComponent(query)}`
        const fullUrl = params.toString() ? `${searchUrl}?${params.toString()}` : searchUrl
        router.push(fullUrl, { scroll: false })
      } else {
        updateURL(currentCategories, currentAuthors)
      }
    },
    [currentCategories, currentAuthors, updateURL, router],
  )

  const toggleFilter = useCallback(
    (type: "categories" | "authors", id: string) => {
      const list = type === "categories" ? currentCategories : currentAuthors
      const newList = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]

      if (type === "categories") {
        updateURL(newList, currentAuthors)
      } else {
        updateURL(currentCategories, newList)
      }
    },
    [currentCategories, currentAuthors, updateURL],
  )

  const removeFilter = useCallback(
    (type: "categories" | "authors", id: string) => {
      const filtered =
        type === "categories"
          ? currentCategories.filter((item) => item !== id)
          : currentAuthors.filter((item) => item !== id)

      if (type === "categories") {
        updateURL(filtered, currentAuthors)
      } else {
        updateURL(currentCategories, filtered)
      }
    },
    [currentCategories, currentAuthors, updateURL],
  )

  const clearAllFilters = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      updateURL([], [])
    },
    [updateURL],
  )

  const hasActiveFilters = currentCategories.length > 0 || currentAuthors.length > 0

  return (
    <div className="mb-6">
      <div className="max-h-[80vh] overflow-auto">
        <Card>
          <CardContent className="p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSearchSubmit)} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <FormField
                      control={form.control}
                      name="input"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input placeholder="Поиск новостей..." className="pl-10 h-12" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="lg" className="h-12">
                      {form.watch("input") ? "Поиск" : "Применить"}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="lg" className="h-12 relative hidden md:flex" type="button">
                          Фильтры
                          {hasActiveFilters && (
                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                              {currentCategories.length + currentAuthors.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-60 max-h-96 overflow-y-auto" align="end">
                        <DropdownMenuLabel>Категории</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {categories.map((category) => (
                            <DropdownMenuItem
                              key={category}
                              onSelect={(e) => {
                                e.preventDefault()
                                toggleFilter("categories", category)
                              }}
                              className="flex justify-between cursor-pointer"
                            >
                              <span className="capitalize">{category}</span>
                              {currentCategories.includes(category) && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Авторы</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {authors.slice(0, 10).map((author) => (
                            <DropdownMenuItem
                              key={author}
                              onSelect={(e) => {
                                e.preventDefault()
                                toggleFilter("authors", author)
                              }}
                              className="flex justify-between cursor-pointer"
                            >
                              {author}
                              {currentAuthors.includes(author) && <Check className="h-4 w-4" />}
                            </DropdownMenuItem>
                          ))}
                          {authors.length > 10 && (
                            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                              И еще {authors.length - 10}...
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>

                        {hasActiveFilters && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault()
                                clearAllFilters()
                              }}
                              className="text-destructive justify-center"
                            >
                              Очистить фильтры
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="lg" className="h-12 md:hidden relative" type="button">
                          Фильтры
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-md p-4 space-y-6 flex flex-col h-full">
                        <SheetHeader>
                          <SheetTitle className="text-lg">Фильтры</SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-auto space-y-4">
                          <h3 className="text-base font-semibold">Категории</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`cat-${category}`}
                                  checked={currentCategories.includes(category)}
                                  onCheckedChange={() => toggleFilter("categories", category)}
                                />
                                <Label htmlFor={`cat-${category}`} className="capitalize text-sm">
                                  {category}
                                </Label>
                              </div>
                            ))}
                          </div>

                          <Separator />

                          <h3 className="text-base font-semibold">Авторы</h3>
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {authors.map((author) => (
                              <div key={author} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`auth-${author}`}
                                  checked={currentAuthors.includes(author)}
                                  onCheckedChange={() => toggleFilter("authors", author)}
                                />
                                <Label htmlFor={`auth-${author}`} className="text-sm">
                                  {author}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <SheetFooter className="pt-6">
                          <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
                            Очистить фильтры
                          </Button>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
                    {currentCategories.map((cat) => (
                      <Badge key={cat} variant="secondary" className="flex items-center gap-2 p-2">
                        <span className="capitalize ">{cat}</span>
                        <Button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeFilter("categories", cat)
                          }}
                          className="size-4 cursor-pointer hover:text-destructive transition-colors"
                          aria-label={`Удалить фильтр ${cat}`}
                        >
                          <X className="" />
                        </Button>
                      </Badge>
                    ))}
                    {currentAuthors.map((author) => (
                      <Badge key={author} variant="secondary" className="flex items-center gap-1">
                        {author}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeFilter("authors", author)
                          }}
                          className="p-1.5 rounded-full hover:bg-gray-100 hover:text-destructive transition-colors"
                          aria-label={`Удалить фильтр ${author}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-6 px-2 text-xs"
                      type="button"
                    >
                      Очистить все
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
