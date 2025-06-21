import { prisma } from "@/lib/prisma";
import { schema } from "@/lib/schema";
import bcrypt from "bcryptjs";

const signUp = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const validatedData = schema.parse({ email, password });

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  await prisma.user.create({
    data: {
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
    },
  });
};

export { signUp };


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
    });

    if (!user) {
      throw new Error("User not found");
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
    };
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    throw error;
  } 
};
