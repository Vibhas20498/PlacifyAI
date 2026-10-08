import { NextResponse } from 'next/server';
import { globalResumeVectorStore } from '@/lib/rag-engine/vector-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || '';
    const roleFilter = body.roleFilter;
    const categoryFilter = body.categoryFilter;
    const topK = body.topK || 4;

    if (!query) {
      return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
    }

    const results = globalResumeVectorStore.search(query, {
      topK,
      roleFilter,
      categoryFilter,
    });

    return NextResponse.json({
      success: true,
      query,
      totalChunksIndexed: globalResumeVectorStore.getAllChunksCount(),
      resultsCount: results.length,
      results: results.map((r) => ({
        id: r.chunk.id,
        title: r.chunk.title,
        category: r.chunk.category,
        roleTarget: r.chunk.roleTarget,
        topic: r.chunk.topic,
        content: r.chunk.content,
        similarityScore: r.similarityScore,
        matchedTerms: r.matchedTerms,
        keyActionVerbs: r.chunk.keyActionVerbs,
        sampleWeakBullet: r.chunk.sampleWeakBullet,
        sampleStrongBullet: r.chunk.sampleStrongBullet,
        quantificationAdvice: r.chunk.quantificationAdvice,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'RAG search failed.' }, { status: 500 });
  }
}
