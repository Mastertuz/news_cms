import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { getUserInfoByOrderId } from "@/actions/profile.actions";

interface PaymentSuccessProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

async function PaymentSuccessContent({ orderId }: { orderId?: string }) {
  let order = null;
  let subscriptionExpires: Date | null = null;

  if (orderId) {
    order = await prisma.subscriptionOrder.findUnique({
      where: { id: orderId },
    });

    if (order && order.status !== "paid") {
      const session = await auth();
      if (session?.user?.id) {
        const expires = new Date(
          Date.now() +
            (order.subscriptionType === "monthly"
              ? 30 * 24 * 60 * 60 * 1000
              : 365 * 24 * 60 * 60 * 1000)
        );
        await prisma.subscriptionOrder.update({
          where: { id: orderId },
          data: { status: "paid" },
        });
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            subscriptionActive: true,
            subscriptionExpires: expires,
          },
        });
      }
    } 
  }
  const userInfo = await getUserInfoByOrderId(orderId!)
  if (userInfo){
    subscriptionExpires = userInfo.subscriptionExpires || null;
  }
  return (
    <div className="container mx-auto p-4 max-w-md flex items-center justify-center min-h-[80vh]">
      <Card className="w-full shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <CheckCircle className="h-16 w-16 max-[400px]:size-12 text-green-500 mb-2" />
          <CardTitle className="text-2xl max-[400px]:text-xl text-green-700 mb-1">
            Оплата прошла успешно!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className=" text-center max-[400px]:text-sm">
            Спасибо за оформление подписки.
            <br />
            Ваша подписка активна.
          </p>
          {subscriptionExpires && (
            <div className="bg-green-50 rounded-md px-4 py-2 text-green-800 text-sm font-medium">
              Подписка действует до:{" "}
              {new Date(subscriptionExpires).toLocaleDateString("ru-RU")}
            </div>
          )}
          <Button asChild className="mt-4 w-full">
            <Link href="/profile">Перейти в профиль</Link>
          </Button>
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
      <PaymentSuccessContent orderId={orderId} />
  );
}
