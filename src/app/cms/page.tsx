import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '../../../auth';
import CmsContent from '@/components/shared/cms-content';
import { getAllNews } from '@/actions/news.actions';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
}

export default async function CmsPage() {
  const session = await auth()
  if (session?.user?.role !== 'user') return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Доступ запрещен</h1>
      <p className="text-center">У вас нет прав для доступа к этой странице.</p>
      <Button className="mt-4" asChild>
        <Link href="/" className="cursor-pointer">
          Вернуться на главную
        </Link>
      </Button>
    </div>
  );
  const news = await getAllNews();
  
  
  return <CmsContent news={news} />;
}