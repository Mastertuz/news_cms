'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NewsItem } from '../../../types';
import { EditNewsDialog } from './edit-news-form';
type Props = {
  news: NewsItem[];
};

export default function NewsTable({ news }: Props) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/news', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        let errorMessage = 'Не удалось удалить новость';
        try {
          const data = await res.json();
          errorMessage = data?.error || errorMessage;
        } catch {}
        alert(`Ошибка: ${errorMessage}`);
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      alert('Произошла ошибка при удалении новости.');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Изображение</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Опубликовано</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((newsItem) => (
          <TableRow key={newsItem.id}>
            <TableCell>
              <Image
                src={newsItem?.imageUrl ?? ''}
                alt={newsItem.title}
                width={128}
                height={96}
                className="w-32 h-24 object-contain rounded"
              />
            </TableCell>
            <TableCell>{newsItem.title}</TableCell>
            <TableCell>
              {new Date(newsItem.publishedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-2">
              <EditNewsDialog  newsItem={newsItem}/>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="link" className="text-red-600">
                    Удалить
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Удалить новость «{newsItem.title}»?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Это действие нельзя отменить. Товар будет удалён
                      безвозвратно.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(newsItem.id)}>
                      Удалить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}