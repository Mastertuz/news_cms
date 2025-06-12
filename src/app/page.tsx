import { getAllNews } from "@/actions/news.actions";
import { NewsFilter } from "@/components/shared/news-filter";
import Newsgrid from "@/components/shared/news-grid";


export default async function Home() {
  const news = await getAllNews()
  return (
    <main className="container mx-auto py-6 px-4">
      <NewsFilter/>
      <Newsgrid news = {news}/>
    </main>
  );
}
