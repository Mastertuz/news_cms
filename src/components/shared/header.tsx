import Link from "next/link";
import { Menu, User, Home, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { auth, signOut } from "../../../auth";

export async function Header() {
  const session = await auth()
  const user = session?.user;
  const isOpen = false; 
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Новости</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
            <Link
              href={'/'}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4" />
              <span>Главная</span>
            </Link>
            <Link
              href={'/favorites'}
              className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Heart className="h-4 w-4" />
              <span>Избранное</span>
            </Link>
        </nav>
        <div className="flex items-center space-x-2">
           {user ? (
            <Button
              onClick={async () => {
                "use server";
                await signOut();
              }}
              className="cursor-pointer"
            >
              Выйти
            </Button>
          ) : (
            <Button
              asChild
            >
              <Link href="/sign-in" className="cursor-pointer">
                Войти
              </Link>
            </Button>
          )}

          <Sheet open={isOpen} >
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                   <Link
                    href={'/'}
                    className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                  >
                    <Home className="h-5 w-5" />
                    <span>Главная</span>
                  </Link>
                  <Link
                    href={'/favorites'}
                    className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Избранное</span>
                  </Link>

                <div className="border-t pt-4">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-2 rounded-md hover:bg-accent"
                  >
                    <User className="h-5 w-5" />
                    <span>Профиль</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
