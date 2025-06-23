import { Header } from "@/components/shared/header";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main className="px-8 max-[520px]:px-2">
            <Header/>
        {children}
        <Toaster position="top-center" richColors />
        </main>
  );
}
