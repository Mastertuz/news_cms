'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface Props {
  hasActiveSubscription: boolean;
  subscriptionExpires?: string | null;
}

export default function SubscribeSection({
  hasActiveSubscription,
  subscriptionExpires,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    const res = await fetch("/api/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscriptionType: "monthly" }), // или "yearly"
    });

    const data = await res.json();
    if (data.confirmationUrl) {
      window.location.href = data.confirmationUrl;
    } else {
      setLoading(false);
      alert("Ошибка создания платежа");
    }
  }

  return (
    <div className="space-y-4">
      {hasActiveSubscription ? (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              Активна
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Ваша подписка активна до{" "}
            {subscriptionExpires
              ? new Date(subscriptionExpires).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "неизвестно"}
          </p>
          <Button variant="outline" className="w-full" disabled>
            Управление подпиской
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Не активна</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Оформите подписку, чтобы получить доступ к дополнительным возможностям
          </p>
          <Button onClick={handleSubscribe} className="w-full" disabled={loading}>
            <Crown className="mr-2 h-4 w-4" />
            {loading ? "Переход..." : "Оформить подписку"}
          </Button>
        </>
      )}
    </div>
  );
}