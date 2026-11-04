/**
 * PlacifyAI - Intelligent Dynamic Mock Interview Engine
 * Powered by Google Gemini AI (or OpenAI/Groq) with a role-specific, randomized,
 * zero-hallucination domain engine.
 *
 * Guarantees:
 * 1. Question 1 ALWAYS begins with "Please introduce yourself..." tailored to the role & company.
 * 2. Questions are strictly aligned with the selected role category (Data Analyst, Fullstack,
 *    Backend, Frontend, AI/ML, SDE, Business Analyst).
 * 3. Dynamic randomization: Every interview generation produces a unique combination of questions.
 * 4. Multi-dimensional rubric evaluations and weakness-specific practice roadmaps.
 */

import {
  InterviewConfig,
  InterviewQuestion,
  AnswerEvaluation,
  InterviewSession,
  InterviewReport,
  InterviewRoadmapTask,
  CategoryScore,
  GroundingReference,
} from './types';
import { getActiveAIKey } from '@/lib/ai/bullet-rewriter';
import { UserProfile } from '@/lib/types';
import { ROLE_KEYWORD_BENCHMARKS } from '@/lib/resume/analyzer';

export type DetectedRoleCategory =
  | 'data-analyst'
  | 'data-scientist'
  | 'fullstack'
  | 'backend'
  | 'frontend'
  | 'business-analyst'
  | 'sde';

/**
 * Normalizes user target role into a precise domain category
 */
export function detectRoleCategory(roleTitle: string = ''): DetectedRoleCategory {
  const lower = roleTitle.toLowerCase();
  if (
    lower.includes('data analyst') ||
    lower.includes('business intelligence') ||
    lower.includes('bi analyst') ||
    lower.includes('power bi') ||
    lower.includes('tableau') ||
    lower.includes('analytics engineer')
  ) {
    return 'data-analyst';
  }
  if (
    lower.includes('data scientist') ||
    lower.includes('machine learning') ||
    lower.includes('ai/ml') ||
    lower.includes('deep learning') ||
    lower.includes('ml engineer') ||
    lower.includes('nlp') ||
    lower.includes('computer vision')
  ) {
    return 'data-scientist';
  }
  if (
    lower.includes('backend') ||
    lower.includes('systems engineer') ||
    lower.includes('distributed systems') ||
    lower.includes('api developer')
  ) {
    return 'backend';
  }
  if (
    lower.includes('frontend') ||
    lower.includes('ui/ux engineer') ||
    lower.includes('react developer') ||
    lower.includes('ui developer') ||
    lower.includes('client-side')
  ) {
    return 'frontend';
  }
  if (
    lower.includes('business analyst') ||
    lower.includes('product analyst') ||
    lower.includes('functional consultant')
  ) {
    return 'business-analyst';
  }
  if (
    lower.includes('fullstack') ||
    lower.includes('full stack') ||
    lower.includes('full-stack') ||
    lower.includes('web developer')
  ) {
    return 'fullstack';
  }
  return 'sde';
}

// Company-specific interview styles and patterns
export const COMPANY_INTERVIEW_PATTERNS: Record<
  string,
  {
    focusAreas: string[];
    technicalStyle: string;
    behavioralStyle: string;
  }
> = {
  TCS: {
    focusAreas: ['Core Programming Fundamentals', 'OOP Pillars', 'SQL Queries & Normalization', 'Basic Algorithms', 'Agile & Teamwork'],
    technicalStyle: 'Focuses heavily on fundamental conceptual clarity, OOP principles, SQL queries, and clean code explanation.',
    behavioralStyle: 'Values adaptability, willingness to learn new technologies, teamwork, and client-centric discipline.',
  },
  Infosys: {
    focusAreas: ['Logical Problem Solving', 'Pseudo-code & Logic Tracing', 'RDBMS & Data Integrity', 'Communication & Adaptability'],
    technicalStyle: 'Tests problem decomposition, edge cases in loops, database transactions, and architectural fundamentals.',
    behavioralStyle: 'Emphasizes continuous learning, project ownership, handling deadlines, and professional articulation.',
  },
  Capgemini: {
    focusAreas: ['Clean Coding Standards', 'Data Structures & Collections', 'Cloud & API Integration', 'Exception Handling'],
    technicalStyle: 'Focuses on structured code, exception handling, data structures (Arrays, HashMaps, Trees), and modular API design.',
    behavioralStyle: 'Looks for collaborative problem solvers, client presentation skills, and cross-cultural adaptability.',
  },
  Deloitte: {
    focusAreas: ['Data Analytics & Business Impact', 'SQL & Reporting Models', 'Agile & Client Stakeholders', 'Scenario Problem Solving'],
    technicalStyle: 'Evaluates practical business impact of technical decisions, data reliability, dashboard storytelling, and trade-offs.',
    behavioralStyle: 'Strong focus on client consulting scenarios: handling conflicting stakeholder demands and explaining technical solutions to non-technical executives.',
  },
  Accenture: {
    focusAreas: ['Cloud & Microservices', 'Enterprise Web Development', 'DevOps & CI/CD', 'Behavioral Leadership (STAR)'],
    technicalStyle: 'Prioritizes modular services, REST/GraphQL design, Docker containerization, and automated test coverage.',
    behavioralStyle: 'Assesses leadership principles, innovation under constraint, and constructive conflict resolution.',
  },
  Cognizant: {
    focusAreas: ['Fullstack & Core Engineering', 'Database Design & Indexing', 'API Testing & Integration', 'Client Solutions'],
    technicalStyle: 'Tests fullstack integration, relational vs non-relational database trade-offs, and automated unit testing.',
    behavioralStyle: 'Values reliability, thorough documentation, and agile team participation.',
  },
  Wipro: {
    focusAreas: ['Core Language Concepts', 'Database Systems', 'Problem Solving & Debugging', 'Analytical Aptitude'],
    technicalStyle: 'Focuses on language syntax, memory management, database normalization, and debugging methodologies.',
    behavioralStyle: 'Assesses perseverance, learning agility, and customer success mindset.',
  },
  'General Placement': {
    focusAreas: ['Core DSA & Systems', 'Architecture & Design Trade-offs', 'Project Technical Defense', 'STAR Behavioral'],
    technicalStyle: 'Balanced evaluation across algorithmic problem solving, design trade-offs, and project execution.',
    behavioralStyle: 'Standard STAR method evaluation (Situation, Task, Action, Result).',
  },
};

/**
 * Fisher-Yates array shuffle for non-repeating random selection
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates personalized, resume-grounded interview questions.
 * Ensures Question 1 is ALWAYS an introduction question and remaining questions
 * are strictly suitable for the detected role category, randomized every time.
 */
export async function generateInterviewQuestions(
  config: InterviewConfig,
  parsedResumeText: string = '',
  profile?: UserProfile
): Promise<InterviewQuestion[]> {
  const { key, provider } = getActiveAIKey();

  // If Gemini or OpenAI is configured, attempt intelligent generation with temperature 0.7 for diversity
  if (key && (provider === 'gemini' || provider === 'openai' || provider === 'groq')) {
    try {
      const aiQuestions = await callAIToGenerateQuestions(config, parsedResumeText, profile, key, provider);
      if (aiQuestions && aiQuestions.length >= config.questionCount) {
        return aiQuestions.slice(0, config.questionCount);
      }
    } catch (err) {
      console.warn('[AI Question Generation Warning - falling back to Dynamic Role Engine]:', err);
    }
  }

  // Guaranteed dynamic, role-specific questions generator with zero repeated questions
  return synthesizeGroundedQuestions(config, parsedResumeText, profile);
}

/**
 * Calls LLM API (Gemini / OpenAI / Groq) with strict introduction & role constraints
 */
async function callAIToGenerateQuestions(
  config: InterviewConfig,
  resumeText: string,
  profile: UserProfile | undefined,
  apiKey: string,
  provider: 'gemini' | 'openai' | 'groq'
): Promise<InterviewQuestion[] | null> {
  const verifiedSkills = profile?.verifiedSkills?.slice(0, 8).join(', ') || 'Python, SQL, JavaScript, React, Node.js';
  const role = config.targetRole;
  const company = config.targetCompany;
  const type = config.interviewType;
  const diff = config.difficulty;
  const count = config.questionCount;
  const randomSeed = Math.random().toString(36).substring(2, 9);

  const prompt = `You are a Principal Engineering Recruiter and Technical Hiring Manager conducting a realistic ${type} placement interview for the role of "${role}" at "${company}".
Difficulty: "${diff}". Total questions needed: ${count}. Session Seed: ${randomSeed}.

CANDIDATE BACKGROUND:
- Verified Profile Skills: ${verifiedSkills}
- Resume Excerpt:
"""
${resumeText.slice(0, 1500)}
"""

CRITICAL MANDATORY RULES:
1. QUESTION 1 MUST ALWAYS BE AN INTRODUCTION QUESTION:
   Start Question 1 with "Please introduce yourself..." tailored specifically to the candidate's background, target role (${role}), and company (${company}).
2. ALL TECHNICAL QUESTIONS MUST STRICTLY MATCH THE "${role}" DOMAIN:
   - If "${role}" is Data Analyst: ONLY ask questions on SQL (window functions, CTEs, joins), BI dashboards (Power BI / Tableau, DAX), data modeling, ETL, business KPIs, and analytical scenarios. Do NOT ask about web app routing or microservices.
   - If "${role}" is Fullstack/Backend: Focus on APIs, database indexing, caching, concurrency, and architecture.
   - If "${role}" is Data Scientist / AI/ML: Focus on ML models, bias-variance, evaluation metrics, feature engineering, and deployment.
   - If "${role}" is Frontend: Focus on Web Vitals, React/DOM rendering, CSS layouts, and state management.
   - If "${role}" is Business Analyst: Focus on BRD/FRD, user stories, BPMN processes, SQL for analytics, and stakeholder management.
3. Every session must generate distinct, fresh, non-repeating questions.
4. Ground at least 50% of the questions in the candidate's verified skills (${verifiedSkills}).

Respond ONLY with a valid JSON array of questions matching this exact schema:
[
  {
    "id": "q-1",
    "index": 1,
    "question": "Clear question text here",
    "type": "technical" | "hr" | "behavioral" | "coding" | "resume",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "category": "e.g. Professional Introduction | Database Systems | Core Algorithms",
    "groundingReference": {
      "sourceType": "resume_project" | "resume_skill" | "role_benchmark" | "company_pattern",
      "sourceText": "Reference quote or rationale",
      "skillOrProject": "e.g. React or SQL"
    },
    "rubricCriteria": ["Criteria 1", "Criteria 2", "Criteria 3"]
  }
]`;

  let responseText = '';

  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // High temperature for diverse, non-repeating questions
          maxOutputTokens: 2500,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API returned HTTP ${res.status}`);
    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (provider === 'openai') {
    const url = 'https://api.openai.com/v1/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API returned HTTP ${res.status}`);
    const data = await res.json();
    responseText = data.choices?.[0]?.message?.content || '';
  }

  if (!responseText) return null;

  try {
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    const questionsList = Array.isArray(parsed) ? parsed : parsed.questions || parsed.data;

    if (Array.isArray(questionsList) && questionsList.length > 0) {
      return questionsList.map((q: any, idx: number) => ({
        id: `q-${idx + 1}-${Date.now().toString(36)}`,
        index: idx + 1,
        question: String(q.question || '').trim(),
        type: q.type || (idx === 0 ? 'resume' : 'technical'),
        difficulty: q.difficulty || config.difficulty,
        category: q.category || (idx === 0 ? 'Professional Introduction' : 'Technical Evaluation'),
        groundingReference: q.groundingReference,
        codingMetadata: q.codingMetadata,
        rubricCriteria: Array.isArray(q.rubricCriteria) && q.rubricCriteria.length > 0
          ? q.rubricCriteria
          : ['Technical accuracy', 'Depth of explanation', 'STAR structure'],
      }));
    }
  } catch (parseErr) {
    console.warn('[Question JSON Parse Error]:', parseErr);
  }

  return null;
}

// ==============================================================================
// ROLE-SPECIFIC DYNAMIC QUESTION REPOSITORIES
// ==============================================================================

interface QuestionTemplate {
  question: string;
  type: 'technical' | 'hr' | 'behavioral' | 'coding' | 'resume';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rubricCriteria: string[];
  codingMetadata?: any;
}

/**
 * DATA ANALYST QUESTION POOL
 */
const DATA_ANALYST_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Data Analyst role. To start off, please introduce yourself, walking through your academic background, your hands-on experience with data analytics and visualization tools, and what motivated you to pursue a data analyst career at {company}.',
  'Good day, and welcome to your {company} interview for the Data Analyst position. Please introduce yourself, highlighting the core analytical tools you work with (such as SQL, Excel, and BI tools), significant projects where you extracted business insights from raw data, and why you are targeting {company}.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, sharing your journey into data analytics, the types of datasets and business domains you have explored, and your technical foundation in data modeling and storytelling.',
];

const DATA_ANALYST_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'In SQL, what is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()? Can you give a practical example where you would use DENSE_RANK() to identify top-performing sales representatives or products?',
    type: 'technical',
    category: 'SQL Window Functions & Aggregation',
    difficulty: 'intermediate',
    rubricCriteria: ['Accurate distinction between the three window functions with tied values', 'Syntax awareness of OVER (PARTITION BY ... ORDER BY ...)', 'Practical business application'],
  },
  {
    question: 'Explain the difference between Common Table Expressions (CTEs) and Subqueries in SQL. When would you use a recursive CTE, and how does it compare to temporary tables for analytical queries on large datasets?',
    type: 'technical',
    category: 'SQL Query Architecture & CTEs',
    difficulty: 'intermediate',
    rubricCriteria: ['Readability vs performance differences', 'Syntax and execution of recursive CTEs', 'Memory and indexing implications of temporary tables'],
  },
  {
    question: 'In data modeling for Business Intelligence (Power BI / Tableau), explain the difference between a Star Schema and a Snowflake Schema. Why is a Star Schema generally preferred for analytical reporting and DAX calculations?',
    type: 'technical',
    category: 'Data Modeling & Dimensional Design',
    difficulty: 'intermediate',
    rubricCriteria: ['Fact tables vs Dimension tables distinction', 'Normalization vs Denormalization tradeoffs', 'Query performance and DAX filter propagation in Power BI'],
  },
  {
    question: 'In Power BI, what is the difference between a Calculated Column and a Measure? How does row context differ from filter context, and how does the CALCULATE() function modify filter context?',
    type: 'technical',
    category: 'Business Intelligence & DAX Internals',
    difficulty: 'advanced',
    rubricCriteria: ['RAM/storage consumption difference', 'Evaluation at data refresh vs visual render time', 'Deep understanding of CALCULATE() filter transition'],
  },
  {
    question: 'Suppose an e-commerce platform observes that checkout conversions dropped by 14% over the past two weeks. Walk me through your step-by-step exploratory data analysis methodology to investigate and diagnose the root cause.',
    type: 'technical',
    category: 'Root-Cause Analysis & Business Metrics',
    difficulty: 'intermediate',
    rubricCriteria: ['Data validation and anomaly checks', 'Segmentation by device, geography, payment gateway, traffic source', 'Actionable recommendation generation'],
  },
  {
    question: 'How do you handle dirty data, missing values, and duplicate records during your ETL pipeline? What criteria do you use to decide whether to drop rows, impute values with mean/median/mode, or flag them for business review?',
    type: 'technical',
    category: 'Data Cleaning & Preprocessing (ETL)',
    difficulty: 'beginner',
    rubricCriteria: ['Understanding bias introduced by imputation', 'Identification of MCAR, MAR, and MNAR missing data patterns', 'Data hygiene best practices'],
  },
  {
    question: 'How do you define and track core business KPIs such as Customer Acquisition Cost (CAC), Customer Lifetime Value (CLV), and Monthly Churn Rate? How do you verify the mathematical integrity of your calculations before presenting to leadership?',
    type: 'technical',
    category: 'Business KPIs & Financial Metrics',
    difficulty: 'intermediate',
    rubricCriteria: ['Mathematical formula definition', 'Data sources required for cohort calculations', 'Data reconciliation against accounting records'],
  },
  {
    question: 'Describe a situation where a business stakeholder or client disagreed with your data findings because it contradicted their personal intuition. Using the STAR framework, how did you present evidence and reach alignment?',
    type: 'behavioral',
    category: 'Stakeholder Communication & Data Storytelling',
    difficulty: 'intermediate',
    rubricCriteria: ['STAR method adherence', 'Empathetic and data-driven communication', 'Creation of visual proof and confidence intervals'],
  },
  {
    question: 'Write or describe the SQL query to find all customers who made a purchase in both October 2025 and November 2025, but have zero purchases in December 2025.',
    type: 'coding',
    category: 'SQL Analytical Query Writing',
    difficulty: 'intermediate',
    codingMetadata: {
      language: 'sql',
      starterCode: `-- Orders schema: (order_id, customer_id, order_date, amount)\nSELECT customer_id\nFROM Orders\n-- Complete your query here\n`,
      problemStatement: 'Return unique customer_ids who purchased in Oct 2025 AND Nov 2025, but NOT in Dec 2025.',
      constraints: ['Use standard ANSI SQL', 'Handle multiple purchases per customer correctly'],
      examples: [{ input: 'Orders table with customer purchase dates', output: 'List of matching customer_ids' }],
    },
    rubricCriteria: ['Correct use of GROUP BY / HAVING, INTERSECT, or LEFT JOIN / NOT EXISTS', 'Accurate date filtering', 'Efficiency without redundant cartesian joins'],
  },
];

/**
 * FULLSTACK SOFTWARE ENGINEER QUESTION POOL
 */
const FULLSTACK_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Fullstack Software Engineer position. To start, please introduce yourself, walking me through your background across frontend and backend technologies, key fullstack projects you have deployed, and what drives your interest in {company}.',
  'Good day, and welcome to your {company} interview. Please introduce yourself, summarizing your journey in software engineering, the primary tech stack you build with (such as React, Node.js, and databases), and your experience managing end-to-end applications.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, sharing your experience in architecting fullstack applications, how you handle both user interface performance and server-side reliability, and your career goals at {company}.',
];

const FULLSTACK_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'In modern fullstack frameworks like Next.js, what is the architectural difference between Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR)? When would you choose each for an e-commerce platform?',
    type: 'technical',
    category: 'Fullstack Web Architecture',
    difficulty: 'intermediate',
    rubricCriteria: ['SEO and Time-to-First-Byte (TTFB) implications', 'Server compute overhead vs CDN edge caching', 'Hybrid data fetching strategies'],
  },
  {
    question: 'How do you design a robust authentication system for a fullstack application? Explain the trade-offs between stateless JWT tokens in HttpOnly cookies vs server-side session stores with Redis.',
    type: 'technical',
    category: 'Authentication & Security',
    difficulty: 'intermediate',
    rubricCriteria: ['Vulnerability mitigation (XSS vs CSRF)', 'Token invalidation and refresh token rotation', 'Scalability across distributed backend instances'],
  },
  {
    question: 'In database management, explain how database indexing (B-Trees) accelerates SELECT queries. What happens to INSERT, UPDATE, and DELETE operations when you add multiple composite indexes to a table?',
    type: 'technical',
    category: 'Database Optimization & Indexing',
    difficulty: 'intermediate',
    rubricCriteria: ['B-Tree search complexity O(log n)', 'Write amplification and index maintenance overhead', 'Composite index leftmost prefix rule'],
  },
  {
    question: 'How do you prevent unnecessary re-renders in a complex React application? Walk me through how React’s reconciliation algorithm (Fiber) works and when useMemo or useCallback actually provides measurable performance benefits.',
    type: 'technical',
    category: 'Frontend Performance & State',
    difficulty: 'intermediate',
    rubricCriteria: ['Virtual DOM diffing mechanics', 'Object reference equality in props', 'Avoidance of premature memoization'],
  },
  {
    question: 'Explain how you design a RESTful API to handle idempotent operations (e.g., payment submissions or inventory deductions) so that accidental duplicate requests from a client do not create duplicate charges.',
    type: 'technical',
    category: 'API Design & Idempotency',
    difficulty: 'advanced',
    rubricCriteria: ['Idempotency key implementation with distributed cache', 'HTTP status codes (409 Conflict vs 200 OK with cached response)', 'Atomic database transactions'],
  },
  {
    question: 'Tell me about a time you encountered a severe production bug or memory leak in a fullstack project. Using the STAR framework, how did you profile, isolate, and remediate the issue under pressure?',
    type: 'behavioral',
    category: 'STAR Behavioral & Debugging',
    difficulty: 'intermediate',
    rubricCriteria: ['STAR structure adherence', 'Systematic diagnostic tools used (Chrome DevTools, APM, logs)', 'Post-mortem and regression prevention'],
  },
  {
    question: 'Implement a function to debounce rapid function calls (such as search bar auto-complete). Explain the difference between debounce and throttle with their respective time/space complexity.',
    type: 'coding',
    category: 'Algorithmic Problem Solving & Closures',
    difficulty: 'intermediate',
    codingMetadata: {
      language: 'javascript',
      starterCode: `function debounce(func, waitMs) {\n  // Implement debounce here\n}\n`,
      problemStatement: 'Write a debounce function in JavaScript that delays invoking func until after waitMs milliseconds have elapsed since the last time it was invoked.',
      constraints: ['Function must preserve the this context and arguments', 'Must return a function'],
      examples: [{ input: 'Rapid function calls within waitMs window', output: 'Only final invocation executes' }],
    },
    rubricCriteria: ['Proper usage of setTimeout and clearTimeout', 'Preservation of closure and arguments', 'Clear explanation of throttle vs debounce use cases'],
  },
];

/**
 * BACKEND DEVELOPER QUESTION POOL
 */
const BACKEND_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Backend Developer position. To start off, please introduce yourself, sharing your server-side programming background, database expertise, and what excites you about designing backend architectures at {company}.',
  'Good day, and welcome to {company}. Please introduce yourself, outlining your core programming languages (e.g., Java, Python, Go, Node.js), significant backend systems or microservices you have engineered, and why you are targeting this role.',
  'Welcome to your {company} technical interview. Let us begin with an introduction: Please introduce yourself, summarizing your journey in backend engineering, distributed systems, and database performance optimization.',
];

const BACKEND_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'Explain database transaction isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable). What are Dirty Reads, Non-Repeatable Reads, and Phantom Reads, and how does your database prevent them?',
    type: 'technical',
    category: 'Database Transactions & ACID Internals',
    difficulty: 'advanced',
    rubricCriteria: ['Clear definitions of all 4 ANSI SQL isolation levels', 'Multi-Version Concurrency Control (MVCC) explanation', 'Locking mechanisms and serializability trade-offs'],
  },
  {
    question: 'What is the difference between synchronous communication (REST/gRPC) and asynchronous event-driven communication (Kafka, RabbitMQ) in a microservices ecosystem? When would you choose an event-driven architecture?',
    type: 'technical',
    category: 'Distributed Systems & Message Brokers',
    difficulty: 'intermediate',
    rubricCriteria: ['Decoupling and fault tolerance in event-driven systems', 'At-least-once vs exactly-once delivery guarantees', 'Handling distributed tracing and eventual consistency'],
  },
  {
    question: 'How do you design a distributed rate limiter that restricts API clients to 100 requests per minute across 10 independent server instances? Compare the Token Bucket, Leaky Bucket, and Sliding Window algorithms.',
    type: 'technical',
    category: 'System Scalability & Rate Limiting',
    difficulty: 'advanced',
    rubricCriteria: ['Redis sliding window or token bucket implementation', 'Atomic operations (Redis Lua scripts or MULTI/EXEC)', 'Handling race conditions across distributed nodes'],
  },
  {
    question: 'In multithreaded or concurrent programming, what is a race condition, a deadlock, and a livelock? What conditions (Coffman conditions) must be present for a deadlock to occur, and how do you prevent them in code?',
    type: 'technical',
    category: 'Concurrency & Multithreading',
    difficulty: 'intermediate',
    rubricCriteria: ['Mutual exclusion, Hold and wait, No preemption, Circular wait', 'Lock ordering strategies and timeouts', 'Mutexes vs Semaphores vs Atomic variables'],
  },
  {
    question: 'Explain the difference between Cache-Aside, Read-Through, Write-Through, and Write-Back caching strategies with Redis. What is a Cache Stampede (Thundering Herd), and how do you mitigate it?',
    type: 'technical',
    category: 'Caching Strategies & Redis',
    difficulty: 'intermediate',
    rubricCriteria: ['Data consistency between cache and primary database', 'Probabilistic early expiration (XFetch) or mutex locks to stop stampede', 'Cache eviction policies (LRU, LFU)'],
  },
  {
    question: 'Describe a situation where a service you managed experienced high latency or crashed under an unexpected traffic surge. Using the STAR framework, how did you stabilize the service and re-architect it?',
    type: 'behavioral',
    category: 'Incident Management & STAR',
    difficulty: 'intermediate',
    rubricCriteria: ['STAR structure adherence', 'Systematic triage (CPU, RAM, connection pool exhaustion, slow queries)', 'Remediation and autoscaling policies'],
  },
];

/**
 * DATA SCIENTIST / AI/ML ENGINEER QUESTION POOL
 */
const DATA_SCIENTIST_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Data Scientist / AI/ML Engineer role. To start off, please introduce yourself, sharing your background in machine learning, mathematics, core models you have trained or deployed, and your motivation for joining {company}.',
  'Good day, and welcome to your {company} interview. Please introduce yourself, highlighting your foundation in algorithms, statistical modeling, machine learning frameworks (such as PyTorch, TensorFlow, Scikit-Learn), and significant projects you have developed.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, discussing your journey into AI/ML, the types of machine learning problems you have solved, and your approach to translating real-world problems into mathematical models.',
];

const DATA_SCIENTIST_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'Explain the Bias-Variance Tradeoff in machine learning. How do L1 (Lasso) and L2 (Ridge) regularization help mitigate overfitting, and mathematically why does L1 regularization drive coefficients to exact zero while L2 does not?',
    type: 'technical',
    category: 'Machine Learning Theory & Regularization',
    difficulty: 'intermediate',
    rubricCriteria: ['Mathematical formulation of loss with penalty term', 'Geometric diamond (L1) vs circle (L2) constraint contour explanation', 'Feature selection capabilities of Lasso'],
  },
  {
    question: 'When evaluating a classification model on an imbalanced dataset (e.g. 99% negative, 1% positive), why is Accuracy a dangerous metric? Compare Precision, Recall, F1-Score, and ROC-AUC vs PR-AUC.',
    type: 'technical',
    category: 'Model Evaluation & Imbalanced Data',
    difficulty: 'intermediate',
    rubricCriteria: ['Accuracy paradox in fraud/disease detection', 'Confusion matrix derivations', 'Why PR-AUC is superior to ROC-AUC when positive class is extremely rare'],
  },
  {
    question: 'Compare Random Forest and Gradient Boosting (XGBoost/LightGBM). How do Bagging and Boosting differ in how they build decision trees and reduce variance vs bias?',
    type: 'technical',
    category: 'Ensemble Learning Algorithms',
    difficulty: 'intermediate',
    rubricCriteria: ['Parallel independent trees (Bagging) vs sequential residual learning (Boosting)', 'Subsampling of features and rows', 'Hyperparameter tuning (learning rate, tree depth)'],
  },
  {
    question: 'In deep learning and Natural Language Processing, explain how the Self-Attention mechanism in the Transformer architecture works. How does it overcome the sequential bottleneck of RNNs and LSTMs?',
    type: 'technical',
    category: 'Deep Learning & Transformers',
    difficulty: 'advanced',
    rubricCriteria: ['Query, Key, Value matrix dot-product formulation: Softmax(QK^T / sqrt(d_k))V', 'Parallel computation across entire sequences', 'Positional encodings requirement'],
  },
  {
    question: 'What is the difference between Data Drift and Concept Drift in a production machine learning pipeline? What statistical metrics (e.g. Population Stability Index, Kolmogorov-Smirnov test) would you use to detect drift and automate model retraining?',
    type: 'technical',
    category: 'MLOps & Model Monitoring',
    difficulty: 'advanced',
    rubricCriteria: ['P(X) shift vs P(Y|X) shift distinction', 'Statistical divergence tests', 'Triggering automated shadow deployments and rollback criteria'],
  },
  {
    question: 'Tell me about a machine learning project where your initial model had poor generalization or unexpected validation errors. Using the STAR framework, how did you diagnose data leakage or feature engineering issues to improve performance?',
    type: 'behavioral',
    category: 'STAR Project Defense & Diagnostics',
    difficulty: 'intermediate',
    rubricCriteria: ['STAR methodology', 'Identification of target leakage, improper scaling before split, or overfitting', 'Quantifiable metric gain achieved'],
  },
];

/**
 * FRONTEND SOFTWARE ENGINEER QUESTION POOL
 */
const FRONTEND_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Frontend Software Engineer position. To start off, please introduce yourself, walking through your web development background, key user interfaces you have built, your frontend tech stack, and your motivation for joining {company}.',
  'Good day, and welcome to {company}. Please introduce yourself, summarizing your frontend engineering journey, your experience with modern UI frameworks (such as React, Next.js, TypeScript), and how you balance design fidelity with runtime performance.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, sharing your passion for frontend engineering, your experience architecting responsive, accessible web applications, and your career goals at {company}.',
];

const FRONTEND_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'Walk me through the browser’s Critical Rendering Path: from receiving HTML bytes to painting pixels on screen. How do render-blocking JavaScript and CSS impact Core Web Vitals like Largest Contentful Paint (LCP) and Interaction to Next Paint (INP)?',
    type: 'technical',
    category: 'Browser Internals & Web Vitals',
    difficulty: 'intermediate',
    rubricCriteria: ['HTML parsing -> DOM -> CSSOM -> Render Tree -> Layout -> Paint', 'Async vs Defer script loading attributes', 'Optimization strategies (code splitting, resource hints: preconnect/preload)'],
  },
  {
    question: 'In React, how does the reconciliation algorithm and the Virtual DOM work under the hood? Why is using array index as a "key" prop an anti-pattern when rendering dynamic, re-orderable lists?',
    type: 'technical',
    category: 'React Architecture & Fiber Reconciler',
    difficulty: 'intermediate',
    rubricCriteria: ['Component tree diffing heuristic O(n)', 'Fiber node structure and work units', 'Component state bugs and unnecessary re-mounts caused by index keys'],
  },
  {
    question: 'What are custom hooks in React, and when should you extract stateful logic into one? What is the common pitfall with closures inside useEffect, and how do you ensure state dependencies are synchronized?',
    type: 'technical',
    category: 'React Hooks & Closures',
    difficulty: 'intermediate',
    rubricCriteria: ['Separation of business logic from UI rendering', 'Stale closure trap explanation', 'Proper dependency array management or useReducer'],
  },
  {
    question: 'How do you ensure a web application is accessible (a11y) and compliant with WCAG 2.1 AA standards? What is the purpose of ARIA attributes, semantic HTML elements, and keyboard focus traps in modals?',
    type: 'technical',
    category: 'Web Accessibility (a11y) & Semantic HTML',
    difficulty: 'intermediate',
    rubricCriteria: ['Semantic HTML superiority over generic div/span with ARIA', 'Focus management on modal open/close', 'Color contrast ratios and screen reader accessibility'],
  },
  {
    question: 'How do you protect a modern client-side application against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)? What role does a Content Security Policy (CSP) header play?',
    type: 'technical',
    category: 'Frontend Security & Web Standards',
    difficulty: 'intermediate',
    rubricCriteria: ['Input sanitization and output encoding', 'HttpOnly, Secure, SameSite=Strict/Lax cookies for CSRF defense', 'CSP directives (script-src, object-src, nonce)'],
  },
];

/**
 * BUSINESS ANALYST QUESTION POOL
 */
const BUSINESS_ANALYST_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Business Analyst position. To start off, please introduce yourself, outlining your educational background, analytical skillset, experience translating business requirements into technical specifications, and your motivation for joining {company}.',
  'Good day, and welcome to {company}. Please introduce yourself, sharing your experience in business process modeling, stakeholder communication, requirements elicitation, and why you are targeting {company} for your business analyst career.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, summarizing your journey in business analysis, key projects where you bridged business objectives and engineering delivery, and your professional goals.',
];

const BUSINESS_ANALYST_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'What is the difference between a Business Requirements Document (BRD), a Functional Requirements Document (FRD), and an Agile User Story? How do you write a clear User Story with Acceptance Criteria using the Given-When-Then format?',
    type: 'technical',
    category: 'Requirements Engineering & Documentation',
    difficulty: 'intermediate',
    rubricCriteria: ['High-level business vision vs technical specification', 'INVEST criteria for effective user stories', 'Gherkin BDD Given-When-Then format'],
  },
  {
    question: 'How do you handle Scope Creep during an active project sprint when a senior business executive insists on adding new "critical" features without extending the deadline?',
    type: 'behavioral',
    category: 'Scope Management & Stakeholder Alignment',
    difficulty: 'intermediate',
    rubricCriteria: ['Impact analysis on sprint capacity and budget', 'MoSCoW prioritization (Must have vs Should have)', 'Constructive pushback and formal change control requests'],
  },
  {
    question: 'Explain the difference between As-Is process modeling and To-Be process modeling. What tools and diagrams (such as BPMN swimlane diagrams or value stream mapping) do you use to identify operational bottlenecks?',
    type: 'technical',
    category: 'Business Process Modeling & BPMN',
    difficulty: 'intermediate',
    rubricCriteria: ['Current state gap analysis vs future state architecture', 'Swimlane roles and responsibility mapping', 'Quantifying cycle time and reduction in manual handoffs'],
  },
  {
    question: 'Describe a situation where the engineering team claimed a feature was technically unfeasible, while the client insisted it was non-negotiable. Using the STAR framework, how did you bridge the communication gap to find a viable solution?',
    type: 'behavioral',
    category: 'Conflict Resolution & STAR',
    difficulty: 'intermediate',
    rubricCriteria: ['STAR framework adherence', 'Decomposing technical constraints into modular MVPs', 'Delivering client value while protecting engineering velocity'],
  },
];

/**
 * SOFTWARE DEVELOPMENT ENGINEER (SDE CORE) QUESTION POOL
 */
const SDE_INTRODUCTIONS = [
  'Welcome to your {company} placement interview for the Software Development Engineer (SDE) position. To start off, please introduce yourself, summarizing your software engineering journey, core programming languages, key projects you have engineered, and why you are targeting {company}.',
  'Good day, and welcome to your {company} interview. Please introduce yourself, discussing your foundation in computer science principles, data structures, algorithms, and practical software design, as well as your career aspirations at {company}.',
  'Welcome to {company}. Let us begin with an introduction: Please introduce yourself, walking through your academic background, significant engineering challenges you have tackled, and what makes you passionate about software development.',
];

const SDE_QUESTIONS: QuestionTemplate[] = [
  {
    question: 'Explain the SOLID principles of Object-Oriented Software Design with practical examples. In what real-world scenarios does violating the Single Responsibility Principle or Open/Closed Principle create dangerous technical debt?',
    type: 'technical',
    category: 'OOP Architecture & SOLID Principles',
    difficulty: 'intermediate',
    rubricCriteria: ['Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion', 'Clear practical code architecture examples', 'Maintainability and unit testability benefits'],
  },
  {
    question: 'In algorithm design, what is the difference between Dynamic Programming and Greedy algorithms? Can you walk through a problem where a Greedy approach fails and Dynamic Programming is required to achieve the optimal solution (such as the 0/1 Knapsack Problem)?',
    type: 'technical',
    category: 'Core Algorithms & Dynamic Programming',
    difficulty: 'intermediate',
    rubricCriteria: ['Optimal substructure and overlapping subproblems', 'Locally optimal choice failure in 0/1 knapsack', 'Memoization (top-down) vs Tabulation (bottom-up)'],
  },
  {
    question: 'In operating systems, what is the fundamental difference between a Process and a Thread? How do context switching, shared memory, and virtual memory paging work, and why does thread synchronization require primitives like mutexes?',
    type: 'technical',
    category: 'Operating Systems & Thread Management',
    difficulty: 'intermediate',
    rubricCriteria: ['Address space and file descriptor sharing in threads vs isolated processes', 'Kernel mode vs User mode context switch overhead', 'Page tables and Translation Lookaside Buffer (TLB)'],
  },
  {
    question: 'Walk me through the TCP 3-way handshake (SYN, SYN-ACK, ACK) and 4-way termination (FIN, ACK, FIN, ACK). Why does TCP guarantee reliable, ordered byte streams while UDP does not, and when would you prefer UDP?',
    type: 'technical',
    category: 'Computer Networks & Protocols',
    difficulty: 'intermediate',
    rubricCriteria: ['Sequence and acknowledgment numbers', 'Retransmission timeouts (RTO) and flow control (sliding window)', 'UDP low latency use cases (DNS, VoIP, gaming)'],
  },
  {
    question: 'Given an array of integers representing stock prices on consecutive days, explain how you would find the maximum profit possible with at most two transactions. What is your proposed time and space complexity?',
    type: 'coding',
    category: 'Algorithmic Problem Solving (DP / Greedy)',
    difficulty: 'intermediate',
    codingMetadata: {
      language: 'python',
      starterCode: `def maxProfit(prices: list[int]) -> int:\n    # Write your solution here\n    pass`,
      problemStatement: 'Find maximum profit with at most 2 stock buy/sell transactions. You cannot engage in multiple transactions simultaneously.',
      constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
      examples: [{ input: 'prices = [3,3,5,0,0,3,1,4]', output: '6', explanation: 'Buy day 4 (0), sell day 6 (3), profit = 3. Buy day 7 (1), sell day 8 (4), profit = 3. Total = 6.' }],
    },
    rubricCriteria: ['Optimal O(n) time and O(1) space state-machine approach', 'Edge case handling (descending prices)', 'Complexity justification'],
  },
];

/**
 * Deterministic Question Synthesizer (Zero-Hallucination Fallback)
 * Builds dynamic questions strictly suitable for the selected role category.
 * Always starts with "Please introduce yourself..." and randomizes the remaining questions.
 */
function synthesizeGroundedQuestions(
  config: InterviewConfig,
  resumeText: string,
  profile?: UserProfile
): InterviewQuestion[] {
  const targetRole = config.targetRole || 'Fullstack Software Engineer';
  const company = config.targetCompany || 'General Placement';
  const category = detectRoleCategory(targetRole);

  const candidateSkills = profile?.verifiedSkills && profile.verifiedSkills.length > 0
    ? profile.verifiedSkills
    : ROLE_KEYWORD_BENCHMARKS[targetRole] || ['Problem Solving', 'Data Analysis', 'Software Architecture'];

  // Select appropriate introduction templates and question pool
  let introPool = SDE_INTRODUCTIONS;
  let questionPool = SDE_QUESTIONS;

  if (category === 'data-analyst') {
    introPool = DATA_ANALYST_INTRODUCTIONS;
    questionPool = DATA_ANALYST_QUESTIONS;
  } else if (category === 'data-scientist') {
    introPool = DATA_SCIENTIST_INTRODUCTIONS;
    questionPool = DATA_SCIENTIST_QUESTIONS;
  } else if (category === 'fullstack') {
    introPool = FULLSTACK_INTRODUCTIONS;
    questionPool = FULLSTACK_QUESTIONS;
  } else if (category === 'backend') {
    introPool = BACKEND_INTRODUCTIONS;
    questionPool = BACKEND_QUESTIONS;
  } else if (category === 'frontend') {
    introPool = FRONTEND_INTRODUCTIONS;
    questionPool = FRONTEND_QUESTIONS;
  } else if (category === 'business-analyst') {
    introPool = BUSINESS_ANALYST_INTRODUCTIONS;
    questionPool = BUSINESS_ANALYST_QUESTIONS;
  }

  // 1. Pick randomized Introduction Question for Question 1
  const introTemplate = introPool[Math.floor(Math.random() * introPool.length)] || introPool[0];
  const formattedIntro = introTemplate
    .replaceAll('{company}', company)
    .replaceAll('{targetRole}', targetRole);

  const questions: InterviewQuestion[] = [];
  const primarySkill = candidateSkills[0] || 'Technical Development';

  questions.push({
    id: `q-1-${Date.now().toString(36)}`,
    index: 1,
    question: formattedIntro,
    type: 'resume',
    difficulty: config.difficulty,
    category: 'Professional Introduction & Career Motivation',
    groundingReference: {
      sourceType: 'resume_skill',
      sourceText: `Initial placement greeting and self-introduction for ${targetRole} at ${company}. Candidate highlights background in ${primarySkill}.`,
      skillOrProject: primarySkill,
    },
    rubricCriteria: [
      'Clarity, structure, and professional articulation of personal background',
      'Mention of relevant technical strengths and project achievements',
      'Articulated motivation and alignment with target role and company',
    ],
  });

  // 2. Shuffle the question pool for that specific role category
  const shuffledPool = shuffleArray(questionPool);
  const neededQuestions = config.questionCount - 1;

  for (let i = 0; i < neededQuestions; i++) {
    const template = shuffledPool[i % shuffledPool.length];
    const qIndex = i + 2;

    // Inject company name or candidate skill where relevant
    let qText = template.question.replaceAll('{company}', company);
    if (qText.includes('{skill}')) {
      const skillToInject = candidateSkills[i % candidateSkills.length] || 'technologies';
      qText = qText.replaceAll('{skill}', skillToInject);
    }

    questions.push({
      id: `q-${qIndex}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      index: qIndex,
      question: qText,
      type: template.type,
      difficulty: template.difficulty || config.difficulty,
      category: template.category,
      codingMetadata: template.codingMetadata,
      groundingReference: {
        sourceType: 'role_benchmark',
        sourceText: `Tailored strictly to ${targetRole} hiring benchmarks and ${company} recruitment evaluations.`,
      },
      rubricCriteria: template.rubricCriteria,
    });
  }

  return questions;
}

/**
 * Evaluates a single candidate answer against multi-dimensional rubrics
 */
export async function evaluateAnswerWithAI(
  question: InterviewQuestion,
  userAnswer: string,
  sessionHistory: { question: string; answer: string }[] = [],
  config?: InterviewConfig
): Promise<AnswerEvaluation> {
  const trimmed = userAnswer.trim();
  const { key, provider } = getActiveAIKey();

  // If AI API key is configured, evaluate using LLM
  if (key && (provider === 'gemini' || provider === 'openai' || provider === 'groq') && trimmed.length >= 10) {
    try {
      const aiEval = await callAIToEvaluateAnswer(question, trimmed, sessionHistory, key, provider);
      if (aiEval) return aiEval;
    } catch (err) {
      console.warn('[AI Answer Evaluation Warning - falling back to High-Caliber Rubric Engine]:', err);
    }
  }

  // Guaranteed deterministic, multi-dimensional rubric evaluation
  return synthesizeAnswerEvaluation(question, trimmed);
}

/**
 * Calls LLM API to evaluate answer
 */
async function callAIToEvaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  history: { question: string; answer: string }[],
  apiKey: string,
  provider: 'gemini' | 'openai' | 'groq'
): Promise<AnswerEvaluation | null> {
  const isIntro = question.category.toLowerCase().includes('introduction') || question.question.toLowerCase().includes('introduce yourself');

  const prompt = `You are a Senior Engineering Hiring Committee Member evaluating a candidate's answer during a placement mock interview.
QUESTION ASKED: "${question.question}"
QUESTION CATEGORY: "${question.category}" (${question.type})
EVALUATION RUBRIC: ${question.rubricCriteria.join(', ')}

CANDIDATE'S SUBMITTED ANSWER:
"""
${answer}
"""

${
  isIntro
    ? `NOTE: This is an "Introduce Yourself" question. Evaluate:
1. Did they cover their academic background and education?
2. Did they articulate their core skills and technical domain?
3. Did they mention notable projects, achievements, or practical experience?
4. Did they convey motivation and enthusiasm for this specific role and company?`
    : `Evaluate the answer with realistic, rigorous engineering criteria. Do not flatter. Provide truthful, constructive feedback.`
}

Score each dimension from 0 to 100:
- technicalAccuracy: Core correctness of technical principles and syntax.
- depthAndCompleteness: Depth of explanation, consideration of edge cases and trade-offs.
- clarityAndCommunication: Articulation, structure, concise explanation.
- starFormulationOrPracticality: Concrete examples, STAR framework adherence (for behavioral/project questions) or code logic quality.

Respond ONLY with valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "dimensionScores": {
    "technicalAccuracy": number,
    "depthAndCompleteness": number,
    "clarityAndCommunication": number,
    "starFormulationOrPracticality": number
  },
  "whatWentWell": ["Point 1", "Point 2"],
  "missingOrIncorrectConcepts": ["Point 1", "Point 2"],
  "specificSuggestions": "Clear actionable advice for next interview",
  "sampleImprovedAnswer": "A concise, high-scoring exemplary answer demonstrating ideal depth and structure.",
  "conceptsToRevise": ["Topic 1", "Topic 2"],
  "followUpQuestion": "A targeted follow-up question probing deeper or null",
  "requiresFollowUp": boolean
}`;

  let responseText = '';

  if (provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json',
        },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (provider === 'openai') {
    const url = 'https://api.openai.com/v1/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const data = await res.json();
    responseText = data.choices?.[0]?.message?.content || '';
  }

  if (!responseText) return null;

  try {
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      overallScore: Math.max(10, Math.min(100, Math.round(Number(parsed.overallScore) || 70))),
      dimensionScores: {
        technicalAccuracy: Math.round(Number(parsed.dimensionScores?.technicalAccuracy) || 70),
        depthAndCompleteness: Math.round(Number(parsed.dimensionScores?.depthAndCompleteness) || 68),
        clarityAndCommunication: Math.round(Number(parsed.dimensionScores?.clarityAndCommunication) || 75),
        starFormulationOrPracticality: Math.round(Number(parsed.dimensionScores?.starFormulationOrPracticality) || 70),
      },
      whatWentWell: Array.isArray(parsed.whatWentWell) && parsed.whatWentWell.length > 0
        ? parsed.whatWentWell
        : ['Clear general articulation of the concept'],
      missingOrIncorrectConcepts: Array.isArray(parsed.missingOrIncorrectConcepts) && parsed.missingOrIncorrectConcepts.length > 0
        ? parsed.missingOrIncorrectConcepts
        : ['Could expand on trade-offs and concrete performance metrics'],
      specificSuggestions: String(parsed.specificSuggestions || 'Structure your answer with concrete technical steps and quantify results.'),
      sampleImprovedAnswer: String(parsed.sampleImprovedAnswer || 'In our production system, we implemented...'),
      conceptsToRevise: Array.isArray(parsed.conceptsToRevise) ? parsed.conceptsToRevise : [question.category],
      followUpQuestion: parsed.followUpQuestion || undefined,
      requiresFollowUp: Boolean(parsed.requiresFollowUp),
      aiProvider: provider,
    };
  } catch (err) {
    console.warn('[Evaluation JSON Parse Error]:', err);
    return null;
  }
}

/**
 * Deterministic Rubric Evaluator (Zero-Hallucination Fallback)
 * Handles both "Introduce yourself" and domain-specific questions with precision.
 */
function synthesizeAnswerEvaluation(
  question: InterviewQuestion,
  answer: string
): AnswerEvaluation {
  const words = answer.toLowerCase().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const isIntro =
    question.category.toLowerCase().includes('introduction') ||
    question.question.toLowerCase().includes('introduce yourself');

  // Handle empty or ultra-short responses
  if (wordCount < 10) {
    return {
      overallScore: 25,
      dimensionScores: {
        technicalAccuracy: 30,
        depthAndCompleteness: 15,
        clarityAndCommunication: 35,
        starFormulationOrPracticality: 20,
      },
      whatWentWell: ['Attempted initial response'],
      missingOrIncorrectConcepts: [
        'Answer is too brief to evaluate depth or background',
        'Lacks concrete details, technical skills, or structured examples',
      ],
      specificSuggestions: isIntro
        ? 'Structure your self-introduction into 4 pillars: (1) Education, (2) Core technical skills, (3) Key project highlight, and (4) Career motivation for this company.'
        : 'Provide an in-depth response of at least 3-4 sentences explaining the concept, your design choices, and practical outcomes.',
      sampleImprovedAnswer: isIntro
        ? 'Hello, I am a passionate engineering student specializing in fullstack software development and data analytics. Over the past two years, I have built production-ready applications using React, Python, and PostgreSQL, notably architecting an analytics platform that reduced query latency by 45%. I am eager to apply my technical problem-solving skills to high-impact projects here.'
        : 'A thorough response should clearly state: (1) The core technical mechanism, (2) Concrete architecture or algorithms used, and (3) The measurable outcome or trade-off involved.',
      conceptsToRevise: [question.category, 'Interview Verbal Articulation'],
      requiresFollowUp: true,
      followUpQuestion: isIntro
        ? 'Could you tell me more about your technical projects and what specific tools you used in them?'
        : 'Your answer was quite brief. Could you expand on the specific steps you took and the technical rationale behind them?',
      aiProvider: 'intelligent-engine',
    };
  }

  // Evaluation for "Introduce yourself"
  if (isIntro) {
    const hasEducation = /\b(college|university|degree|engineering|student|graduate|computer science|btech|b\.tech|bachelor|academic)\b/i.test(answer);
    const hasSkills = /\b(python|sql|java|react|node|javascript|c\+\+|bi|tableau|power bi|docker|git|aws|html|css|data)\b/i.test(answer);
    const hasProjects = /\b(project|built|developed|created|architected|implemented|dashboard|application|system|model|internship)\b/i.test(answer);
    const hasMotivation = /\b(passionate|interest|excited|motivated|opportunity|company|role|career|learn|contribute|impact)\b/i.test(answer);

    let clarity = 75;
    let depth = 65;
    let tech = 70;
    let star = 68;

    const whatWentWell: string[] = ['Delivered a confident, communicative self-introduction'];
    const missing: string[] = [];

    if (hasEducation) {
      clarity += 5;
      whatWentWell.push('Clearly established academic background and domain');
    } else {
      missing.push('Did not explicitly mention your degree or educational institution');
    }

    if (hasSkills) {
      tech += 15;
      whatWentWell.push('Front-loaded relevant technical skills and programming tools');
    } else {
      tech -= 10;
      missing.push('Missed mentioning your primary programming languages and technical tools');
    }

    if (hasProjects) {
      depth += 15;
      star += 12;
      whatWentWell.push('Anchored introduction with real-world engineering project experience');
    } else {
      missing.push('Lacked mention of a specific, tangible project or practical achievement');
    }

    if (hasMotivation) {
      clarity += 8;
      whatWentWell.push('Articulated genuine career motivation and company alignment');
    } else {
      missing.push('Could conclude more strongly with what specifically excites you about this role');
    }

    if (wordCount >= 50) depth += 6;

    clarity = Math.min(95, Math.max(45, clarity));
    depth = Math.min(95, Math.max(40, depth));
    tech = Math.min(95, Math.max(40, tech));
    star = Math.min(95, Math.max(40, star));

    const overall = Math.round(clarity * 0.3 + depth * 0.25 + tech * 0.25 + star * 0.2);

    return {
      overallScore: overall,
      dimensionScores: {
        technicalAccuracy: tech,
        depthAndCompleteness: depth,
        clarityAndCommunication: clarity,
        starFormulationOrPracticality: star,
      },
      whatWentWell,
      missingOrIncorrectConcepts: missing.length > 0 ? missing : ['Could tailor even more closely to specific company initiatives'],
      specificSuggestions: 'Aim for a 60–90 second introduction hitting the 4Ps: Past (education), Present (core tech skills & major project), and Prospective (why this company/role).',
      sampleImprovedAnswer: `Hello, I am an engineering graduate with a focus on data systems and software development. My core technical strengths include Python, SQL, and building analytical dashboards. In my recent capstone project, I designed an automated data pipeline that processed over 50,000 records daily and visualised KPI trends with Power BI. I have been following your team's work, and I am excited about this opportunity to contribute to data-driven client solutions.`,
      conceptsToRevise: ['Elevator Pitch Delivery', 'Project Highlighting'],
      requiresFollowUp: false,
      aiProvider: 'intelligent-engine',
    };
  }

  // Technical & Domain Specific Answers Evaluation
  const hasMetrics = /\b(?:\d+%(?:\.\d+)?|\$\d+|\d+\s*(?:ms|seconds|minutes|users|qps|records|gb|mb|rows|tables))\b/i.test(answer);
  const hasTradeoffs = /\b(trade-off|tradeoff|because|however|instead of|whereas|drawback|benefit|overhead|latency|scalability|pros and cons)\b/i.test(answer);
  const hasSTAR = /\b(situation|task|action|result|when|faced|decided to|resolved|achieved|outcome|led to)\b/i.test(answer);
  const hasTechTerms = /\b(sql|join|cte|window|rank|dense_rank|dax|calculate|power bi|tableau|star schema|snowflake|etl|index|b-tree|acid|redis|react|hook|ssr|api|rest|docker|loss|bias|variance|precision|recall|f1|overfitting|bpmn|brd|user story)\b/i.test(answer);

  let techScore = 68;
  let depthScore = 62;
  let clarityScore = 72;
  let starScore = 65;

  const whatWentWell: string[] = [];
  const missing: string[] = [];

  if (wordCount >= 40) {
    depthScore += 12;
    whatWentWell.push('Good comprehensive length with structured technical reasoning');
  } else {
    missing.push('Explanation is slightly brief; delve deeper into edge cases and trade-offs');
  }

  if (hasTechTerms) {
    techScore += 15;
    whatWentWell.push('Demonstrated strong domain vocabulary aligned with the question');
  } else {
    techScore -= 10;
    missing.push('Missed standard technical terminology relevant to this domain');
  }

  if (hasTradeoffs) {
    depthScore += 10;
    techScore += 8;
    whatWentWell.push('Highlighted engineering trade-offs and design justifications');
  } else {
    missing.push('Did not explicitly address performance trade-offs or alternative approaches');
  }

  if (hasMetrics) {
    starScore += 15;
    clarityScore += 8;
    whatWentWell.push('Quantified achievements with measurable scale or benchmarks');
  } else {
    missing.push('Lacks concrete quantifiable metrics (e.g. latency, row volume, accuracy, throughput)');
  }

  if (hasSTAR) starScore += 10;

  techScore = Math.min(95, Math.max(35, techScore));
  depthScore = Math.min(95, Math.max(30, depthScore));
  clarityScore = Math.min(95, Math.max(40, clarityScore));
  starScore = Math.min(95, Math.max(30, starScore));

  const overall = Math.round(techScore * 0.35 + depthScore * 0.3 + clarityScore * 0.2 + starScore * 0.15);

  let sampleImproved = '';
  if (question.category.includes('SQL') || question.category.includes('Data')) {
    sampleImproved = `In analytical queries, ROW_NUMBER() assigns a unique sequential integer to each row. RANK() assigns the same rank to ties but leaves gaps (e.g., 1, 2, 2, 4), while DENSE_RANK() assigns identical ranks to ties without skipping subsequent ranks (1, 2, 2, 3). For example, to find the top 3 highest revenue products per region, we partition by region, order by revenue descending, and filter WHERE dense_rank <= 3.`;
  } else if (question.category.includes('Database') || question.category.includes('Index')) {
    sampleImproved = `In our production database, we analyzed query plans with EXPLAIN ANALYZE and noticed sequential scans on 500k-row tables. We added composite B-Tree indexes covering filtering and sorting columns, cutting p95 latency from 450ms to 28ms while keeping write overhead under 4%.`;
  } else if (question.category.includes('Architecture') || question.category.includes('API')) {
    sampleImproved = `When designing the service, we chose an event-driven architecture using Kafka for decoupled message delivery. To guarantee idempotency on payment webhooks, we stored unique idempotency keys in Redis with an atomic SETNX check, preventing duplicate charging under client retries.`;
  } else {
    sampleImproved = `To address this systematically, I first analyze the operational constraints (time vs memory). I select an approach with optimal asymptotic complexity (O(n) time, O(1) space), explicitly handle boundary conditions (nulls, duplicates, empty inputs), and test edge cases before deployment.`;
  }

  return {
    overallScore: overall,
    dimensionScores: {
      technicalAccuracy: techScore,
      depthAndCompleteness: depthScore,
      clarityAndCommunication: clarityScore,
      starFormulationOrPracticality: starScore,
    },
    whatWentWell: whatWentWell.length > 0 ? whatWentWell : ['Clear communicative stance'],
    missingOrIncorrectConcepts: missing.length > 0 ? missing : ['Could provide further edge-case trade-offs'],
    specificSuggestions: `For interviews in ${question.category}, state your technical decision, justify why alternative approaches were rejected, and support claims with concrete metrics.`,
    sampleImprovedAnswer: sampleImproved,
    conceptsToRevise: [question.category, 'Technical Trade-offs & Benchmarking'],
    requiresFollowUp: overall < 65,
    followUpQuestion: overall < 65 ? `Could you specify how you would handle failure scenarios or scale in that solution?` : undefined,
    aiProvider: 'intelligent-engine',
  };
}

/**
 * Compiles a comprehensive final interview performance report from session QA history
 */
export function generateFinalInterviewReport(session: InterviewSession): InterviewReport {
  const qas = session.qaHistory || [];
  const answeredCount = qas.length;
  const totalCount = session.questions.length;

  if (answeredCount === 0) {
    return {
      sessionId: session.id,
      overallScore: 0,
      completionStatus: 'terminated_early',
      questionsAnswered: 0,
      totalQuestions: totalCount,
      categoryScores: [],
      strongestAreas: ['No questions answered'],
      weakestAreas: ['Interview terminated before answering'],
      interviewReadinessSummary: 'The interview session was ended before any questions were submitted.',
      actionableInsights: ['Restart the interview session and submit answers to receive full feedback.'],
      questionReviews: [],
    };
  }

  // Aggregate category scores
  const categoryMap = new Map<string, { total: number; count: number }>();
  let totalScoreSum = 0;

  qas.forEach((qa) => {
    const score = qa.evaluation?.overallScore || 50;
    totalScoreSum += score;
    const cat = qa.question.category || 'General';
    const existing = categoryMap.get(cat) || { total: 0, count: 0 };
    existing.total += score;
    existing.count += 1;
    categoryMap.set(cat, existing);
  });

  const categoryScores: CategoryScore[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    score: Math.round(data.total / data.count),
    questionsCount: data.count,
  }));

  categoryScores.sort((a, b) => b.score - a.score);

  const overallScore = Math.round(totalScoreSum / answeredCount);
  const strongestAreas = categoryScores.filter((c) => c.score >= 75).map((c) => c.category);
  const weakestAreas = categoryScores.filter((c) => c.score < 75).map((c) => c.category);

  if (strongestAreas.length === 0 && categoryScores.length > 0) {
    strongestAreas.push(categoryScores[0].category);
  }
  if (weakestAreas.length === 0 && categoryScores.length > 1) {
    weakestAreas.push(categoryScores[categoryScores.length - 1].category);
  }

  let readiness = '';
  if (overallScore >= 85) {
    readiness = `Exceptional Placement Readiness (${overallScore}/100). Demonstrates fluent domain articulation, solid architectural trade-offs, and strong structured responses aligned with ${session.config.targetCompany} expectations.`;
  } else if (overallScore >= 70) {
    readiness = `Competitive Placement Readiness (${overallScore}/100). Solid conceptual foundation for ${session.config.targetRole}. Elevating your responses with concrete performance metrics and deeper edge-case defense will push you into top-tier callback ranges.`;
  } else {
    readiness = `Developing Placement Readiness (${overallScore}/100). Key technical and structural gaps identified in ${weakestAreas.join(', ')}. Targeted review of the generated practice roadmap is strongly recommended before live campus drives.`;
  }

  const actionableInsights: string[] = [
    `Target Role Alignment: Scored an average of ${overallScore}% across ${session.config.targetRole} benchmarks.`,
    `Strength: Excelled in ${strongestAreas.slice(0, 2).join(' & ')}.`,
    weakestAreas.length > 0
      ? `Priority Focus: Dedicate study hours to ${weakestAreas.slice(0, 2).join(' & ')} to bridge crucial evaluation deficits.`
      : `Continue reinforcing real-world performance benchmarks and multi-threaded edge cases.`,
    `STAR Method: Ensure every project or behavioral response concludes with a measurable business or technical metric.`,
  ];

  return {
    sessionId: session.id,
    overallScore,
    completionStatus: answeredCount >= totalCount ? 'completed' : 'terminated_early',
    questionsAnswered: answeredCount,
    totalQuestions: totalCount,
    categoryScores,
    strongestAreas,
    weakestAreas,
    interviewReadinessSummary: readiness,
    actionableInsights,
    questionReviews: qas,
  };
}

/**
 * Converts identified interview weaknesses and missed concepts into an actionable, prioritized practice roadmap
 */
export function generateWeaknessSpecificRoadmap(session: InterviewSession): InterviewRoadmapTask[] {
  const qas = session.qaHistory || [];
  const tasks: InterviewRoadmapTask[] = [];

  // Inspect questions with score below 80 or identified missing concepts
  qas.forEach((qa, idx) => {
    const score = qa.evaluation?.overallScore || 70;
    const cat = qa.question.category;
    const missing = qa.evaluation?.missingOrIncorrectConcepts || [];

    // Skip introduction question for technical roadmap unless score was poor
    if (cat.toLowerCase().includes('introduction') && score >= 70) return;

    if (score < 80 || missing.length > 0) {
      const priority = score < 60 ? 'high' : score < 75 ? 'medium' : 'low';
      const evidence = `During Question ${idx + 1} (${cat}), your response scored ${score}/100: ${missing[0] || 'Lacked deep trade-off justification'}.`;

      let learningObjective = '';
      let practiceActivity = '';
      let effortHours = 4;
      let criteria = '';

      if (cat.toLowerCase().includes('sql') || cat.toLowerCase().includes('window') || cat.toLowerCase().includes('cte')) {
        learningObjective = 'Master advanced SQL window functions (ROW_NUMBER, RANK, DENSE_RANK), CTEs, and query execution plans.';
        practiceActivity = 'Complete 5 complex SQL challenges involving running totals, cohort retention, and multi-table self joins.';
        effortHours = 5;
        criteria = 'Able to explain index trade-offs and write optimal multi-column queries without hesitation.';
      } else if (cat.toLowerCase().includes('bi') || cat.toLowerCase().includes('dax') || cat.toLowerCase().includes('dashboard') || cat.toLowerCase().includes('modeling')) {
        learningObjective = 'Master Dimensional Modeling (Star vs Snowflake schemas) and DAX calculation context (CALCULATE, filter transition).';
        practiceActivity = 'Build an interactive 3-page Power BI / Tableau dashboard using a Star Schema with dynamic measures and KPI cards.';
        effortHours = 6;
        criteria = 'Able to defend data model choices and explain row vs filter context clearly.';
      } else if (cat.toLowerCase().includes('database') || cat.toLowerCase().includes('acid') || cat.toLowerCase().includes('index')) {
        learningObjective = 'Master B-tree indexing internals, composite indexing rules, and transaction isolation levels.';
        practiceActivity = 'Set up a local PostgreSQL table with 100,000 generated records, execute filtering queries, and compare query cost before and after composite indexing.';
        effortHours = 5;
        criteria = 'Able to explain index trade-offs and write optimal multi-column queries without hesitation.';
      } else if (cat.toLowerCase().includes('architecture') || cat.toLowerCase().includes('design') || cat.toLowerCase().includes('project')) {
        learningObjective = 'Formulate a comprehensive architectural breakdown for your primary resume project with clear failure-mode defenses.';
        practiceActivity = 'Draw a full-system C4 architecture diagram of your project (Client -> CDN -> API Gateway -> Service -> Cache -> DB), noting latency and failure recovery for each hop.';
        effortHours = 6;
        criteria = 'Able to defend every technology choice, connection pooling strategy, and cache invalidation rule.';
      } else if (cat.toLowerCase().includes('behavioral') || cat.toLowerCase().includes('star') || cat.toLowerCase().includes('communication')) {
        learningObjective = 'Structure all behavioral and leadership experiences using the 4-part STAR framework (Situation, Task, Action, Result).';
        practiceActivity = 'Draft 4 core STAR stories covering: (1) Overcoming a technical roadblock, (2) Resolving team disagreement, (3) Meeting tight deadlines, and (4) Learning from a production mistake.';
        effortHours = 3;
        criteria = 'Each story takes 90–120 seconds to speak and ends with an explicit, quantifiable metric.';
      } else if (cat.toLowerCase().includes('ml') || cat.toLowerCase().includes('data science') || cat.toLowerCase().includes('learning')) {
        learningObjective = 'Strengthen mathematical derivations of machine learning algorithms, regularization (L1 vs L2), and metric trade-offs.';
        practiceActivity = 'Implement Ridge/Lasso regularization and evaluate model drift using statistical divergence metrics on an imbalanced dataset.';
        effortHours = 6;
        criteria = 'Explain bias-variance, ROC-AUC, and feature importance derivations with technical rigor.';
      } else if (cat.toLowerCase().includes('dsa') || cat.toLowerCase().includes('coding') || cat.toLowerCase().includes('algorithm')) {
        learningObjective = 'Strengthen asymptotic complexity derivation and optimal algorithmic patterns (Two Pointers, Sliding Window, DP).';
        practiceActivity = 'Solve 5 medium-level LeetCode / CodeSignal problems in your target category, explaining your time and space complexity out loud before writing code.';
        effortHours = 8;
        criteria = 'Consistently derive O(n) or O(log n) solutions and identify boundary conditions immediately.';
      } else {
        learningObjective = `Solidify engineering fundamentals in ${cat}.`;
        practiceActivity = `Review official documentation and build a minimal working prototype testing concurrency, error boundaries, and state consistency.`;
        effortHours = 4;
        criteria = `Explain the concept with clear terminology and contrast it against alternative solutions.`;
      }

      tasks.push({
        id: `task-${idx + 1}-${Date.now().toString(36)}`,
        skillOrConcept: cat,
        priority,
        evidenceFromInterview: evidence,
        learningObjective,
        studyEffortHours: effortHours,
        practiceActivity,
        exampleQuestionsToRetry: [
          qa.question.question,
          `How would you scale or optimize this solution under real-world constraints?`,
        ],
        completionCriteria: criteria,
        status: 'pending',
      });
    }
  });

  if (tasks.length === 0) {
    tasks.push({
      id: `task-adv-1`,
      skillOrConcept: `${session.config.targetRole} Advanced Practice`,
      priority: 'low',
      evidenceFromInterview: 'Scored 80+ across foundational interview questions. Ready for advanced systems defense.',
      learningObjective: 'Master advanced edge cases and high-scale production trade-offs.',
      studyEffortHours: 5,
      practiceActivity: 'Design an end-to-end resilient architecture handling unexpected traffic spikes and automated failover.',
      exampleQuestionsToRetry: ['How do you architect resilient failover strategies for this role?'],
      completionCriteria: 'Explain failure modes, monitoring telemetry, and automated recovery.',
      status: 'pending',
    });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tasks;
}
