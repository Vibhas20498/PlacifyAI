/**
 * PlacifyAI - Virtual Corporate Interviewer Personas
 * Realistic company-specific technical architects and HR directors for Rounds 3 & 4.
 */

import { DriveCompanyKey, InterviewerPersona } from './types';

export const COMPANY_INTERVIEWER_PERSONAS: Record<
  DriveCompanyKey,
  { technical: InterviewerPersona; hr: InterviewerPersona }
> = {
  'tcs-digital': {
    technical: {
      id: 'tcs-tech-rajesh',
      name: 'Dr. Rajesh Kulkarni',
      role: 'Principal Enterprise Architect & Tech Fellow',
      companyKey: 'tcs-digital',
      companyName: 'Tata Consultancy Services',
      experience: '16+ Years in Enterprise Distributed Architecture',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      gender: 'male',
      pitch: 0.95,
      rate: 0.98,
      bio: 'Evaluates systems architecture, 3NF database designs, SQL indexing, and high-reliability enterprise platforms.',
      focusAreas: ['Distributed SQL & B-Trees', 'SOLID Enterprise Architecture', 'Microservices Resiliency'],
    },
    hr: {
      id: 'tcs-hr-sunita',
      name: 'Sunita Deshmukh',
      role: 'Head of Campus Talent Acquisition & Executive HR Partner',
      companyKey: 'tcs-digital',
      companyName: 'Tata Consultancy Services',
      experience: '12+ Years Corporate HR & Cultural Integration',
      avatarUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      gender: 'female',
      pitch: 1.05,
      rate: 1.0,
      bio: 'Specializes in assessing candidate adaptability, cross-domain agility, teamwork, and corporate maturity.',
      focusAreas: ['Enterprise Adaptability', 'Cross-Domain Agility', 'Integrity & Culture Fit'],
    },
  },

  'infosys-sp': {
    technical: {
      id: 'inf-tech-anand',
      name: 'Anand Narayanan',
      role: 'Senior Principal Power Programmer & Algorithm Mentor',
      companyKey: 'infosys-sp',
      companyName: 'Infosys Specialist Programming Unit',
      experience: '11+ Years in High-Performance Systems & Algorithms',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      gender: 'male',
      pitch: 1.0,
      rate: 1.02,
      bio: 'Probes algorithmic optimization, memory caching locality, multi-threaded concurrency, and dynamic programming.',
      focusAreas: ['Time & Space Bottleneck Profiling', 'JVM Memory Model & Locks', 'Graph & DP Optimization'],
    },
    hr: {
      id: 'inf-hr-pooja',
      name: 'Pooja Iyer',
      role: 'Lead Talent Partner - Specialist Hiring (HackWithInfy)',
      companyKey: 'infosys-sp',
      companyName: 'Infosys Specialist Programming Unit',
      experience: '9+ Years Technical Recruitment',
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      gender: 'female',
      pitch: 1.08,
      rate: 1.0,
      bio: 'Assesses problem-solving composure under pressure, handling team deadlocks, and passion for continuous self-learning.',
      focusAreas: ['High-Pressure Composure', 'Continuous Self-Upskilling', 'Ownership Mindset'],
    },
  },

  'google-sde': {
    technical: {
      id: 'goog-tech-siddharth',
      name: 'Siddharth Nair',
      role: 'Staff Software Engineer (L6) - Cloud Infrastructure',
      companyKey: 'google-sde',
      companyName: 'Google India Engineering',
      experience: '10+ Years Building Global Multi-Region Infrastructure',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      gender: 'male',
      pitch: 0.95,
      rate: 0.98,
      bio: 'Evaluates large-scale distributed systems, low-level OS/memory synchronization, concurrency primitives, and fault tolerance.',
      focusAreas: ['Distributed Consensus & Rate Limiting', 'Cache Stampede & Invalidation', 'Kernel Traps & MMU'],
    },
    hr: {
      id: 'goog-hr-maya',
      name: 'Maya Chen',
      role: 'Staff People Partner - Engineering Leadership',
      companyKey: 'google-sde',
      companyName: 'Google India Engineering',
      experience: '13+ Years People Operations & Googleyness Assessor',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      gender: 'female',
      pitch: 1.04,
      rate: 1.0,
      bio: 'Evaluates Googleyness, intellectual humility, disagreeing and committing with data, and navigating project failure.',
      focusAreas: ['Googleyness & Humility', 'Data-Driven Disagreements', 'Navigating Ambiguity'],
    },
  },

  'deloitte-usi': {
    technical: {
      id: 'del-tech-rohan',
      name: 'Rohan Mehra',
      role: 'Director - Cloud Architecture & Technology Advisory',
      companyKey: 'deloitte-usi',
      companyName: 'Deloitte USI Technology Advisory',
      experience: '14+ Years Enterprise Cloud & Advisory Solutions',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      gender: 'male',
      pitch: 0.98,
      rate: 1.0,
      bio: 'Evaluates client solution security, zero-downtime database migrations, microservice circuit breakers, and cloud resilience.',
      focusAreas: ['Zero-Downtime Migrations', 'Enterprise API Security', 'Circuit Breaker Resiliency'],
    },
    hr: {
      id: 'del-hr-neha',
      name: 'Neha Kapoor',
      role: 'Senior Manager - Human Capital & Campus Selection',
      companyKey: 'deloitte-usi',
      companyName: 'Deloitte USI Technology Advisory',
      experience: '11+ Years Advisory Human Capital',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      gender: 'female',
      pitch: 1.08,
      rate: 1.0,
      bio: 'Assesses client stakeholder diplomacy, scope creep management, ethical communication, and strategic consulting presence.',
      focusAreas: ['Client Diplomacy & Scope Management', 'Conflicting Stakeholder Alignment', 'Executive Presence'],
    },
  },

  'zepto-startup': {
    technical: {
      id: 'zep-tech-kabir',
      name: 'Kabir Mehta',
      role: 'VP of Engineering & Core Platform Architect',
      companyKey: 'zepto-startup',
      companyName: 'Zepto Quick-Commerce',
      experience: '8+ Years Scaling High-Growth Quick-Commerce Systems',
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      gender: 'male',
      pitch: 1.02,
      rate: 1.04,
      bio: 'Probes flash-sale race condition prevention, sub-millisecond Redis geospatial dispatch, and Kafka stream processing.',
      focusAreas: ['Flash-Sale Atomic Locking', 'Redis Geospatial Rider Dispatch', 'Kafka Idempotent Consumers'],
    },
    hr: {
      id: 'zep-hr-tanvi',
      name: 'Tanvi Parekh',
      role: 'Founding Talent Lead - Engineering & Product',
      companyKey: 'zepto-startup',
      companyName: 'Zepto Quick-Commerce',
      experience: '7+ Years High-Velocity Tech Recruiting',
      avatarUrl:
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
      gender: 'female',
      pitch: 1.12,
      rate: 1.02,
      bio: 'Evaluates extreme ownership, 24/7 on-call readiness, speed of execution vs perfectionism, and true founder hustle.',
      focusAreas: ['Extreme Production Ownership', 'Execution Speed vs Perfectionism', 'High-Agency Hustle'],
    },
  },
};

export function getCompanyInterviewer(
  companyKey: DriveCompanyKey,
  round: 'technical' | 'hr'
): InterviewerPersona {
  const profile = COMPANY_INTERVIEWER_PERSONAS[companyKey] || COMPANY_INTERVIEWER_PERSONAS['tcs-digital'];
  return profile[round];
}
