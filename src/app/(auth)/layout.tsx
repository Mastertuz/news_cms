import { Toaster } from "@/components/ui/sonner";
import "../globals.css";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
        <Toaster/>
    </>
  );
}
