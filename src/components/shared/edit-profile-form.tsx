"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Edit, Save } from "lucide-react"
import { updateProfile } from "@/actions/profile.actions"
import { useRef } from "react"

interface User {
  id: string
  name: string | null
  email: string
}

interface EditProfileDialogProps {
  user: User | null
  trigger?: React.ReactNode
}

const profileSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function EditProfileDialog({ user, trigger }: EditProfileDialogProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
    },
  })

  const closeRef = useRef<HTMLButtonElement>(null)

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim()
      await updateProfile({
        name: fullName,
      })
      form.reset(data)
      closeRef.current?.click()
    } catch (error) {
      console.error("Ошибка обновления профиля:", error)
      form.setError("root", {
        message: "Не удалось обновить профиль. Попробуйте еще раз.",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать профиль
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>Измените необходимые поля и нажмите Сохранить.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фамилия</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите фамилию" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={user?.email || ""} disabled className="bg-gray-100 dark:bg-gray-800" />
              <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
            </div>

            {form.formState.errors.root && (
              <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" ref={closeRef}>
                  Отмена
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Сохранение..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить изменения
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
