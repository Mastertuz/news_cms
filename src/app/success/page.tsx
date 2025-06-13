import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, Bookmark, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Подписка оформлена | Новостной портал",
  description: "Ваша подписка успешно оформлена",
}

export default function SubscriptionSuccessPage() {
  // Вычисляем дату окончания подписки (30 дней от текущей даты)
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30)

  // Форматируем дату для отображения
  const formattedEndDate = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(endDate)

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-center">Подписка успешно оформлена!</h1>
          <p className="text-muted-foreground text-center mt-2">
            Спасибо за оформление подписки на нашем новостном портале
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Детали вашей подписки</CardTitle>
            <CardDescription>Информация о вашем текущем плане</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b">
              <div className="rounded-full bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Срок действия</h3>
                <p className="text-sm text-muted-foreground">Ваша подписка действует 30 дней до {formattedEndDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Bookmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Доступные возможности</h3>
                <p className="text-sm text-muted-foreground">
                  Теперь вы можете добавлять новости в избранное и получать к ним доступ в любое время
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Вернуться на главную
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/favorites">
                <Bookmark className="mr-2 h-4 w-4" />
                Перейти в избранное
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-medium mb-2">Что дальше?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Просматривайте новости и добавляйте интересные в избранное</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">Получайте доступ к избранным новостям с любого устройства</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">За 5 дней до окончания подписки мы отправим вам уведомление</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
