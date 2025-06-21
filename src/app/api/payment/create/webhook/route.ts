import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log("Raw webhook body:", body)

    const notification = JSON.parse(body)
    console.log("Parsed webhook notification:", JSON.stringify(notification, null, 2))

    if (!notification.object || !notification.event) {
      console.error("Invalid notification format")
      return NextResponse.json({ error: "Invalid notification format" }, { status: 400 })
    }

    const { object: payment, event } = notification

    console.log("Processing event:", event)
    console.log("Payment status:", payment.status)
    console.log("Payment metadata:", payment.metadata)

    if (event === "payment.succeeded" && payment.status === "succeeded") {
      const orderId = payment.metadata?.orderId;
      const userId = payment.metadata?.userId;
      const subscriptionType = payment.metadata?.subscriptionType;

      if (orderId && userId) {
        console.log("Processing successful payment for order:", orderId)
        try {
          const updatedOrder = await prisma.subscriptionOrder.update({
            where: { id: orderId },
            data: { status: "paid" },
          })
          console.log("Order updated successfully:", updatedOrder)
        } catch (err) {
          console.error("Error updating order:", err)
        }

          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + (subscriptionType === "monthly" ? 30 : 365));
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionActive: true,
              subscriptionExpires: expiresAt,
            },
          })
      }
    } else if (event === "payment.canceled" && payment.status === "canceled") {
      const orderId = payment.metadata?.orderId;
      if (orderId) {
        await prisma.subscriptionOrder.update({
          where: { id: orderId },
          data: { status: "canceled" },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}