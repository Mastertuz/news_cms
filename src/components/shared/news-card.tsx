"use client";

import Image from "next/image";
import {  Calendar, ExternalLink, Heart, User } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
export function NewsCard() {
  const obj = {
    title: "Заголовок новости",
    summary:
      "Краткое описание новости, которое должно быть достаточно информативным, но не слишком длинным.",
    imageUrl: "https://cdnn21.img.ria.ru/images/07e9/04/1c/2013784766_0:321:3072:2048_768x0_80_0_0_a86a9e32ba03335b4e7bd2c07df6901c.jpg.webp",
    author: "Олег Иванов",
    publishedAt: "2025-06-01",
    category: "Политика",
    source: 'Tass.ru'
  };

  const { title, summary, imageUrl, publishedAt, author,category,source } = obj;

  const liked = false;
  return (
    <Card className="hover:shadow-lg shadow-gray-500 transition-all duration-200 group p-0 ">
      
      <div className="aspect-video overflow-hidden rounded-t-lg relative">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          priority
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      <CardHeader>
         <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={`text-lg line-clamp-2 leading-tight  `}
          >
            {title}
          </CardTitle>
          <Badge variant="secondary" className={`shrink-0`}>
            {category}
          </Badge>
        </div>
        <CardDescription className="text-sm text-white flex items-center gap-2">
          <span>{source}</span>
          {author  && (
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
     <CardContent className="pb-4">
        <p className=" mb-4 line-clamp-3">{summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm ">
            <Calendar className="w-4 h-4 mr-1" />
            {publishedAt}
          </div>
          <Button
            variant={"outline"}
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
          >
            { "Читать"}
           <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
     
    </Card>
  );
}
