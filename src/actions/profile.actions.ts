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

