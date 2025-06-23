import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../../auth";
import { signUp } from "@/actions/user.actions";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Создать аккаунт</h1>
        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            const res = await signUp(formData);
            redirect("/sign-in");
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
            autoComplete="new-password"
          />
          <Button className="w-full cursor-pointer" type="submit">
            Зарегистрироваться
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link" className="cursor-pointer">
            <Link href="/sign-in">Уже есть аккаунт? Авторизоваться</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;