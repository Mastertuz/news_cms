export interface NewsItem {
    id: string,
    title: string,
    summary: string,
    imageUrl: string,
    publishedAt: Date,
    author: string,
    sourceUrl: string,
    source: string,
    category: string,
}
export type NewsCreateInput = {
    title: string,
    summary: string,
    imageUrl: string,
    author: string,
    sourceUrl: string,
    source: string,
    category: string,
};
