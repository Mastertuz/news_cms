"use client"

import React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface DeleteNewsButtonProps {
  newsId: string
  newsTitle: string
  variant?: "outline" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  fullWidth?: boolean
}

export function DeleteNewsButton({
  newsId,
  newsTitle,
  variant = "outline",
  size = "default",
  className,
}: DeleteNewsButtonProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: newsId }),
      })

      if (res.ok) {
        toast.success("Новость удалена", {
          description: `Новость "${newsTitle}" была успешно удалена`,
        })
        router.refresh()
      } else {
        let errorMessage = "Не удалось удалить новость"
        try {
          const data = await res.json()
          errorMessage = data?.error || errorMessage
        } catch {}
        toast.error("Ошибка", {
          description: errorMessage,
        })
      }
    } catch (err) {
      console.error("Ошибка при удалении:", err)
      toast.error("Ошибка", {
        description: "Произошла ошибка при удалении новости",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isDeleting}>
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить новость «{newsTitle}»?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить. Новость будет удалена безвозвратно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
