/**
 * PlacifyAI - Campus Placement Drive War Room Master Data
 * Authentic company profiles, multi-category question bank, dynamic paper generator, coding challenges & rubrics
 */

import {
  CompanyDriveProfile,
  DriveCompanyKey,
  ScreeningQuestion,
  ScreeningCategory,
  CodingProblem,
  TechnicalInterviewQuestion,
  HRInterviewQuestion,
} from './types';

export const COMPANY_DRIVE_PROFILES: Record<DriveCompanyKey, CompanyDriveProfile> = {
  'tcs-digital': {
    key: 'tcs-digital',
    name: 'TCS Digital / Prime Drive',
    roleTitle: 'Systems Engineer & Digital Specialist',
    packageLPA: '₹7.50 LPA - ₹9.00 LPA',
    baseLPA: '₹6.80 LPA',
    joiningBonus: '₹60,000 Special Allowance',
    tagline: 'Premier high-growth track of India’s largest placement drive',
    tier: 'Mass IT Prime (7-9 LPA)',
    selectionRatio: 'Top 6% of NQT test-takers',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    round1CutoffPercent: 65,
    round2RequiredTestCases: 4,
    round3PassingScore: 68,
    round4PassingScore: 70,
    features: ['Advanced NQT Aptitude', 'Data Structures & Algorithms', 'System Architecture & SDLC'],
  },
  'infosys-sp': {
    key: 'infosys-sp',
    name: 'Infosys Specialist Programmer (SP / DSE)',
    roleTitle: 'Specialist Programmer (Power Programmer)',
    packageLPA: '₹9.50 LPA - ₹13.00 LPA',
    baseLPA: '₹8.50 LPA',
    joiningBonus: '₹1,00,000 Milestone Bonus',
    tagline: 'Elite algorithmic track focused on high-performance engineering',
    tier: 'Specialist Coder (9-13 LPA)',
    selectionRatio: 'Top 3% of HackWithInfy qualifiers',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    round1CutoffPercent: 70,
    round2RequiredTestCases: 4,
    round3PassingScore: 72,
    round4PassingScore: 70,
    features: ['Competitive Programming Round', 'Graph & Dynamic Programming', 'High-Scale Java/C++ Systems'],
  },
  'google-sde': {
    key: 'google-sde',
    name: 'Google India SDE-1 Campus Drive',
    roleTitle: 'Software Engineer - Campus Graduate',
    packageLPA: '₹32.50 LPA - ₹42.00 LPA',
    baseLPA: '₹18.00 LPA',
    joiningBonus: '₹5,00,000 Sign-on + $25k Equity/4yr',
    tagline: 'World-class engineering rigor, algorithmic brilliance & massive scale',
    tier: 'Tier-1 FAANG (30+ LPA)',
    selectionRatio: 'Top 0.8% of national applicant pool',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    round1CutoffPercent: 80,
    round2RequiredTestCases: 5, // All 5 must pass
    round3PassingScore: 82,
    round4PassingScore: 78,
    features: ['Rigorous Concurrency & Algorithmic Cases', 'Low-Level System Design', 'Googleyness & Leadership Values'],
  },
  'deloitte-usi': {
    key: 'deloitte-usi',
    name: 'Deloitte USI Technology Advisory Drive',
    roleTitle: 'Associate Technology Consultant',
    packageLPA: '₹8.50 LPA - ₹10.20 LPA',
    baseLPA: '₹7.60 LPA',
    joiningBonus: '₹75,000 Relocation & Signing Allowance',
    tagline: 'Enterprise cloud transformation, client strategy & modern consulting',
    tier: 'Consulting (8-10 LPA)',
    selectionRatio: 'Top 7% of campus shortlist',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    round1CutoffPercent: 65,
    round2RequiredTestCases: 3,
    round3PassingScore: 70,
    round4PassingScore: 75,
    features: ['Logical & Data Interpretation', 'Fullstack & Cloud Architecture', 'Client Stakeholder Communication'],
  },
  'zepto-startup': {
    key: 'zepto-startup',
    name: 'Zepto / Quick-Commerce Unicorn',
    roleTitle: 'Software Development Engineer - Backend/Fullstack',
    packageLPA: '₹16.00 LPA - ₹20.00 LPA',
    baseLPA: '₹14.00 LPA',
    joiningBonus: '₹2,00,000 Joining Bonus + ESOPs',
    tagline: 'Ultra-fast delivery platform processing 50,000+ orders/min at low latency',
    tier: 'High-Growth Tech (14-18 LPA)',
    selectionRatio: 'Top 2.5% of product applicants',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    round1CutoffPercent: 72,
    round2RequiredTestCases: 4,
    round3PassingScore: 75,
    round4PassingScore: 72,
    features: ['Redis / Kafka High-Throughput Scenarios', 'Fast Real-World Coding Challenge', 'Founder Mindset & Execution Speed'],
  },
};

// ==========================================
// DEEP MASTER QUESTION BANK BY CATEGORY
// ==========================================

export const MASTER_QUESTION_BANK: Record<ScreeningCategory, ScreeningQuestion[]> = {
  'Quantitative Aptitude': [
    {
      id: 'quant-1',
      category: 'Quantitative Aptitude',
      question: 'A train 180 meters long crosses a telegraph post in 9 seconds. What is the speed of the train in km/hr?',
      options: ['60 km/hr', '72 km/hr', '80 km/hr', '90 km/hr'],
      correctOptionIndex: 1,
      explanation: 'Speed = Distance / Time = 180 / 9 = 20 m/s. Convert to km/hr: 20 * (18 / 5) = 72 km/hr.',
    },
    {
      id: 'quant-2',
      category: 'Quantitative Aptitude',
      question: 'A and B can complete a software module in 12 days and 18 days respectively. If they work together for 4 days, what fraction of work is remaining?',
      options: ['1/3', '4/9', '5/9', '7/18'],
      correctOptionIndex: 1,
      explanation: '1-day combined work = 1/12 + 1/18 = 5/36. In 4 days, work completed = 4 * (5/36) = 20/36 = 5/9. Work remaining = 1 - 5/9 = 4/9.',
    },
    {
      id: 'quant-3',
      category: 'Quantitative Aptitude',
      question: 'A merchant marks an item 40% above the cost price and allows a discount of 25% on the marked price. What is the merchant’s profit percentage?',
      options: ['5%', '8%', '10%', '15%'],
      correctOptionIndex: 0,
      explanation: 'Let CP = 100. MP = 140. SP = 140 * 0.75 = 105. Profit = (105 - 100) / 100 = 5%.',
    },
    {
      id: 'quant-4',
      category: 'Quantitative Aptitude',
      question: 'From a bag containing 5 red, 4 green, and 3 blue balls, two balls are drawn at random. What is the probability that neither ball is red?',
      options: ['7/22', '5/12', '14/33', '1/3'],
      correctOptionIndex: 0,
      explanation: 'Total balls = 12. Non-red balls = 7. P(neither red) = (7C2) / (12C2) = 21 / 66 = 7/22.',
    },
    {
      id: 'quant-5',
      category: 'Quantitative Aptitude',
      question: 'The compound interest on ₹10,000 for 2 years at 10% per annum compounded annually exceeds simple interest on the same sum by how much?',
      options: ['₹50', '₹100', '₹150', '₹200'],
      correctOptionIndex: 1,
      explanation: 'Difference for 2 years = P * (R/100)^2 = 10000 * (10/100)^2 = 10000 * 0.01 = ₹100.',
    },
    {
      id: 'quant-6',
      category: 'Quantitative Aptitude',
      question: 'Two pipes A and B can fill a cistern in 20 minutes and 30 minutes respectively. If both pipes are opened simultaneously, how much time will it take to fill the tank?',
      options: ['10 minutes', '12 minutes', '15 minutes', '18 minutes'],
      correctOptionIndex: 1,
      explanation: 'Net rate = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. Time = 12 minutes.',
    },
  ],

  'Logical Reasoning': [
    {
      id: 'logic-1',
      category: 'Logical Reasoning',
      question: 'In a certain code, "CLOUD" is written as "ENQWF". How will "STORM" be written in that same cipher?',
      options: ['UVRTO', 'UVQTO', 'UVSUO', 'TVSON'],
      correctOptionIndex: 1,
      explanation: 'Each letter is shifted forward: C(+2)=E, L(+2)=N, O(+2)=Q, U(+2)=W, D(+2)=F. For STORM: S(+2)=U, T(+2)=V, O(+2)=Q, R(+2)=T, M(+2)=O -> UVQTO.',
    },
    {
      id: 'logic-2',
      category: 'Logical Reasoning',
      question: 'Pointing to a photograph of a boy, Suresh says: "He is the son of the only son of my mother." How is Suresh related to that boy?',
      options: ['Brother', 'Uncle', 'Father', 'Grandfather'],
      correctOptionIndex: 2,
      explanation: 'The only son of Suresh’s mother is Suresh himself. Thus, the boy is the son of Suresh. Suresh is the boy’s father.',
    },
    {
      id: 'logic-3',
      category: 'Logical Reasoning',
      question: 'Statements: (1) All engineers are problem solvers. (2) Some problem solvers are leaders. Conclusion: Which of the following definitely follows?',
      options: ['All leaders are engineers', 'Some engineers are leaders', 'Some problem solvers are engineers', 'No engineer is a leader'],
      correctOptionIndex: 2,
      explanation: 'Since "All engineers are problem solvers", the converse "Some problem solvers are engineers" is unconditionally valid.',
    },
    {
      id: 'logic-4',
      category: 'Logical Reasoning',
      question: 'Find the missing number in the sequence: 4, 18, 48, 100, 180, ?',
      options: ['248', '294', '312', '324'],
      correctOptionIndex: 1,
      explanation: 'Pattern is n^3 - n^2 or n^2 * (n-1): 2^2*1=4, 3^2*2=18, 4^2*3=48, 5^2*4=100, 6^2*5=180. Next: 7^2*6 = 49 * 6 = 294.',
    },
    {
      id: 'logic-5',
      category: 'Logical Reasoning',
      question: 'A person walks 10m North, turns Right and walks 15m, then turns Right again and walks 10m. In which direction and at what distance is he from the starting point?',
      options: ['15m East', '15m West', '10m North', '25m North-East'],
      correctOptionIndex: 0,
      explanation: 'North 10m and South 10m cancel out. The person is exactly 15m East of the origin.',
    },
    {
      id: 'logic-6',
      category: 'Logical Reasoning',
      question: 'If "P + Q" means P is the father of Q; "P - Q" means P is the sister of Q; "P * Q" means P is the brother of Q; which expression indicates that M is the nephew of R?',
      options: ['R - K + M * T', 'R * K + M - T', 'R + K - M * T', 'M * K + R - T'],
      correctOptionIndex: 0,
      explanation: 'R is sister of K (R - K). K is father of M (K + M). M is brother of T (M is male). Therefore, M is the brother’s son (nephew) of R.',
    },
  ],

  'Verbal Ability': [
    {
      id: 'verb-1',
      category: 'Verbal Ability',
      question: 'Choose the word that is most nearly OPPOSITE in meaning to the word: PRAGMATIC',
      options: ['Realistic', 'Idealistic', 'Practical', 'Sensible'],
      correctOptionIndex: 1,
      explanation: 'Pragmatic means dealing with matters realistically and practically. Idealistic (unrealistic/utopian) is its exact antonym.',
    },
    {
      id: 'verb-2',
      category: 'Verbal Ability',
      question: 'Identify the grammatically INCORRECT part in the sentence: "Neither the system architect (A) nor the developers (B) was able to identify (C) the memory leak (D)."',
      options: ['(A)', '(B)', '(C)', '(D)'],
      correctOptionIndex: 2,
      explanation: 'Subject-Verb Agreement: When subjects are joined by "neither... nor", the verb agrees with the closer subject ("developers" is plural), so it must be "were able", not "was able".',
    },
    {
      id: 'verb-3',
      category: 'Verbal Ability',
      question: 'Select the option that correctly completes the sentence: "The engineering team worked tirelessly to ______ the performance bottlenecks before the nationwide release."',
      options: ['alleviate', 'aggravate', 'deteriorate', 'procrastinate'],
      correctOptionIndex: 0,
      explanation: '"Alleviate" means to relieve, reduce, or lessen severe difficulties or bottlenecks.',
    },
    {
      id: 'verb-4',
      category: 'Verbal Ability',
      question: 'Select the option with the correctly spelled corporate term:',
      options: ['Bureaucracy', 'Beurocracy', 'Bureacracy', 'Burocracy'],
      correctOptionIndex: 0,
      explanation: 'The correct standard spelling is "Bureaucracy" (b-u-r-e-a-u-c-r-a-c-y).',
    },
    {
      id: 'verb-5',
      category: 'Verbal Ability',
      question: 'Choose the option that best expresses the meaning of the corporate idiom: "To cut corners"',
      options: ['To take a geometric shortcut', 'To do something poorly or cheaply to save time/money', 'To terminate an underperforming team', 'To pivot product strategy'],
      correctOptionIndex: 1,
      explanation: '"Cut corners" idiomatically means to undertake something in the easiest, cheapest, or fastest manner, frequently sacrificing quality.',
    },
  ],

  'Core CS & Technical Logic': [
    {
      id: 'cs-1',
      category: 'Core CS & Technical Logic',
      question: 'What is the tight worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?',
      options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
      correctOptionIndex: 1,
      explanation: 'When a BST is degenerate/skewed into a linked list, searching requires traversing all N nodes, resulting in worst-case O(N).',
    },
    {
      id: 'cs-2',
      category: 'Core CS & Technical Logic',
      question: 'Which normal form guarantees the elimination of all transitive functional dependencies in a relational database?',
      options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
      correctOptionIndex: 2,
      explanation: '3NF requires that every non-prime attribute is non-transitively dependent on every candidate key.',
    },
    {
      id: 'cs-3',
      category: 'Core CS & Technical Logic',
      question: 'In an Operating System, which of the following is NOT one of Coffman\'s four necessary conditions for a Deadlock to occur?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
      correctOptionIndex: 2,
      explanation: 'The condition is NO Preemption. If preemption is allowed, deadlocks can be broken and avoided.',
    },
    {
      id: 'cs-4',
      category: 'Core CS & Technical Logic',
      question: 'What is the primary architectural advantage of using an index (B+ Tree) on a high-cardinality foreign key column in a relational database?',
      options: ['Reduces disk storage', 'Replaces Table Scans with logarithmic tree lookups O(log N)', 'Automates transaction rollbacks', 'Guarantees ACID atomicity'],
      correctOptionIndex: 1,
      explanation: 'B+ Tree indexes prevent full table scans by organizing row pointers in sorted leaf nodes, reducing search time to O(log N).',
    },
    {
      id: 'cs-5',
      category: 'Core CS & Technical Logic',
      question: 'In the TCP 3-Way Handshake protocol, what is the exact packet sequence sent between Client and Server to establish a connection?',
      options: ['SYN ➔ SYN-ACK ➔ ACK', 'ACK ➔ SYN ➔ ACK', 'SYN ➔ ACK ➔ FIN', 'HELLO ➔ READY ➔ GO'],
      correctOptionIndex: 0,
      explanation: '1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client acknowledges with ACK. The TCP socket is then ESTABLISHED.',
    },
    {
      id: 'cs-6',
      category: 'Core CS & Technical Logic',
      question: 'Which garbage collection concept in modern runtimes (Java/V8) handles short-lived objects separately from long-lived objects?',
      options: ['Mark and Sweep', 'Generational Hypothesis (Young vs Old Generation)', 'Reference Counting', 'Stop-the-world compaction'],
      correctOptionIndex: 1,
      explanation: 'The Generational Hypothesis observes that most objects die young. Memory is divided into Young (Eden/Survivor) and Old (Tenured) spaces.',
    },
  ],

  'Situational Judgment': [
    {
      id: 'sit-1',
      category: 'Situational Judgment',
      question: 'You discover a critical security vulnerability in a service 2 hours before a major product release. Your team lead is unreachable. What is the most appropriate engineering decision?',
      options: [
        'Deploy on schedule anyway and fix it quietly tomorrow',
        'Flag the vulnerability immediately to the Release Manager & On-Call Engineer, requesting a temporary freeze',
        'Refactor the entire codebase single-handedly in production',
        'Ignore it since automated tests did not fail',
      ],
      correctOptionIndex: 1,
      explanation: 'High-severity security flaws require immediate transparent escalation to the on-call/release management team to prevent enterprise breach.',
    },
    {
      id: 'sit-2',
      category: 'Situational Judgment',
      question: 'A teammate repeatedly leaves harsh, dismissive comments on your pull requests without proposing constructive architectural alternatives. How should you professionally handle this?',
      options: [
        'Post harsh comments on their PRs in retaliation',
        'Request a brief 1-on-1 meeting to understand their technical perspective and agree on code review standards',
        'Complain publicly in the company-wide general channel',
        'Stop writing code for that repository',
      ],
      correctOptionIndex: 1,
      explanation: 'Constructive 1-on-1 alignment resolves miscommunication, clarifies technical intent, and establishes shared team norms.',
    },
    {
      id: 'sit-3',
      category: 'Situational Judgment',
      question: 'A client demands an additional unbudgeted analytics module within an impossible 3-day deadline. How should an Associate Consultant respond?',
      options: [
        'Promise the full feature immediately without consulting technical leads',
        'Reject the client bluntly without explanation',
        'Assess feasibility with tech leads, present a phased MVP for the deadline, and schedule full features for sprint 2',
        'Work 72 hours continuously without documenting code',
      ],
      correctOptionIndex: 2,
      explanation: 'Consulting best practice is managing scope diplomatically by offering a viable minimum viable product (MVP) while protecting delivery standards.',
    },
    {
      id: 'sit-4',
      category: 'Situational Judgment',
      question: 'During a production deployment, error rates spike to 12% across customer checkout endpoints. What is the immediate first action to take?',
      options: [
        'Immediately execute an automated rollback to the last verified stable build',
        'Start writing unit tests to reproduce the error locally',
        'Argue with the backend team over whose commit broke production',
        'Wait 30 minutes to see if error rates normalize',
      ],
      correctOptionIndex: 0,
      explanation: 'Mitigating user impact via rapid rollback is the absolute first priority in production incident response before initiating root-cause analysis.',
    },
  ],
};

/**
 * Generates a fresh, randomized question paper for Round 1.
 * Picks 2 distinct questions from each of the 5 categories (10 questions total).
 * Completely randomized on every single attempt or retry!
 */
export function generateRandomizedScreeningPaper(
  companyKey: DriveCompanyKey
): ScreeningQuestion[] {
  const categories: ScreeningCategory[] = [
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Verbal Ability',
    'Core CS & Technical Logic',
    'Situational Judgment',
  ];

  const selectedPaper: ScreeningQuestion[] = [];

  categories.forEach((cat) => {
    const pool = MASTER_QUESTION_BANK[cat];
    if (pool && pool.length > 0) {
      // Shuffle pool copy
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      // Pick 2 questions
      selectedPaper.push(...shuffled.slice(0, 2));
    }
  });

  // Return the questions shuffled so candidates see varied section sequences
  return selectedPaper.sort(() => Math.random() - 0.5);
}

// ==========================================
// MASTER CODING PROBLEMS POOL FOR ROUND 2
// ==========================================
export const MASTER_CODING_PROBLEMS_POOL: Record<DriveCompanyKey, CodingProblem[]> = {
  'tcs-digital': [
    {
      id: 'tcs-p1',
      title: 'Subarray with Target Sum',
      difficulty: 'Medium',
      description: `Given an unsorted array \`nums\` of non-negative integers and an integer \`target\`, find the 1-based start and end indices of the first continuous subarray whose sum equals \`target\`. If no such subarray exists, return \`[-1]\`.`,
      constraints: [
        '1 <= nums.length <= 10^5',
        '0 <= nums[i] <= 10^4',
        '1 <= target <= 10^9',
        'Expected Time Complexity: O(N)',
        'Expected Auxiliary Space: O(1)',
      ],
      examples: [
        {
          input: 'nums = [1, 2, 3, 7, 5], target = 12',
          output: '[2, 4]',
          explanation: 'The sum of elements from index 2 to 4 (1-based) is 2 + 3 + 7 = 12.',
        },
        {
          input: 'nums = [1, 2, 3, 4, 5], target = 15',
          output: '[1, 5]',
          explanation: 'The sum of the entire array 1+2+3+4+5 = 15.',
        },
      ],
      starterCode: {
        javascript: `function subarraySum(nums, target) {
  let currentSum = 0;
  let start = 0;

  for (let end = 0; end < nums.length; end++) {
    currentSum += nums[end];

    while (currentSum > target && start <= end) {
      currentSum -= nums[start];
      start++;
    }

    if (currentSum === target && start <= end) {
      return [start + 1, end + 1]; // 1-based indexing
    }
  }

  return [-1];
}`,
        python: `def subarray_sum(nums, target):
    current_sum = 0
    start = 0
    for end in range(len(nums)):
        current_sum += nums[end]
        while current_sum > target and start <= end:
            current_sum -= nums[start]
            start += 1
        if current_sum == target and start <= end:
            return [start + 1, end + 1]
    return [-1]`,
        java: `class Solution {
    public int[] subarraySum(int[] nums, int target) {
        int currentSum = 0;
        int start = 0;
        for (int end = 0; end < nums.length; end++) {
            currentSum += nums[end];
            while (currentSum > target && start <= end) {
                currentSum -= nums[start];
                start++;
            }
            if (currentSum == target && start <= end) {
                return new int[]{start + 1, end + 1};
            }
        }
        return new int[]{-1};
    }
}`,
        cpp: `#include <vector>
std::vector<int> subarraySum(std::vector<int>& nums, int target) {
    int currentSum = 0;
    int start = 0;
    for (int end = 0; end < nums.size(); end++) {
        currentSum += nums[end];
        while (currentSum > target && start <= end) {
            currentSum -= nums[start];
            start++;
        }
        if (currentSum == target && start <= end) {
            return {start + 1, end + 1};
        }
    }
    return {-1};
}`,
      },
      functionName: 'subarraySum',
      testCases: [
        { id: 1, input: [[1, 2, 3, 7, 5], 12], expectedOutput: [2, 4], isHidden: false, displayInput: 'nums = [1, 2, 3, 7, 5], target = 12', displayExpected: '[2, 4]' },
        { id: 2, input: [[1, 2, 3, 4, 5], 15], expectedOutput: [1, 5], isHidden: false, displayInput: 'nums = [1, 2, 3, 4, 5], target = 15', displayExpected: '[1, 5]' },
        { id: 3, input: [[10, 5, 2, 7, 1, 9], 15], expectedOutput: [1, 2], isHidden: true, displayInput: 'nums = [10, 5, 2, 7, 1, 9], target = 15', displayExpected: '[1, 2]' },
        { id: 4, input: [[1, 4, 20, 3, 10, 5], 33], expectedOutput: [3, 5], isHidden: true, displayInput: 'nums = [1, 4, 20, 3, 10, 5], target = 33', displayExpected: '[3, 5]' },
        { id: 5, input: [[1, 2, 3], 99], expectedOutput: [-1], isHidden: true, displayInput: 'nums = [1, 2, 3], target = 99', displayExpected: '[-1]' },
      ],
    },
    {
      id: 'tcs-p2',
      title: 'Sort Array of 0s, 1s, and 2s (Dutch National Flag)',
      difficulty: 'Medium',
      description: `Given an array \`nums\` with \`n\` objects colored red, white, or blue (represented as 0, 1, and 2), sort them in-place so that objects of the same color are adjacent. You must solve this in one-pass O(N) time with O(1) extra space.`,
      constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0, 1, or 2'],
      examples: [
        { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
        { input: 'nums = [2,0,1]', output: '[0,1,2]' },
      ],
      starterCode: {
        javascript: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`,
        python: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    return nums`,
        java: `class Solution {
    public int[] sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low]; nums[low] = nums[mid]; nums[mid] = temp;
                low++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[mid]; nums[mid] = nums[high]; nums[high] = temp;
                high--;
            }
        }
        return nums;
    }
}`,
        cpp: `#include <vector>
std::vector<int> sortColors(std::vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            std::swap(nums[low++], nums[mid++]);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            std::swap(nums[mid], nums[high--]);
        }
    }
    return nums;
}`,
      },
      functionName: 'sortColors',
      testCases: [
        { id: 1, input: [[2, 0, 2, 1, 1, 0]], expectedOutput: [0, 0, 1, 1, 2, 2], isHidden: false, displayInput: 'nums = [2,0,2,1,1,0]', displayExpected: '[0,0,1,1,2,2]' },
        { id: 2, input: [[2, 0, 1]], expectedOutput: [0, 1, 2], isHidden: false, displayInput: 'nums = [2,0,1]', displayExpected: '[0,1,2]' },
        { id: 3, input: [[0]], expectedOutput: [0], isHidden: true, displayInput: 'Single element', displayExpected: '[0]' },
        { id: 4, input: [[1, 2, 0]], expectedOutput: [0, 1, 2], isHidden: true, displayInput: 'nums = [1,2,0]', displayExpected: '[0,1,2]' },
        { id: 5, input: [[2, 2, 2, 1, 1, 0, 0]], expectedOutput: [0, 0, 1, 1, 2, 2, 2], isHidden: true, displayInput: 'Reverse sorted duplicate list', displayExpected: '[0,0,1,1,2,2,2]' },
      ],
    },
  ],

  'infosys-sp': [
    {
      id: 'inf-p1',
      title: 'Longest Consecutive Elements Sequence',
      difficulty: 'Medium',
      description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence in strict O(N) time.`,
      constraints: ['0 <= nums.length <= 10^5', 'Must run in O(N) time using HashSet'],
      examples: [{ input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4' }],
      starterCode: {
        javascript: `function longestConsecutive(nums) {
  if (!nums.length) return 0;
  const set = new Set(nums);
  let maxLength = 0;
  for (const num of set) {
    if (!set.has(num - 1)) {
      let curr = num, streak = 1;
      while (set.has(curr + 1)) { curr++; streak++; }
      maxLength = Math.max(maxLength, streak);
    }
  }
  return maxLength;
}`,
        python: `def longest_consecutive(nums):
    if not nums: return 0
    num_set = set(nums)
    max_streak = 0
    for num in num_set:
        if num - 1 not in num_set:
            curr = num
            streak = 1
            while curr + 1 in num_set:
                curr += 1
                streak += 1
            max_streak = max(max_streak, streak)
    return max_streak`,
        java: `class Solution { public int longestConsecutive(int[] nums) { return 0; } }`,
        cpp: `#include <vector>\nint longestConsecutive(std::vector<int>& nums) { return 0; }`,
      },
      functionName: 'longestConsecutive',
      testCases: [
        { id: 1, input: [[100, 4, 200, 1, 3, 2]], expectedOutput: 4, isHidden: false, displayInput: '[100,4,200,1,3,2]', displayExpected: '4' },
        { id: 2, input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expectedOutput: 9, isHidden: false, displayInput: '[0,3,7,2,5,8,4,6,0,1]', displayExpected: '9' },
        { id: 3, input: [[]], expectedOutput: 0, isHidden: true, displayInput: '[]', displayExpected: '0' },
        { id: 4, input: [[1, 2, 0, 1]], expectedOutput: 3, isHidden: true, displayInput: '[1,2,0,1]', displayExpected: '3' },
        { id: 5, input: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expectedOutput: 7, isHidden: true, displayInput: 'Mixed negatives', displayExpected: '7' },
      ],
    },
  ],

  'google-sde': [
    {
      id: 'goog-p1',
      title: 'Trapping Rain Water at Scale',
      difficulty: 'Hard',
      description: `Given \`n\` non-negative integers representing an elevation map, compute how much water it can trap after raining in O(N) time and O(1) extra space.`,
      constraints: ['1 <= height.length <= 2 * 10^5', '0 <= height[i] <= 10^5'],
      examples: [{ input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
      starterCode: {
        javascript: `function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else total += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else total += rightMax - height[right];
      right--;
    }
  }
  return total;
}`,
        python: `def trap(height):
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    total = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max: left_max = height[left]
            else: total += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max: right_max = height[right]
            else: total += right_max - height[right]
            right -= 1
    return total`,
        java: `class Solution { public int trap(int[] height) { return 0; } }`,
        cpp: `#include <vector>\nint trap(std::vector<int>& height) { return 0; }`,
      },
      functionName: 'trap',
      testCases: [
        { id: 1, input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expectedOutput: 6, isHidden: false, displayInput: '[0,1,0,2,1,0,1,3,2,1,2,1]', displayExpected: '6' },
        { id: 2, input: [[4, 2, 0, 3, 2, 5]], expectedOutput: 9, isHidden: false, displayInput: '[4,2,0,3,2,5]', displayExpected: '9' },
        { id: 3, input: [[2, 0, 2]], expectedOutput: 2, isHidden: true, displayInput: '[2,0,2]', displayExpected: '2' },
        { id: 4, input: [[3, 2, 1]], expectedOutput: 0, isHidden: true, displayInput: 'Descending slope', displayExpected: '0' },
        { id: 5, input: [[5, 4, 1, 2]], expectedOutput: 1, isHidden: true, displayInput: '[5,4,1,2]', displayExpected: '1' },
      ],
    },
  ],

  'deloitte-usi': [
    {
      id: 'del-p1',
      title: 'Valid Anagram with Space Optimization',
      difficulty: 'Easy',
      description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
      constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
      examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }],
      starterCode: {
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}`,
        python: `def is_anagram(s, t):
    if len(s) != len(t): return False
    count = [0] * 26
    for i in range(len(s)):
        count[ord(s[i]) - 97] += 1
        count[ord(t[i]) - 97] -= 1
    return all(c == 0 for c in count)`,
        java: `class Solution { public boolean isAnagram(String s, String t) { return false; } }`,
        cpp: `#include <string>\nbool isAnagram(std::string s, std::string t) { return false; }`,
      },
      functionName: 'isAnagram',
      testCases: [
        { id: 1, input: ['anagram', 'nagaram'], expectedOutput: true, isHidden: false, displayInput: 's="anagram", t="nagaram"', displayExpected: 'true' },
        { id: 2, input: ['rat', 'car'], expectedOutput: false, isHidden: false, displayInput: 's="rat", t="car"', displayExpected: 'false' },
        { id: 3, input: ['a', 'ab'], expectedOutput: false, isHidden: true, displayInput: 'Different lengths', displayExpected: 'false' },
        { id: 4, input: ['listen', 'silent'], expectedOutput: true, isHidden: true, displayInput: 's="listen", t="silent"', displayExpected: 'true' },
        { id: 5, input: ['aacc', 'ccac'], expectedOutput: false, isHidden: true, displayInput: 'Count mismatch', displayExpected: 'false' },
      ],
    },
  ],

  'zepto-startup': [
    {
      id: 'zep-p1',
      title: 'Top K Frequent Elements (Real-Time Order Cache)',
      difficulty: 'Medium',
      description: `Given an integer array \`nums\` representing customer item IDs and an integer \`k\`, return the \`k\` most frequent elements in descending order of frequency.`,
      constraints: ['1 <= nums.length <= 10^5', 'k is in range [1, unique elements]'],
      examples: [{ input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1, 2]' }],
      starterCode: {
        javascript: `function topKFrequent(nums, k) {
  const map = new Map();
  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(entry => entry[0]);
}`,
        python: `from collections import Counter
def top_k_frequent(nums, k):
    count = Counter(nums)
    return [item for item, _ in count.most_common(k)]`,
        java: `class Solution { public int[] topKFrequent(int[] nums, int k) { return new int[]{}; } }`,
        cpp: `#include <vector>\nstd::vector<int> topKFrequent(std::vector<int>& nums, int k) { return {}; }`,
      },
      functionName: 'topKFrequent',
      testCases: [
        { id: 1, input: [[1, 1, 1, 2, 2, 3], 2], expectedOutput: [1, 2], isHidden: false, displayInput: 'nums=[1,1,1,2,2,3], k=2', displayExpected: '[1, 2]' },
        { id: 2, input: [[1], 1], expectedOutput: [1], isHidden: false, displayInput: 'nums=[1], k=1', displayExpected: '[1]' },
        { id: 3, input: [[4, 1, -1, 2, -1, 2, 3], 2], expectedOutput: [-1, 2], isHidden: true, displayInput: 'With negatives', displayExpected: '[-1, 2]' },
        { id: 4, input: [[5, 5, 5, 5, 5], 1], expectedOutput: [5], isHidden: true, displayInput: 'Identical elements', displayExpected: '[5]' },
        { id: 5, input: [[1, 2, 3, 4], 4], expectedOutput: [1, 2, 3, 4], isHidden: true, displayInput: 'k equals array size', displayExpected: '[1, 2, 3, 4]' },
      ],
    },
  ],
};

// Alias export for backwards compatibility
export const MASTER_SCREENING_QUESTIONS: ScreeningQuestion[] = Object.values(MASTER_QUESTION_BANK).flat();

export const MASTER_CODING_PROBLEMS: Record<DriveCompanyKey, CodingProblem> = {
  'tcs-digital': MASTER_CODING_PROBLEMS_POOL['tcs-digital'][0],
  'infosys-sp': MASTER_CODING_PROBLEMS_POOL['infosys-sp'][0],
  'google-sde': MASTER_CODING_PROBLEMS_POOL['google-sde'][0],
  'deloitte-usi': MASTER_CODING_PROBLEMS_POOL['deloitte-usi'][0],
  'zepto-startup': MASTER_CODING_PROBLEMS_POOL['zepto-startup'][0],
};

/**
 * Returns a randomly picked coding challenge for the company drive.
 */
export function getRandomCodingProblem(companyKey: DriveCompanyKey): CodingProblem {
  const pool = MASTER_CODING_PROBLEMS_POOL[companyKey] || MASTER_CODING_PROBLEMS_POOL['tcs-digital'];
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// Master technical interview questions
export const MASTER_TECHNICAL_QUESTIONS: Record<DriveCompanyKey, TechnicalInterviewQuestion[]> = {
  'tcs-digital': [
    {
      id: 'tcs-t1',
      topic: 'Database & SQL Indexing',
      question: 'In your top project, how did you design your database schema? Explain why you chose SQL over NoSQL, and how B-Tree indexes improve query performance.',
      contextTip: 'Mention table normalization (3NF), foreign keys, and index scan vs full table scan.',
      sampleExpectedPoints: ['Normalized schema (3NF) to prevent anomalies', 'B-Tree structure keeps search O(log N)', 'Trade-off: indexes slow down bulk inserts'],
    },
    {
      id: 'tcs-t2',
      topic: 'OOP & Real-World Design Patterns',
      question: 'Explain the SOLID principles with an example from a project you built. Which design pattern (Singleton, Factory, Observer) have you implemented in code?',
      contextTip: 'Reference Single Responsibility and Dependency Inversion directly in your codebase.',
      sampleExpectedPoints: ['S - Single Responsibility: keeping controllers thin', 'D - Dependency Injection for mock testing', 'Factory pattern for creating varying service clients'],
    },
  ],
  'infosys-sp': [
    {
      id: 'inf-t1',
      topic: 'Algorithm Optimization & Memory Management',
      question: 'Walk me through the most computationally expensive function in your projects. How did you profile its time and space complexity, and how would you optimize it for 10x throughput?',
      contextTip: 'Focus on profiling tools, eliminating redundant nested iterations, and memory cache locality.',
      sampleExpectedPoints: ['Identified O(N^2) bottleneck with profiler', 'Replaced with HashMap/Set for O(N) lookup', 'Cached precomputed states using Redis or in-memory LRU'],
    },
  ],
  'google-sde': [
    {
      id: 'goog-t1',
      topic: 'Distributed Systems & Concurrency',
      question: 'Design a distributed rate limiter that handles 100,000 requests per second across 50 containerized nodes. How do you prevent race conditions and synchronize token state without introducing a database bottleneck?',
      contextTip: 'Mention Redis Sliding Window Log or Token Bucket with Lua scripts to guarantee atomicity.',
      sampleExpectedPoints: ['Token Bucket or Sliding Window Counter', 'Redis cluster with Lua scripts for atomic increments', 'Fallback local in-memory token bucket if Redis latency spikes'],
    },
  ],
  'deloitte-usi': [
    {
      id: 'del-t1',
      topic: 'Cloud Architecture & Enterprise Integration',
      question: 'How do you secure API endpoints and prevent SQL Injection and Cross-Site Scripting (XSS) in an enterprise web application? How do JWT tokens handle session invalidation?',
      contextTip: 'Explain parameterized queries/ORMs, CSP headers, and token refresh/revocation blocklists.',
      sampleExpectedPoints: ['Parameterized queries / prepared statements', 'HTTPOnly, Secure, SameSite cookies for tokens', 'Redis blocklist for immediate token invalidation on logout'],
    },
  ],
  'zepto-startup': [
    {
      id: 'zep-t1',
      topic: 'High-Throughput Low-Latency Engineering',
      question: 'During a flash sale, 20,000 users try to order the last 5 available items at the exact same second. How do you design the checkout and inventory service to prevent double-booking and overselling?',
      contextTip: 'Discuss pessimistic vs optimistic locking, database transactions, and distributed locks with Redis (Redlock).',
      sampleExpectedPoints: ['Pessimistic locking with SELECT ... FOR UPDATE or Redis atomic DECR', 'Message queue (Kafka/RabbitMQ) for serial order ingestion', 'Idempotency key to prevent duplicate payment deductions'],
    },
  ],
};

// Master HR behavioral questions
export const MASTER_HR_QUESTIONS: Record<DriveCompanyKey, HRInterviewQuestion[]> = {
  'tcs-digital': [
    {
      id: 'tcs-h1',
      theme: 'Corporate Commitment & Adaptability',
      scenario: 'TCS projects often require cross-domain mobility, changing technology stacks (e.g. from Python to Mainframes or Java), or relocating to different client hubs across India. How do you handle being assigned to a stack you did not originally study?',
      evaluates: 'Flexibility, willingness to learn enterprise technology, and corporate maturity.',
      idealResponseCriteria: [
        'Emphasizes core fundamentals transfer across languages',
        'Cites past experience learning a framework in days',
        'Positive attitude towards client business impact',
      ],
    },
  ],
  'infosys-sp': [
    {
      id: 'inf-h1',
      theme: 'High Pressure & Problem Solving Under Deadline',
      scenario: 'Tell me about a high-stress academic or project deadline where a critical member of your team dropped out or failed to deliver. What specific actions did you take to protect the delivery?',
      evaluates: 'Accountability, ownership, and composure under pressure.',
      idealResponseCriteria: [
        'Uses the STAR framework (Situation, Task, Action, Result)',
        'Takes personal accountability instead of blaming teammates',
        'Delivered on time with measurable outcome',
      ],
    },
  ],
  'google-sde': [
    {
      id: 'goog-h1',
      theme: 'Googleyness, Disagreement & Intellectual Humility',
      scenario: 'Describe a situation where a technical teammate or senior engineer strongly disagreed with your architectural proposal. How did you handle the debate, and what was the outcome if data proved you were wrong?',
      evaluates: 'Data-driven discussion, lack of ego, and collaborative consensus.',
      idealResponseCriteria: [
        'Used objective benchmarks and data instead of emotional arguments',
        'Graciously accepted superior alternative when evidence supported it',
        'Maintained strong collaborative relationship with colleague',
      ],
    },
  ],
  'deloitte-usi': [
    {
      id: 'del-h1',
      theme: 'Client Relationship & Stakeholder Management',
      scenario: 'Suppose a client insists on an unrealistic deadline for a critical system feature that would compromise software quality and security. How would you communicate with the client to resolve the conflict?',
      evaluates: 'Consulting diplomacy, managing client expectations, and risk management.',
      idealResponseCriteria: [
        'Active listening to client business drivers',
        'Proposing phased delivery (MVP first, full feature next)',
        'Clear, polite explanation of security and brand risk',
      ],
    },
  ],
  'zepto-startup': [
    {
      id: 'zep-h1',
      theme: 'Founder Mindset & Extreme Ownership',
      scenario: 'In a fast-paced startup, there is often no formal documentation or manager telling you what to do next. When production goes down at 11 PM on a Sunday, how do you respond?',
      evaluates: 'Speed of action, ownership mentality, and resilience.',
      idealResponseCriteria: [
        'Jumping in without waiting for assigned tickets',
        'Mitigating user impact first (rollback/failover) before root-cause analysis',
        'Documenting post-mortem to prevent recurrence',
      ],
    },
  ],
};
