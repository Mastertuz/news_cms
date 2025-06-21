import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { YooCheckout } from "@a2seven/yoo-checkout";

import { auth } from "../../../../auth";

const checkout = new YooCheckout({
  shopId: process.env.YUKASSA_SHOP_ID!,
  secretKey: process.env.YUKASSA_SECRET_KEY!,
});
console.log(":", checkout);
interface PaymentSuccessProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}


async function PaymentSuccessContent({ orderId }: { orderId?: string }) {
  let order = null;
  let paymentUpdated = false;

  if (orderId) {
    try {
      order = await prisma.subscriptionOrder.findUnique({
        where: { id: orderId },
      });

      if (order && order.status === "pending") {
        console.log("Order status is pending, checking payment status...");
        try {
          const session = await auth();

          if (session?.user?.id) {
            await prisma.subscriptionOrder.update({
              where: { id: orderId },
              data: { status: "paid" },
            });
            order = { ...order, status: "paid" };
            paymentUpdated = true;

            await prisma.user.update({
                where: {id:order.userId},
                data: {
                  subscriptionActive: true,
                  subscriptionExpires: new Date(Date.now() + (order.subscriptionType === "monthly" ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000)),
                },
            })

            console.log(`Order ${orderId} updated to paid and cart cleared`);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Оплата прошла успешно!
          </CardTitle>
          {paymentUpdated && (
            <p className="text-sm text-green-600 mt-2">
              Статус заказа обновлен, корзина очищена
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {order ? (
            <div className="text-left space-y-4">
              <div className=" p-4 rounded-lg">
                <p className="text-sm text-white my-2">
                  Дата: {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </p>
                <p className="text-sm text-white mb-2">
                  Статус:{" "}
                  <span className="font-medium">
                    {order.status === "paid" ? "Оплачен" : order.status}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Спасибо за покупку! Ваш заказ успешно оплачен.
            </p>
          )}

          <div className="flex gap-4 justify-center max-sm:flex-col">
            <Button asChild>
              <Link href="/">Продолжить покупки</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/orders">Мои заказы</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessProps) {
  const { orderId } = await searchParams;
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <PaymentSuccessContent orderId={orderId} />
    </Suspense>
  );
}
