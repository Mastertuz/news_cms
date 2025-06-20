import Link from "next/link";
import { Menu, User, Home, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth, signOut } from "../../../auth";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Новости</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span>Главная</span>
          </Link>
          <Link
            href="/favorites"
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span>Избранное</span>
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {user ? (
            <div className="hidden md:flex items-center space-x-2">
              <form action={async () => { "use server"; await signOut(); }}>
                <Button type="submit" className="cursor-pointer">
                  Выйти
                </Button>
              </form>
              <Button asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Профиль</span>
                </Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="hidden md:inline-flex">
              <Link href="/sign-in" className="cursor-pointer">
                Войти
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0 w-full flex flex-col">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>
                  <span className="text-xl font-bold text-primary">Меню</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 p-4 flex-1">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-base font-medium rounded hover:bg-accent px-3 py-2 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    Главная
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 text-base font-medium rounded hover:bg-accent px-3 py-2 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    Избранное
                  </Link>
                </SheetClose>
                {user && (
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-base font-medium rounded hover:bg-accent px-3 py-2 transition-colors mt-1"
                    >
                      <User className="h-5 w-5" />
                      Профиль
                    </Link>
                  </SheetClose>
                )}
              </nav>
              <div className="p-4 pt-0 mt-auto">
                {user ? (
                  <SheetClose asChild>
                    <form
                      action={async () => {
                        "use server";
                        await signOut();
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full flex items-center gap-2"
                      >
                        Выйти
                      </Button>
                    </form>
                  </SheetClose>
                ) : (
                  <SheetClose asChild>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/sign-in" className="flex items-center gap-2">
                        Войти
                      </Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
