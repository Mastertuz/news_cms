import { type NextRequest, NextResponse } from "next/server";
import { YooCheckout } from "@a2seven/yoo-checkout";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../../auth";

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");
    const orderId = searchParams.get("orderId");

    if (!paymentId || !orderId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    console.log("Checking payment status:", paymentId)

    const payment = await checkout.getPayment(paymentId);

    console.log("Payment status from YooKassa:", payment.status)

    if (payment.status === "succeeded") {
      const subscriptionType = payment.metadata?.subscriptionType;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (subscriptionType === "monthly" ? 30 : 365));

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscriptionActive: true,
          subscriptionExpires: expiresAt,
        },
      })

      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: { status: "paid" },
      });

    
    } else if (payment.status === "canceled") {
      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: { status: "canceled" },
      });
    }

    return NextResponse.json({
      paymentStatus: payment.status,
      orderId,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 });
  }
}