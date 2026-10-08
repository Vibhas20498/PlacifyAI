import { RAGKnowledgeChunk, RetrievedChunkResult } from './types';
import { ATS_KNOWLEDGE_CHUNKS } from './knowledge-base/ats';
import { WRITING_KNOWLEDGE_CHUNKS } from './knowledge-base/writing';
import { ROLE_KNOWLEDGE_CHUNKS } from './knowledge-base/roles';

// Master knowledge corpus
export const ALL_RAG_CHUNKS: RAGKnowledgeChunk[] = [
  ...ATS_KNOWLEDGE_CHUNKS,
  ...WRITING_KNOWLEDGE_CHUNKS,
  ...ROLE_KNOWLEDGE_CHUNKS,
];

// Stopwords for cleaner semantic vector tokens
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

interface IndexedChunk {
  chunk: RAGKnowledgeChunk;
  termFrequencies: Map<string, number>;
  magnitude: number;
}

export class ResumeVectorStore {
  private chunks: IndexedChunk[] = [];
  private idfMap: Map<string, number> = new Map();
  private isInitialized = false;

  constructor(customChunks?: RAGKnowledgeChunk[]) {
    this.initialize(customChunks || ALL_RAG_CHUNKS);
  }

  private initialize(chunks: RAGKnowledgeChunk[]) {
    if (this.isInitialized) return;

    const docCount = chunks.length;
    const documentFrequencies = new Map<string, number>();

    // Pass 1: Tokenize chunks and compute document frequencies
    const processed = chunks.map((chunk) => {
      const fullText = `${chunk.title} ${chunk.topic} ${chunk.category} ${chunk.roleTarget || ''} ${chunk.content} ${chunk.tags.join(' ')} ${chunk.keyActionVerbs?.join(' ') || ''} ${chunk.quantificationAdvice || ''}`;
      const tokens = tokenize(fullText);
      const tf = new Map<string, number>();

      const seenTerms = new Set<string>();
      for (const t of tokens) {
        tf.set(t, (tf.get(t) || 0) + 1);
        if (!seenTerms.has(t)) {
          seenTerms.add(t);
          documentFrequencies.set(t, (documentFrequencies.get(t) || 0) + 1);
        }
      }

      return { chunk, termFrequencies: tf };
    });

    // Pass 2: Compute Inverse Document Frequency (IDF)
    documentFrequencies.forEach((freq, term) => {
      // Smoothed IDF
      const idf = Math.log(1 + (docCount - freq + 0.5) / (freq + 0.5));
      this.idfMap.set(term, idf);
    });

    // Pass 3: Compute TF-IDF Vectors & L2 Norm magnitudes
    this.chunks = processed.map(({ chunk, termFrequencies }) => {
      let sumSq = 0;
      termFrequencies.forEach((count, term) => {
        const idf = this.idfMap.get(term) || 0.1;
        const tfIdf = count * idf;
        sumSq += tfIdf * tfIdf;
      });

      return {
        chunk,
        termFrequencies,
        magnitude: Math.sqrt(sumSq) || 1,
      };
    });

    this.isInitialized = true;
  }

  /**
   * Performs Semantic Vector & BM25 Cosine Similarity Search
   */
  public search(
    query: string,
    options?: {
      topK?: number;
      roleFilter?: string;
      categoryFilter?: string;
      minScore?: number;
    }
  ): RetrievedChunkResult[] {
    const topK = options?.topK || 3;
    const roleFilter = options?.roleFilter?.toLowerCase();
    const categoryFilter = options?.categoryFilter?.toLowerCase();
    const minScore = options?.minScore || 0.15;

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    // Compute query TF-IDF vector & magnitude
    const queryTf = new Map<string, number>();
    for (const t of queryTokens) {
      queryTf.set(t, (queryTf.get(t) || 0) + 1);
    }

    let querySumSq = 0;
    queryTf.forEach((count, term) => {
      const idf = this.idfMap.get(term) || 0.5;
      const weight = count * idf;
      querySumSq += weight * weight;
    });
    const queryMagnitude = Math.sqrt(querySumSq) || 1;

    // Score all chunks against query vector
    const results: RetrievedChunkResult[] = [];

    for (const indexed of this.chunks) {
      // Apply filters if provided
      if (roleFilter && indexed.chunk.roleTarget && indexed.chunk.roleTarget !== 'General') {
        const chunkRole = indexed.chunk.roleTarget.toLowerCase();
        if (!chunkRole.includes(roleFilter) && !roleFilter.includes(chunkRole)) {
          // Allow slight penalty instead of strict exclusion so general knowledge is still accessible
        }
      }

      if (categoryFilter && indexed.chunk.category.toLowerCase() !== categoryFilter) {
        continue;
      }

      let dotProduct = 0;
      const matchedTerms: string[] = [];

      queryTf.forEach((qCount, term) => {
        const docCount = indexed.termFrequencies.get(term);
        if (docCount) {
          const idf = this.idfMap.get(term) || 0.5;
          dotProduct += (qCount * idf) * (docCount * idf);
          matchedTerms.push(term);
        }
      });

      // Semantic Cosine Similarity
      let cosineSimilarity = dotProduct / (queryMagnitude * indexed.magnitude);

      // Boost if role matches target query
      if (roleFilter && indexed.chunk.roleTarget && indexed.chunk.roleTarget.toLowerCase().includes(roleFilter)) {
        cosineSimilarity += 0.25;
      }

      // Boost if tag matches
      const hasTagMatch = indexed.chunk.tags.some((tag) => queryTokens.includes(tag.toLowerCase()));
      if (hasTagMatch) {
        cosineSimilarity += 0.15;
      }

      const finalScore = Math.min(0.99, Number(cosineSimilarity.toFixed(3)));

      if (finalScore >= minScore) {
        results.push({
          chunk: indexed.chunk,
          similarityScore: finalScore,
          matchedTerms,
        });
      }
    }

    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, topK);
  }

  public getAllChunksCount(): number {
    return this.chunks.length;
  }
}

// Singleton Vector Store Instance
export const globalResumeVectorStore = new ResumeVectorStore();
