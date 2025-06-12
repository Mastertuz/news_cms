import { NewsCard } from "@/components/shared/news-card";
import { NewsFilter } from "@/components/shared/news-filter";
import Newsgrid from "@/components/shared/news-grid";


export default function Home() {
  const news = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <main className="container mx-auto py-6 px-4">
      <NewsFilter/>
      <Newsgrid news = {news}/>
    </main>
  );
}
