'use client';

import { NewsItem } from '../../../types';
import AddNewsDialog from './add-news-form';
import NewsTable from './news-table';
export default function CmsContent({ news }: { news: NewsItem[] }) {

  return (
    <main className="p-12 space-y-6">
      <h1 className="text-2xl font-bold">CMS - Управление новостями</h1>
      <AddNewsDialog/>
      <NewsTable news={news}/>
    </main>
  );
}