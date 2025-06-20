import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Crown, Star, Bookmark, Shield, Edit } from "lucide-react"
import Link from "next/link"
import { auth } from "../../../auth"
import { getUserInfo } from "@/actions/user.actions"
import { EditProfileDialog } from "@/components/shared/edit-profile-form"
export const metadata = {
  title: "Профиль пользователя | Новостной портал",
  description: "Управление профилем и подпиской",
}

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user
  const info = await getUserInfo(user?.id || "")
  const { name, email, createdAt, role,favorites,id } = info
  const hasActiveSubscription = false 

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Профиль пользователя</h1>
          <p className="text-muted-foreground mt-2">Управляйте своим профилем и подпиской</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Личная информация
                </CardTitle>
                <CardDescription>Ваши основные данные</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Имя пользователя</p>
                    <p className="font-medium">{name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Дата регистрации</p>
                    <p className="font-medium">{createdAt?.toLocaleDateString?.() ?? ""}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Роль</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{role === "admin" ? "Администратор" : "Пользователь"}</p>
                      {role === "admin" && <Badge variant="secondary">Admin</Badge>}
                    </div>
                  </div>
                </div>
                <EditProfileDialog user={info} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Подписка
                </CardTitle>
                <CardDescription>Статус вашей подписки</CardDescription>
              </CardHeader>
              <CardContent>
                {hasActiveSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Активна
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Ваша подписка активна до 15 февраля 2025</p>
                    <Button variant="outline" className="w-full">
                      Управление подпиской
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Не активна</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Оформите подписку, чтобы получить доступ к дополнительным возможностям
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/">
                        <Crown className="mr-2 h-4 w-4" />
                        Оформить подписку
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Преимущества подписки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Bookmark className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Добавление новостей в избранное</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Доступ к эксклюзивным материалам</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Приоритетная поддержка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">Отсутствие рекламы</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ваша активность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Избранных новостей</span>
                    <span className="font-medium">
                      {favorites||0}
                      </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Дней с нами</span>
                    <span className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}
