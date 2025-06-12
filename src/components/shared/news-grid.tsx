import { NewsCard } from "./news-card";

function Newsgrid({news}: { news: number[] }) {
    console.log(news)
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {news.map((item,index)=>(
            <NewsCard key={index} />
        ))}
    </div>
  )
}

export default Newsgrid;