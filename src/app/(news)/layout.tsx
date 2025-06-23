import { Header } from "@/components/shared/header";
import "../globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main className="px-8 max-[520px]:px-2">
            <Header/>
        {children}
        </main>
  );
}
