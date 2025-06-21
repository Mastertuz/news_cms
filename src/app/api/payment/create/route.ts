import { type NextRequest, NextResponse } from "next/server";
import { YooCheckout } from "@a2seven/yoo-checkout";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";

const checkout = new YooCheckout({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prisma) {
      console.error("Prisma client is not initialized");
      return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }

    let subscriptionType: string;
    try {
      const body = await request.json();
      subscriptionType = body.subscriptionType;
      if (!subscriptionType) {
        return NextResponse.json({ error: "Subscription type is required" }, { status: 400 });
      }
    } catch (error) {
      console.error("Invalid JSON input:", error);
      return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
    }

    const subscriptionPrice = subscriptionType === "monthly" ? 499 : 4999;
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://your-production-url.com"
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const order = await prisma.subscriptionOrder.create({
      data: {
        userId: session.user.id,
        amount: subscriptionPrice,
        status: "pending",
        subscriptionType,
      },
    });

    console.log("DEBUG: Created order", order);

    const paymentData = {
      amount: {
        value: subscriptionPrice.toFixed(2),
        currency: "RUB",
      },
      confirmation: {
        type: "redirect" as const,
        return_url: `${baseUrl}/payment/success?orderId=${order.id}`,
      },
      capture: true,
      description: `Подписка (${subscriptionType}) #${order.id}`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
        subscriptionType,
      },
    };
    console.log("DEBUG: Payment data", paymentData);

    const payment = await checkout.createPayment(paymentData);

    console.log("DEBUG: Created payment", payment);

    return NextResponse.json({
      paymentId: payment.id,
      confirmationUrl: payment.confirmation?.confirmation_url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Payment creation error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create payment",
          details: error.message,
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}

