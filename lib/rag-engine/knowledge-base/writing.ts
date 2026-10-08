import { RAGKnowledgeChunk } from '../types';

export const WRITING_KNOWLEDGE_CHUNKS: RAGKnowledgeChunk[] = [
  {
    id: 'writing-google-xyz-formula',
    category: 'Resume Writing',
    roleTarget: 'General',
    title: 'Google XYZ Bullet Structure Formula',
    topic: 'Bullet Point Architecture',
    content: `The gold standard for technical resume bullet points is Google's XYZ Formula: "Accomplished [X], as measured by [Y], by doing [Z]".
- [X]: The specific technical outcome or business milestone achieved.
- [Y]: The quantifiable metric, baseline comparison, or scale (e.g., latency ms, throughput QPS, accuracy %, active users).
- [Z]: The specific technologies, algorithms, architectural patterns, or methodologies employed.
Every bullet should open with a strong past-tense action verb and avoid passive phrasing like 'worked on' or 'helped with'.`,
    sampleWeakBullet: 'Worked on building a web application using React and Node.js.',
    sampleStrongBullet: 'Architected a responsive fullstack analytics dashboard using React, Node.js, and PostgreSQL, cutting API query latency by 45% for 12,000+ active users.',
    quantificationAdvice: 'Identify measurable outcomes such as response time reduction (ms), query throughput (QPS), test coverage (%), or user scale.',
    tags: ['xyz-formula', 'bullet-structure', 'action-verbs', 'metrics', 'star', 'car'],
  },
  {
    id: 'writing-action-verbs-taxonomy',
    category: 'Resume Writing',
    roleTarget: 'General',
    title: 'Power Action Verb Taxonomy for Engineers',
    topic: 'Action Verbs',
    content: `Open every project and experience bullet point with an assertive, specific execution verb. Categorize by technical domain:
- Architecture & Design: Architected, Engineered, Formulated, Designed, Constructed, Orchestrated.
- Optimization & Scale: Optimized, Accelerated, Streamlined, Scaled, Condensed, Refactored.
- Automation & DevOps: Automated, Deployed, Containerized, Integrated, Provisioned, Continuous.
- Leadership & Ownership: Spearheaded, Authored, Pioneered, Oversaw, Delivered.
Never use weak passive verbs: 'worked on', 'assisted in', 'helped with', 'responsible for', 'handled', 'did', 'tried to', 'made', 'looked into'.`,
    keyActionVerbs: [
      'Architected', 'Engineered', 'Optimized', 'Automated', 'Deployed',
      'Spearheaded', 'Formulated', 'Constructed', 'Refactored', 'Integrated'
    ],
    sampleWeakBullet: 'Was responsible for database queries and making them faster.',
    sampleStrongBullet: 'Optimized PostgreSQL database queries using composite B-tree indexing and Redis caching, cutting average lookup latency from 320ms to 45ms across 500,000+ records.',
    tags: ['action-verbs', 'power-verbs', 'weak-phrases', 'leadership', 'optimization'],
  },
  {
    id: 'writing-quantification-techniques',
    category: 'Quantification',
    roleTarget: 'General',
    title: 'Techniques for Quantifying Engineering Impact',
    topic: 'Quantification',
    content: `Resumes with numbers achieve 3.4x higher interview callback rates. If exact production telemetry is unavailable, quantify scale, dimension, or test results:
1. Speed & Latency: Response time reduction (ms), bundle size reduction (KB/MB), page load time (s), query speedup (%).
2. Scale & Volume: Number of database records processed, concurrent active users, API requests handled, batch dataset size (GB).
3. Quality & Reliability: Unit test code coverage (%), Lighthouse performance score (e.g., 95+), uptime SLA (99.9%), reduction in error rates.
4. Engineering Velocity: Reduction in manual deployment time (hours to minutes), build pipeline speedup.
IMPORTANT: Never fabricate numbers; state the actual measured figures or frame the structural complexity.`,
    sampleWeakBullet: 'Built machine learning model to classify customer churn.',
    sampleStrongBullet: 'Engineered an XGBoost classification pipeline on 85,000+ customer records, achieving an 89.4% ROC-AUC score and reducing false positives by 22%.',
    quantificationAdvice: 'Add the volume of records processed, evaluation metric (AUC/F1/Accuracy), or speedup percentage.',
    tags: ['quantification', 'metrics', 'numbers', 'scale', 'latency', 'accuracy'],
  },
  {
    id: 'writing-anti-fluff-elimination',
    category: 'Resume Writing',
    roleTarget: 'General',
    title: 'Anti-Fluff & Corporate Buzzword Elimination',
    topic: 'Cliché Elimination',
    content: `Hiring managers and technical screeners instantly discount self-proclaimed personality descriptors ('hardworking', 'team player', 'go-getter', 'results-driven', 'quick learner', 'passionate developer'). Replace empty adjectives with technical proof:
- Instead of 'Hardworking team player': cite cross-functional API integration, sprint milestones delivered, or pull request reviews conducted.
- Instead of 'Quick learner': cite rapid ramp-up and production deployment of a new framework within a 2-week sprint.
- Instead of 'Detail-oriented': cite 90%+ unit test coverage with Jest/PyTest and zero production regressions.`,
    sampleWeakBullet: 'Passionate and hardworking developer who is a great team player.',
    sampleStrongBullet: 'Collaborated across frontend and backend sub-teams to ship 14 REST endpoints, achieving 92% test coverage using Jest and Supertest.',
    tags: ['buzzwords', 'cliches', 'fluff', 'anti-fluff', 'proof-over-claims'],
  }
];
