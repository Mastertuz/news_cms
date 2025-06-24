"use server"

import { prisma } from "@/lib/prisma"
import { schema } from "@/lib/schema"
import bcrypt from "bcryptjs"
import { AuthState } from "../../types"
import { z } from "zod"


export const signUp = async (prevState: AuthState, formData: FormData): Promise<AuthState> => {
  console.log("signUp called with prevState:", prevState)
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const validatedData = schema.parse({ email, password })

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Пользователь с такой электронной почтой уже существует",
      }
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    await prisma.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: "Аккаунт успешно создан!",
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      const zodError = error as z.ZodError
      const firstError = zodError.errors[0]
      return {
        success: false,
        error: firstError.message,
      }
    }

    console.error("Ошибка при регистрации:", error)
    return {
      success: false,
      error: "Произошла ошибка при регистрации",
    }
  }
}

export const getUserInfo = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        role: true,
        favorites: true,
        subscriptionActive: true,
        subscriptionExpires: true,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }
    const hasActiveSubscription = user.subscriptionActive

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
      favorites: user.favorites.length,
      hasActiveSubscription,
      subscriptionExpires: user.subscriptionExpires,
    }
  } catch (error) {
    console.error("Error in getUserInfo:", error)
    throw error
  }
}
