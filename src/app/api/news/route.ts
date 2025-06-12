import { NextRequest, NextResponse } from 'next/server';
import { createNewsItem, deleteNewsItem, getAllNews } from '@/actions/news.actions';

export async function GET() {
  const news = await getAllNews();
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newProduct = await createNewsItem(body);
  return NextResponse.json(newProduct);
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteNewsItem(id);
    return NextResponse.json({ message: 'News item deleted' });
  } catch (err) {
    console.error('Error deleting news item:', err);
    return NextResponse.json({ error: 'Failed to delete news item' }, { status: 500 });
  }
}