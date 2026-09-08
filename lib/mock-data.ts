import { UserProfile, JobListing, SkillGapItem, RoadmapNode, InterviewMessage } from './types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_vibhas_01',
  name: 'Vibhas Kadam',
  email: 'vibhas.kadam@placify.ai',
  avatarUrl: '',
  targetRole: 'Fullstack Software Engineer',
  cgpa: 8.6,
  university: 'National Institute of Technology',
  tier: 1,
  graduationYear: 2026,
  experienceMonths: 6,
  githubUrl: 'https://github.com/vibhaskadam',
  linkedinUrl: 'https://linkedin.com/in/vibhaskadam',
  verifiedSkills: ['Python', 'SQL', 'TypeScript', 'Next.js', 'React', 'Git', 'FastAPI', 'REST APIs'],
  pendingSkills: ['Docker', 'Kubernetes', 'Redis', 'System Design', 'Kafka'],
  projectsCount: 3,
  hasProductionDeployment: true,
  codeSignalScore: 710,
  resumeAtsScore: 68,
  placementProbability: 79,
  careerReadinessScore: 84,
};

export const INITIAL_SKILL_GAPS: SkillGapItem[] = [
  {
    id: 'gap-docker',
    skill: 'Docker & Containerization',
    category: 'Cloud & DevOps',
    importance: 'Essential',
    currentProficiency: 35,
    targetProficiency: 85,
    marketDemandScore: 94,
    estimatedTimeToAcquireHours: 18,
    recommendedRoadmapNodeId: 'node-3',
  },
  {
    id: 'gap-redis',
    skill: 'Redis Caching & PubSub',
    category: 'System Architecture',
    importance: 'Essential',
    currentProficiency: 40,
    targetProficiency: 80,
    marketDemandScore: 91,
    estimatedTimeToAcquireHours: 14,
    recommendedRoadmapNodeId: 'node-4',
  },
  {
    id: 'gap-system-design',
    skill: 'High-Level System Design',
    category: 'Architecture',
    importance: 'Competitive',
    currentProficiency: 50,
    targetProficiency: 85,
    marketDemandScore: 96,
    estimatedTimeToAcquireHours: 35,
    recommendedRoadmapNodeId: 'node-5',
  },
  {
    id: 'gap-kafka',
    skill: 'Apache Kafka Event Streams',
    category: 'Distributed Systems',
    importance: 'Competitive',
    currentProficiency: 20,
    targetProficiency: 75,
    marketDemandScore: 88,
    estimatedTimeToAcquireHours: 24,
    recommendedRoadmapNodeId: 'node-5',
  },
  {
    id: 'gap-k8s',
    skill: 'Kubernetes Orchestration',
    category: 'Cloud & DevOps',
    importance: 'Optional',
    currentProficiency: 15,
    targetProficiency: 70,
    marketDemandScore: 82,
    estimatedTimeToAcquireHours: 30,
    recommendedRoadmapNodeId: 'node-6',
  }
];

export const INITIAL_JOBS: JobListing[] = [
  {
    id: 'job-1',
    title: 'Associate Software Engineer (Backend)',
    company: 'Stripe',
    location: 'Bangalore / Hybrid',
    type: 'Full-time',
    salaryRange: '₹18,00,000 - ₹24,00,000',
    matchScore: 82,
    requiredSkills: ['Python', 'SQL', 'FastAPI', 'Redis', 'Docker'],
    matchedSkills: ['Python', 'SQL', 'FastAPI'],
    missingSkills: ['Redis', 'Docker'],
    description: 'Build robust financial infrastructure and high-throughput transaction processing APIs with high reliability and zero downtime.',
    postedDate: '2 days ago',
  },
  {
    id: 'job-2',
    title: 'Fullstack Engineer (Early Career)',
    company: 'Razorpay',
    location: 'Bangalore / Remote',
    type: 'Full-time',
    salaryRange: '₹16,00,000 - ₹22,00,000',
    matchScore: 88,
    requiredSkills: ['TypeScript', 'Next.js', 'React', 'SQL', 'REST APIs'],
    matchedSkills: ['TypeScript', 'Next.js', 'React', 'SQL', 'REST APIs'],
    missingSkills: [],
    description: 'Develop responsive, accessible merchant dashboards and integrate banking partner SDKs with end-to-end security.',
    postedDate: '1 day ago',
  },
  {
    id: 'job-3',
    title: 'Software Development Engineer I (SDE-1)',
    company: 'Amazon',
    location: 'Hyderabad',
    type: 'Full-time',
    salaryRange: '₹22,00,000 - ₹28,00,000',
    matchScore: 74,
    requiredSkills: ['Python', 'DSA', 'System Design', 'Docker', 'AWS'],
    matchedSkills: ['Python', 'DSA'],
    missingSkills: ['System Design', 'Docker', 'AWS'],
    description: 'Scale distributed inventory fulfillment pipelines operating at hundreds of thousands of transactions per minute.',
    postedDate: '3 days ago',
  },
  {
    id: 'job-4',
    title: 'Junior Platform Engineer',
    company: 'Postman',
    location: 'Bangalore',
    type: 'Full-time',
    salaryRange: '₹15,00,000 - ₹20,00,000',
    matchScore: 79,
    requiredSkills: ['TypeScript', 'Next.js', 'FastAPI', 'Docker'],
    matchedSkills: ['TypeScript', 'Next.js', 'FastAPI'],
    missingSkills: ['Docker'],
    description: 'Work on developer tooling, API client synchronization, and automated testing workspaces.',
    postedDate: '5 days ago',
  }
];

export const INITIAL_ROADMAP: RoadmapNode[] = [
  {
    id: 'node-1',
    stageNumber: 1,
    title: '01 Baseline Profile & Resume ATS Tuning',
    category: 'Foundation',
    durationWeeks: 1,
    status: 'completed',
    description: 'Optimize resume bullet points using the STAR/XYZ method, integrate measurable metrics, and eliminate formatting parsing errors.',
    learningOutcomes: [
      'Resume score elevated to >75/100',
      'Verified GitHub repository links attached',
      'Target role keywords synchronized'
    ],
    curatedResources: [
      { title: 'Google Tech Resume Guidelines', type: 'Documentation', url: 'https://careers.google.com', source: 'Google Talent Acquisition' },
      { title: 'STAR Method Formulation Playbook', type: 'Whitepaper', url: '#', source: 'Placify Intelligence' }
    ]
  },
  {
    id: 'node-2',
    stageNumber: 2,
    title: '02 Core Algorithmic Patterns & DSA Mastery',
    category: 'Core DSA',
    durationWeeks: 4,
    status: 'completed',
    description: 'Master high-frequency interview patterns: Sliding Window, Two Pointers, Monotonic Stacks, DFS/BFS, and Dynamic Programming.',
    learningOutcomes: [
      'Code Signal rating > 700 benchmark',
      '150+ Medium LeetCode problems solved',
      'Time/Space complexity proofs on all solutions'
    ],
    curatedResources: [
      { title: 'NeetCode 150 Pattern Guide', type: 'Practice Kata', url: '#', source: 'Curated Open Source' },
      { title: 'MIT 6.006 Algorithms & Data Structures', type: 'Video Lecture', url: '#', source: 'MIT OCW' }
    ]
  },
  {
    id: 'node-3',
    stageNumber: 3,
    title: '03 Production Containerization & DevOps',
    category: 'Applied Projects',
    durationWeeks: 2,
    status: 'in-progress',
    description: 'Containerize backend and frontend microservices using multi-stage Dockerfiles and deploy with automated GitHub Actions CI/CD.',
    learningOutcomes: [
      'Multi-stage Docker build under 150MB',
      'Automated testing pipeline with GitHub Actions',
      'Live cloud URL with SSL certificate'
    ],
    curatedResources: [
      { title: 'Docker Production Best Practices', type: 'Documentation', url: '#', source: 'Docker Official' },
      { title: 'Zero-Downtime Deployment Guide', type: 'Whitepaper', url: '#', source: 'DevOps Guild' }
    ]
  },
  {
    id: 'node-4',
    stageNumber: 4,
    title: '04 Caching, Indexing & Database Optimization',
    category: 'System Architecture',
    durationWeeks: 3,
    status: 'pending',
    description: 'Implement Redis caching with Cache-Aside strategy, compound B-Tree database indexing, and query execution plan analysis (EXPLAIN ANALYZE).',
    learningOutcomes: [
      'P99 API latency reduced by >50%',
      'Redis cache invalidation logic implemented',
      'PostgreSQL connection pooling configured'
    ],
    curatedResources: [
      { title: 'Use The Index, Luke! SQL Performance', type: 'Documentation', url: '#', source: 'Database Engineering' },
      { title: 'Redis University - Caching at Scale', type: 'Practice Kata', url: '#', source: 'Redis Labs' }
    ]
  },
  {
    id: 'node-5',
    stageNumber: 5,
    title: '05 High-Level System Design & Scalability',
    category: 'System Architecture',
    durationWeeks: 3,
    status: 'pending',
    description: 'Design distributed rate limiters, URL shorteners, news feeds, and idempotent payment processing architectures.',
    learningOutcomes: [
      'Cap Theorem & PACELC trade-off justification',
      'Load balancer & CDN edge caching strategies',
      'Message broker event streaming with Kafka'
    ],
    curatedResources: [
      { title: 'System Design Primer', type: 'Documentation', url: '#', source: 'Donne Martin' },
      { title: 'Designing Data-Intensive Applications', type: 'Whitepaper', url: '#', source: 'O\'Reilly' }
    ]
  },
  {
    id: 'node-6',
    stageNumber: 6,
    title: '06 Technical & Behavioral Interview Simulation',
    category: 'Interview Mastery',
    durationWeeks: 2,
    status: 'pending',
    description: 'Execute mock interviews with live AI grounding across live coding, architectural defense, and leadership principle questions.',
    learningOutcomes: [
      'Mock interview score > 85/100',
      'Fluid STAR-method verbal articulation',
      'Edge case defense and trade-off justification'
    ],
    curatedResources: [
      { title: 'Placify AI Mock Simulator', type: 'Practice Kata', url: '/mock-interview', source: 'Placify Engine' }
    ]
  }
];

export const INITIAL_INTERVIEW_SESSION: InterviewMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Welcome Vibhas. Let us begin your technical interview for the Fullstack / Backend Software Engineer role. Can you tell me about a time you had to optimize a slow database query or an API endpoint that was struggling under load?',
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'In my PlacifyAI project, our dashboard endpoint was initially querying multiple tables sequentially, resulting in an 850ms response time. I analyzed the query with EXPLAIN ANALYZE, added composite B-Tree indexes on user_id and created_at, and introduced Redis caching for the computed statistics. This dropped our p99 latency to 38ms.',
    timestamp: '10:04 AM',
    rubricEvaluation: {
      clarityScore: 92,
      technicalAccuracyScore: 95,
      starFormulationScore: 90,
      feedback: 'Excellent response. You provided clear technical metrics (850ms down to 38ms), mentioned concrete tooling (EXPLAIN ANALYZE, B-Tree indexes, Redis), and followed the STAR format effectively.',
      groundedCitations: [
        'ATS Guide: Quantifiable Metrics Matrix',
        'Tier-1 Backend Hiring Rubric: Database Performance'
      ]
    }
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'Great explanation. How did you handle cache invalidation when a user submitted new skill or assessment data? What strategy did you choose to prevent stale data from being served?',
    timestamp: '10:05 AM'
  }
];
