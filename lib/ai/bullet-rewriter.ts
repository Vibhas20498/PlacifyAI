/**
 * PlacifyAI - Intelligent Bullet Point Rewriter
 * Powered by Google Gemini AI API (or OpenAI/Groq) with intelligent, zero-placeholder fallback.
 * Strictly generates 100% complete, ready-to-paste, ATS-optimized accomplishment statements.
 */

export interface AIBulletRewriteResult {
  original: string;
  correctedBullet: string;
  actionVerb: string;
  metricAdded: string;
  whyItWorked: string;
  scoreGain: string;
  aiProvider: 'gemini' | 'openai' | 'groq' | 'intelligent-engine';
}

interface RewriteOptions {
  targetRole?: string;
  apiKey?: string;
  skills?: string[];
}

/**
 * Resolves the active AI API key from parameter or environment variables
 */
export function getActiveAIKey(userKey?: string): { key: string; provider: 'gemini' | 'openai' | 'groq' | 'none' } {
  if (userKey && userKey.trim().length > 10) {
    if (userKey.startsWith('AIza')) return { key: userKey.trim(), provider: 'gemini' };
    if (userKey.startsWith('sk-') || userKey.startsWith('sk-proj-')) return { key: userKey.trim(), provider: 'openai' };
    if (userKey.startsWith('gsk_')) return { key: userKey.trim(), provider: 'groq' };
    return { key: userKey.trim(), provider: 'gemini' };
  }

  const envGemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (envGemini) return { key: envGemini.trim(), provider: 'gemini' };

  const envOpenAI = process.env.OPENAI_API_KEY;
  if (envOpenAI) return { key: envOpenAI.trim(), provider: 'openai' };

  const envGroq = process.env.GROQ_API_KEY;
  if (envGroq) return { key: envGroq.trim(), provider: 'groq' };

  return { key: '', provider: 'none' };
}

/**
 * Rewrites a single bullet point using Google Gemini AI, OpenAI, Groq, or zero-placeholder fallback engine
 */
export async function rewriteBulletWithAI(
  bullet: string,
  options: RewriteOptions = {}
): Promise<AIBulletRewriteResult> {
  const trimmed = bullet.trim().replace(/^[-•*–—\d\.\)]+\s*/, '').trim();
  const targetRole = options.targetRole || 'Software Engineer';
  const { key, provider } = getActiveAIKey(options.apiKey);

  if (key && provider === 'gemini') {
    try {
      const geminiResult = await callGeminiAIBulletRewrite(trimmed, targetRole, key);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('[Gemini AI Bullet Rewrite Warning - falling back to Intelligent Engine]:', err);
    }
  } else if (key && provider === 'openai') {
    try {
      const openaiResult = await callOpenAIBulletRewrite(trimmed, targetRole, key);
      if (openaiResult) return openaiResult;
    } catch (err) {
      console.warn('[OpenAI Bullet Rewrite Warning - falling back to Intelligent Engine]:', err);
    }
  } else if (key && provider === 'groq') {
    try {
      const groqResult = await callGroqAIBulletRewrite(trimmed, targetRole, key);
      if (groqResult) return groqResult;
    } catch (err) {
      console.warn('[Groq AI Bullet Rewrite Warning - falling back to Intelligent Engine]:', err);
    }
  }

  // Guaranteed fallback: high-caliber, zero-placeholder accomplishment synthesizer
  return synthesizeCorrectedBullet(trimmed, targetRole);
}

/**
 * Batch rewrites multiple bullets concurrently using AI
 */
export async function batchRewriteBulletsWithAI(
  bullets: string[],
  options: RewriteOptions = {}
): Promise<AIBulletRewriteResult[]> {
  const promises = bullets.map((b) => rewriteBulletWithAI(b, options));
  return Promise.all(promises);
}

/**
 * Google Gemini 1.5/2.0 Flash API Call
 */
async function callGeminiAIBulletRewrite(
  bullet: string,
  targetRole: string,
  apiKey: string
): Promise<AIBulletRewriteResult | null> {
  const prompt = `You are an elite Staff Technical Recruiter and ATS Resume Specialist.
The candidate is targeting the role: "${targetRole}".

Transform this weak resume bullet point into a powerful, ATS-optimized accomplishment statement with quantified metrics and clear engineering impact.

Original Bullet:
"${bullet}"

MANDATORY RULES:
1. Output the EXACT, 100% COMPLETE, READY-TO-PASTE corrected bullet point.
2. NEVER use placeholders such as [insert metric], [specify impact], [add number], or brackets.
3. If the original bullet lacks metrics, INFER realistic, mathematically plausible engineering metrics based on the technology and scope (e.g. "cutting latency by 38%", "supporting 1,500+ active users", "achieving 99.9% uptime", "improving query throughput by 2.5x", "processing 40,000+ daily events").
4. Begin with a powerful past-tense action verb (Architected, Engineered, Formulated, Automated, Optimized, Scaled, Streamlined).
5. Front-load the technical stack and engineering approach.
6. Keep it concise, punchy (20–30 words, 1-2 lines), and confident.
7. Return ONLY a single raw JSON object with no markdown formatting or backticks:
{
  "correctedBullet": "Your complete rewritten bullet statement here without any placeholders",
  "actionVerb": "The strong verb used",
  "metricAdded": "The metric or outcome added",
  "whyItWorked": "Brief explanation of why this increases ATS score"
}`;

  // Try gemini-1.5-flash first, fallback to gemini-2.0-flash
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gemini ${model} HTTP ${response.status}]:`, errorText);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed.correctedBullet && !parsed.correctedBullet.includes('[')) {
        return {
          original: bullet,
          correctedBullet: parsed.correctedBullet.trim(),
          actionVerb: parsed.actionVerb || 'Architected',
          metricAdded: parsed.metricAdded || 'Quantified outcome and scale',
          whyItWorked: parsed.whyItWorked || 'Framed using impact-driven accomplishment structure with concrete technical impact.',
          scoreGain: '+8 pts',
          aiProvider: 'gemini',
        };
      }
    } catch (err) {
      console.warn(`[Gemini API model ${model} error]:`, err);
    }
  }

  return null;
}

/**
 * OpenAI GPT-4o-mini API Call
 */
async function callOpenAIBulletRewrite(
  bullet: string,
  targetRole: string,
  apiKey: string
): Promise<AIBulletRewriteResult | null> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an elite Technical Recruiter and ATS specialist. Return ONLY a single raw JSON object with keys: correctedBullet, actionVerb, metricAdded, whyItWorked. Output the complete accomplishment statement with zero placeholders.',
        },
        {
          role: 'user',
          content: `Rewrite this resume bullet point for a ${targetRole} target role into a 100% complete accomplishment statement with inferred metrics: "${bullet}"`,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  return {
    original: bullet,
    correctedBullet: parsed.correctedBullet.trim(),
    actionVerb: parsed.actionVerb || 'Architected',
    metricAdded: parsed.metricAdded || 'Quantified outcome and scale',
    whyItWorked: parsed.whyItWorked || 'Aligned with impact-driven accomplishment framework.',
    scoreGain: '+8 pts',
    aiProvider: 'openai',
  };
}

/**
 * Groq / Llama-3.3-70B API Call
 */
async function callGroqAIBulletRewrite(
  bullet: string,
  targetRole: string,
  apiKey: string
): Promise<AIBulletRewriteResult | null> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an elite Technical Recruiter. You return only valid JSON with keys: correctedBullet, actionVerb, metricAdded, whyItWorked. Never use placeholders.',
        },
        {
          role: 'user',
          content: `Rewrite this resume bullet for a ${targetRole} into a complete accomplishment statement with real inferred metrics: "${bullet}"`,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  const parsed = JSON.parse(content);
  return {
    original: bullet,
    correctedBullet: parsed.correctedBullet,
    actionVerb: parsed.actionVerb || 'Architected',
    metricAdded: parsed.metricAdded || 'Performance metric',
    whyItWorked: parsed.whyItWorked || 'Aligned with impact-driven accomplishment framework.',
    scoreGain: '+8 pts',
    aiProvider: 'groq',
  };
}

/**
 * Intelligent Deterministic Engine
 * Guarantees zero placeholders: dynamically infers domain context, extracts subjects,
 * front-loads active verbs, and synthesizes 100% complete metric clauses.
 */
export function synthesizeCorrectedBullet(
  bullet: string,
  targetRole: string = 'Software Engineer'
): AIBulletRewriteResult {
  const trimmed = bullet.trim().replace(/^[-•*–—\d\.\)]+\s*/, '').trim();
  const lower = trimmed.toLowerCase();

  // Strip weak passive phrases and redundant gerund openers
  let cleaned = trimmed
    .replace(/^(?:i\s+|we\s+)?(?:worked\s+on|responsible\s+for|helped\s+with|assisted\s+in|tasked\s+with|participated\s+in|was\s+involved\s+in|was\s+part\s+of|handled|did|made|built|created|set\s+up|wrote|used|utilized|developed|implemented)\s+(?:a\s+|an\s+|the\s+)?/i, '')
    .replace(/^(?:building|creating|developing|implementing|making|designing|deploying|managing|writing|testing|fixing|maintaining|monitoring)\s+(?:a\s+|an\s+|the\s+)?/i, '')
    .replace(/^(?:i\s+|we\s+|a\s+|an\s+|the\s+)/i, '')
    .trim();

  const baseSubject = cleaned.length > 5 ? cleaned : trimmed;

  // Domain detection
  const isDataOrML = /data|machine learning|deep learning|model|dataset|analytics|python|sql|pandas|pytorch|tensorflow|scikit|bi|dashboard|power bi|tableau/i.test(lower) || targetRole.toLowerCase().includes('data');
  const isDevopsCloud = /docker|kubernetes|aws|cloud|ci\/cd|pipeline|deploy|nginx|linux|github actions|jenkins|terraform/i.test(lower);
  const isDatabase = /database|postgres|mysql|mongodb|redis|query|queries|indexing|table|crud/i.test(lower);
  const isFrontend = /react|next|ui|ux|frontend|tailwind|css|html|javascript|typescript|responsive|component|redux/i.test(lower);
  const isSecurityAuth = /auth|authentication|jwt|oauth|security|encryption|token|role-based|rbac/i.test(lower);

  let strongVerb = 'Architected';
  let metricClause = 'improving system responsiveness by 35% and supporting 1,500+ daily active users';
  let metricSummary = '35% latency improvement & 1,500+ users';

  if (isDatabase) {
    strongVerb = 'Optimized';
    metricClause = 'cutting database query response latency from 320ms to 45ms across 50,000+ indexed records';
    metricSummary = 'Query time cut from 320ms to 45ms';
  } else if (isSecurityAuth) {
    strongVerb = 'Architected';
    metricClause = 'enforcing zero-trust role-based access control with sub-40ms token verification for 3,000+ users';
    metricSummary = 'Sub-40ms authentication & 3,000+ users';
  } else if (isDevopsCloud) {
    strongVerb = 'Automated';
    metricClause = 'reducing staging-to-production build cycle time by 55% and sustaining 99.95% cloud service availability';
    metricSummary = '55% faster release cycle & 99.95% uptime';
  } else if (isDataOrML) {
    strongVerb = targetRole.toLowerCase().includes('data') ? 'Formulated' : 'Engineered';
    metricClause = 'achieving 93.8% validation accuracy and accelerating automated data inference throughput by 2.8x';
    metricSummary = '93.8% validation accuracy & 2.8x throughput';
  } else if (isFrontend) {
    strongVerb = 'Engineered';
    metricClause = 'elevating Lighthouse performance scores to 96+ and cutting initial page load times by 42%';
    metricSummary = 'Lighthouse score 96+ & 42% faster load';
  } else {
    strongVerb = 'Architected';
    metricClause = 'cutting API response latency by 38% and reliably handling 20,000+ daily requests';
    metricSummary = '38% latency cut & 20k+ daily requests';
  }

  // Format subject casing
  let formattedSubject = baseSubject.replace(/[.;,]+$/, '');
  const firstWord = formattedSubject.split(/\s+/)[0] || '';
  const isAcronym = /^[A-Z]{2,}/.test(firstWord);
  if (!isAcronym && formattedSubject.length > 0) {
    formattedSubject = formattedSubject.charAt(0).toLowerCase() + formattedSubject.slice(1);
  }

  const correctedBullet = `${strongVerb} ${formattedSubject}, ${metricClause}.`
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/\.\.+/g, '.')
    .trim();

  return {
    original: trimmed,
    correctedBullet,
    actionVerb: strongVerb,
    metricAdded: metricSummary,
    whyItWorked: `Replaced passive phrasing with action verb "${strongVerb}" and backed with quantifiable scale to prove tangible engineering impact.`,
    scoreGain: '+7 pts',
    aiProvider: 'intelligent-engine',
  };
}
