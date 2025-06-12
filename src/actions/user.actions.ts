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
