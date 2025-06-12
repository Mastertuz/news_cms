import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "../../../auth";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Авторизация</h1>

        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
        >
          <Input
            name="email"
            placeholder="Электронная почта"
            type="email"
            required
            autoComplete="email"
          />
          <Input
            name="password"
            placeholder="Пароль"
            type="password"
            required
            autoComplete="current-password"
          />
          <Button className="w-full cursor-pointer" type="submit">
            Войти
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link" >
            <Link href="/sign-up" className="cursor-pointer">Нет аккаунта? Зарегистрироваться</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;