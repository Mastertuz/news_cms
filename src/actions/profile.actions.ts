'use server'
import { prisma } from "@/lib/prisma"
import { auth } from "../../auth"
import { revalidatePath } from "next/cache"

interface UpdateProfileData {
  name?: string
  image?: string
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.image && { image: data.image }),
      },
    })

    revalidatePath("/profile")
    return updatedUser
  } catch (error) {
    console.error("Ошибка обновления профиля:", error)
    throw new Error("Не удалось обновить профиль")
  }
}

export const CancelSubscription = async (hasActiveSubscription: boolean) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }
    if (hasActiveSubscription) {

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscriptionActive: false,
          subscriptionExpires: null,
        },
      })
      revalidatePath("/profile")
    } else {

    }
  } catch (error) {
    console.error("Ошибка отмены подписки:", error)
    throw new Error("Не удалось отменить подписку")
  }
}

export const getUserInfoByOrderId = async (orderId: string) => {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Необходимо авторизоваться")
    }
    const order = await prisma.subscriptionOrder.findUnique({
      where: { id: orderId },
      select: {
        userId: true,
      },
    })


    const user = await prisma.user.findUnique({
      where: { id: order?.userId || "" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        subscriptionActive: true,
        subscriptionExpires: true,
      },
    })
    return user
  } catch (error) {
    console.error("Ошибка получения пользователя по ID заказа:", error)
    throw new Error("Не удалось получить пользователя по ID заказа")
  }
}

