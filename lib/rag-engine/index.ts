import { RAGKnowledgeDoc } from '../types';

export const KNOWLEDGE_CORPUS: RAGKnowledgeDoc[] = [
  {
    id: 'rubric-tier1-backend',
    title: 'Tier-1 Engineering Hiring Rubric (Backend & Systems)',
    source: 'FAANG/Tier-1 Hiring Committee Guidelines 2026',
    category: 'Hiring Rubric',
    snippet: 'Candidates are evaluated on concurrency handling, database indexing (B-trees, compound indices), ACID transactions, and idempotent REST/gRPC API architecture. Pure CRUD projects without latency benchmarks, caching layers (Redis), or Dockerized deployment are downgraded to L3 junior baseline.',
    relevanceScore: 0.95,
  },
  {
    id: 'ats-quantifiable-impact',
    title: 'ATS Resume Scoring & Impact Quantification Matrix',
    source: 'Enterprise Talent Acquisition Benchmarks',
    category: 'ATS Guide',
    snippet: 'Resumes utilizing the Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]") achieve a 3.4x higher interview callback rate. Bullet points lacking numbers (percentages, latency ms, QPS, user count) score below 60/100 in automated ATS parsers.',
    relevanceScore: 0.92,
  },
  {
    id: 'system-design-microservices',
    title: 'Scalable System Architecture & Microservice Patterns',
    source: 'Distributed Systems Design Handbook',
    category: 'System Design',
    snippet: 'When designing real-time systems, prioritize event-driven messaging (Kafka/RabbitMQ) for decoupled workflows, distributed cache invalidation strategies (Write-through vs Cache-aside), and database sharding by consistent hashing.',
    relevanceScore: 0.88,
  },
  {
    id: 'dsa-algorithmic-core',
    title: 'Core DSA Competency Matrix for Placement Interviews',
    source: 'Technical Interview Mastery Standard',
    category: 'DSA Syllabus',
    snippet: '80% of technical screening rounds focus on: Two Pointers, Sliding Window, Monotonic Stacks, Graph BFS/DFS, Topological Sort, Dynamic Programming (0/1 Knapsack, Longest Common Subsequence), and Trie prefix lookups.',
    relevanceScore: 0.94,
  },
  {
    id: 'behavioral-star-rubric',
    title: 'Behavioral & Leadership Principles Evaluation Rubric',
    source: 'Amazon & Stripe Interview Standards',
    category: 'Interview Transcript',
    snippet: 'Answers must follow STAR (Situation, Task, Action, Result). 70% of response time should focus on the "Action" (your personal technical decisions) and "Result" (concrete business/performance impact). Avoid vague plural terms like "we decided".',
    relevanceScore: 0.90,
  },
  {
    id: 'fintech-reliability-standards',
    title: 'Fintech & High-Throughput Engineering Standards',
    source: 'Fintech Engineering Guild Specifications',
    category: 'Hiring Rubric',
    snippet: 'For Fintech engineering roles, candidates must demonstrate awareness of distributed locks (Redlock), double-entry bookkeeping ledgers, optimistic concurrency control, and idempotency keys to prevent duplicate payments.',
    relevanceScore: 0.89,
  }
];

/**
 * Hybrid Vector + BM25 Lexical Search Simulator
 */
export function queryRAGKnowledge(query: string, topK: number = 3): {
  documents: RAGKnowledgeDoc[];
  topConfidence: number;
} {
  const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);

  const scoredDocs = KNOWLEDGE_CORPUS.map((doc) => {
    let score = 0;
    const docText = `${doc.title} ${doc.snippet} ${doc.category}`.toLowerCase();

    // Lexical match
    queryTokens.forEach((token) => {
      if (docText.includes(token)) {
        score += 1.5;
      }
    });

    // Semantic category matching
    if (query.toLowerCase().includes('resume') && doc.category === 'ATS Guide') score += 3.0;
    if (query.toLowerCase().includes('interview') && (doc.category === 'Interview Transcript' || doc.category === 'Hiring Rubric')) score += 3.0;
    if (query.toLowerCase().includes('system') || query.toLowerCase().includes('backend')) {
      if (doc.category === 'System Design' || doc.category === 'Hiring Rubric') score += 2.5;
    }
    if (query.toLowerCase().includes('dsa') || query.toLowerCase().includes('leetcode')) {
      if (doc.category === 'DSA Syllabus') score += 3.5;
    }

    return {
      ...doc,
      relevanceScore: Math.min(0.99, Number((0.65 + score * 0.05).toFixed(2))),
    };
  });

  scoredDocs.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const selected = scoredDocs.slice(0, topK);

  return {
    documents: selected,
    topConfidence: selected[0]?.relevanceScore ?? 0.85,
  };
}

/**
 * RAG Career Coach Response Generator with Grounded Source Citations
 */
export function generateCoachResponse(
  userQuery: string,
  userProfile?: { name: string; targetRole: string; cgpa: number; codeSignalScore: number; resumeAtsScore: number }
): {
  reply: string;
  sources: { title: string; sourceDoc: string; category: string }[];
} {
  const { documents } = queryRAGKnowledge(userQuery, 2);
  const target = userProfile?.targetRole || 'Fullstack Software Engineer';
  const name = userProfile?.name || 'Vibhas';

  const queryLower = userQuery.toLowerCase();

  let reply = '';
  if (queryLower.includes('resume') || queryLower.includes('ats')) {
    reply = `Based on our verified ATS optimization standards, your current resume score is ${userProfile?.resumeAtsScore || 68}/100. To pass corporate screening for ${target} roles:
1. Reframe project bullet points using the **XYZ Formula** ("Accomplished [X] measured by [Y] doing [Z]").
2. Specify your tech stack latency, QPS, or scale numbers rather than generic descriptions.
3. Ensure exact keyword coverage for core competencies like Docker, Redis, and PostgreSQL.`;
  } else if (queryLower.includes('interview') || queryLower.includes('mock') || queryLower.includes('behavioral')) {
    reply = `According to Tier-1 hiring rubrics, top candidates structure their technical narratives strictly via the **STAR method**:
- Spend 70% of your explanation detailing the **Action** (specific algorithms, trade-offs, and failure handling you personally implemented).
- Quantify the **Result** (e.g. "Reduced API response times by 35% and decreased memory footprint").
- Be prepared to discuss edge cases and scale limits of every technology listed on your profile.`;
  } else if (queryLower.includes('dsa') || queryLower.includes('leetcode') || queryLower.includes('code signal')) {
    reply = `To push your Code Signal rating above the competitive 700 threshold for ${target} positions:
- Focus on the high-yield placement patterns: **Sliding Window**, **Monotonic Stacks**, **Graph Topological Sort**, and **0/1 Knapsack DP**.
- Always discuss Time and Space complexity ($O(N)$ vs $O(N \\log N)$) before writing a single line of code in the interview.`;
  } else {
    reply = `Hello ${name}. For your target role of **${target}**, our intelligence engine recommends focusing on high-ROI milestones:
1. **System & Project Depth:** Ensure at least one project has automated CI/CD and public cloud deployment (adds +8% to your placement probability).
2. **Algorithmic Signal:** Target 150+ medium-level problems on core data structures.
3. **Resume ATS Alignment:** Elevate your resume impact score to >80/100.

What specific area would you like to deep-dive into today?`;
  }

  const sources = documents.map((d) => ({
    title: d.title,
    sourceDoc: d.source,
    category: d.category,
  }));

  return { reply, sources };
}
