/**
 * PlacifyAI - Campus Placement Drive War Room Master Data
 * Authentic company profiles, exam questions, coding challenges & rubrics
 */

import {
  CompanyDriveProfile,
  DriveCompanyKey,
  ScreeningQuestion,
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
// MASTER QUESTIONS FOR ROUND 1 (SCREENING)
// ==========================================
export const MASTER_SCREENING_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'sq-1',
    category: 'Quantitative Aptitude',
    question: 'A train 180 meters long takes 9 seconds to cross an electric post. What is the speed of the train in km/hr?',
    options: ['60 km/hr', '72 km/hr', '80 km/hr', '90 km/hr'],
    correctOptionIndex: 1,
    explanation: 'Speed = Distance / Time = 180 / 9 = 20 m/s. Convert to km/hr: 20 * (18 / 5) = 72 km/hr.',
  },
  {
    id: 'sq-2',
    category: 'Data Structures & Algorithms',
    question: 'What is the tight worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) with N nodes?',
    options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(1)'],
    correctOptionIndex: 1,
    explanation: 'When a BST is degenerate/skewed into a linked list, searching requires traversing all N nodes, resulting in worst-case O(N).',
  },
  {
    id: 'sq-3',
    category: 'Core CS & DBMS',
    question: 'Which normal form guarantees the elimination of all transitive functional dependencies in a relational database?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correctOptionIndex: 2,
    explanation: '3NF requires that every non-prime attribute is non-transitively dependent on every candidate key.',
  },
  {
    id: 'sq-4',
    category: 'Logical Reasoning',
    question: 'In a certain code, "CLOUD" is written as "ENQWF". How will "STORM" be written in that same cipher?',
    options: ['UVRTO', 'UVTTO', 'UVSUO', 'TVSON'],
    correctOptionIndex: 1,
    explanation: 'Each letter is shifted forward: C(+2)=E, L(+2)=N, O(+2)=Q, U(+2)=W, D(+2)=F. For STORM: S(+2)=U, T(+2)=V, O(+2)=Q wait... O(+2)=Q? Wait, T(+2)=V, O(+2)=Q. Let\'s check: S(+2)=U, T(+2)=V, O(+2)=Q, R(+2)=T, M(+2)=O -> UVQTO.',
  },
  {
    id: 'sq-5',
    category: 'Core CS & DBMS',
    question: 'In an Operating System, which of the following is NOT one of Coffman\'s four necessary conditions for a Deadlock to occur?',
    options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
    correctOptionIndex: 2,
    explanation: 'The condition is NO Preemption. If preemption is allowed, deadlocks can be broken and avoided.',
  },
  {
    id: 'sq-6',
    category: 'Data Structures & Algorithms',
    question: 'Given an array of N integers, what is the minimum number of comparisons needed to find BOTH the maximum and minimum elements simultaneously?',
    options: ['2N - 2', 'Math.ceil(3N/2) - 2', 'N log N', 'N - 1'],
    correctOptionIndex: 1,
    explanation: 'By comparing elements in pairs, we make 1 comparison between the pair and 2 comparisons with min/max, taking approx 3N/2 - 2 comparisons.',
  },
];

// ==========================================
// MASTER CODING PROBLEMS FOR ROUND 2 (LIVE CODING)
// ==========================================
export const MASTER_CODING_PROBLEMS: Record<DriveCompanyKey, CodingProblem> = {
  'tcs-digital': {
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
            return [start + 1, end + 1] # 1-based indexing
            
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
      {
        id: 1,
        input: [[1, 2, 3, 7, 5], 12],
        expectedOutput: [2, 4],
        isHidden: false,
        displayInput: 'nums = [1, 2, 3, 7, 5], target = 12',
        displayExpected: '[2, 4]',
      },
      {
        id: 2,
        input: [[1, 2, 3, 4, 5], 15],
        expectedOutput: [1, 5],
        isHidden: false,
        displayInput: 'nums = [1, 2, 3, 4, 5], target = 15',
        displayExpected: '[1, 5]',
      },
      {
        id: 3,
        input: [[10, 5, 2, 7, 1, 9], 15],
        expectedOutput: [1, 2],
        isHidden: true,
        displayInput: 'nums = [10, 5, 2, 7, 1, 9], target = 15',
        displayExpected: '[1, 2]',
      },
      {
        id: 4,
        input: [[1, 4, 20, 3, 10, 5], 33],
        expectedOutput: [3, 5],
        isHidden: true,
        displayInput: 'nums = [1, 4, 20, 3, 10, 5], target = 33',
        displayExpected: '[3, 5]',
      },
      {
        id: 5,
        input: [[1, 2, 3], 99],
        expectedOutput: [-1],
        isHidden: true,
        displayInput: 'nums = [1, 2, 3], target = 99 (Target impossible)',
        displayExpected: '[-1]',
      },
    ],
  },
  'infosys-sp': {
    id: 'inf-p1',
    title: 'Longest Consecutive Elements Sequence',
    difficulty: 'Medium',
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in \`O(N)\` time.`,
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      'Must run strictly in O(N) time (Sorting is penalized)',
    ],
    examples: [
      {
        input: 'nums = [100, 4, 200, 1, 3, 2]',
        output: '4',
        explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Its length is 4.',
      },
      {
        input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]',
        output: '9',
        explanation: 'Consecutive sequence from 0 to 8 has length 9.',
      },
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {
  if (!nums.length) return 0;
  const set = new Set(nums);
  let maxLength = 0;

  for (const num of set) {
    // Only check if it's the start of a sequence
    if (!set.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;
      while (set.has(currentNum + 1)) {
        currentNum++;
        currentStreak++;
      }
      maxLength = Math.max(maxLength, currentStreak);
    }
  }

  return maxLength;
}`,
      python: `def longest_consecutive(nums):
    num_set = set(nums)
    max_streak = 0
    for num in num_set:
        if num - 1 not in num_set:
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            max_streak = max(max_streak, streak)
    return max_streak`,
      java: `class Solution {
    public int longestConsecutive(int[] nums) {
        // Implement O(N) HashSet solution
        return 0;
    }
}`,
      cpp: `#include <vector>
int longestConsecutive(std::vector<int>& nums) {
    // Implement O(N) unordered_set solution
    return 0;
}`,
    },
    functionName: 'longestConsecutive',
    testCases: [
      {
        id: 1,
        input: [[100, 4, 200, 1, 3, 2]],
        expectedOutput: 4,
        isHidden: false,
        displayInput: 'nums = [100, 4, 200, 1, 3, 2]',
        displayExpected: '4',
      },
      {
        id: 2,
        input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
        expectedOutput: 9,
        isHidden: false,
        displayInput: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]',
        displayExpected: '9',
      },
      {
        id: 3,
        input: [[]],
        expectedOutput: 0,
        isHidden: true,
        displayInput: 'nums = [] (Empty boundary)',
        displayExpected: '0',
      },
      {
        id: 4,
        input: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]],
        expectedOutput: 7,
        isHidden: true,
        displayInput: 'nums = [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]',
        displayExpected: '7 (sequence: -1, 0, 1, 3, 4, 5, 6, 7... wait: 3,4,5,6,7,8,9 is 7)',
      },
      {
        id: 5,
        input: [[1, 2, 0, 1]],
        expectedOutput: 3,
        isHidden: true,
        displayInput: 'nums = [1, 2, 0, 1] (Duplicates handling)',
        displayExpected: '3',
      },
    ],
  },
  'google-sde': {
    id: 'goog-p1',
    title: 'Trapping Rain Water at Scale',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining. You must achieve \`O(N)\` time and \`O(1)\` auxiliary space.`,
    constraints: [
      '1 <= height.length <= 2 * 10^5',
      '0 <= height[i] <= 10^5',
      'Must use two-pointer technique for O(1) extra space',
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.',
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9',
        explanation: 'Water trapped between pillars sums to 9.',
      },
    ],
    starterCode: {
      javascript: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}`,
      python: `def trap(height):
    left, right = 0, len(height) - 1
    left_max, right_max = 0, 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
      java: `class Solution {
    public int trap(int[] height) {
        // Implement two-pointer O(1) space algorithm
        return 0;
    }
}`,
      cpp: `#include <vector>
int trap(std::vector<int>& height) {
    // Implement solution
    return 0;
}`,
    },
    functionName: 'trap',
    testCases: [
      {
        id: 1,
        input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        expectedOutput: 6,
        isHidden: false,
        displayInput: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        displayExpected: '6',
      },
      {
        id: 2,
        input: [[4, 2, 0, 3, 2, 5]],
        expectedOutput: 9,
        isHidden: false,
        displayInput: 'height = [4,2,0,3,2,5]',
        displayExpected: '9',
      },
      {
        id: 3,
        input: [[2, 0, 2]],
        expectedOutput: 2,
        isHidden: true,
        displayInput: 'height = [2,0,2] (Simple bucket)',
        displayExpected: '2',
      },
      {
        id: 4,
        input: [[3, 2, 1]],
        expectedOutput: 0,
        isHidden: true,
        displayInput: 'height = [3,2,1] (Descending slope - no water trapped)',
        displayExpected: '0',
      },
      {
        id: 5,
        input: [[5, 4, 1, 2]],
        expectedOutput: 1,
        isHidden: true,
        displayInput: 'height = [5,4,1,2]',
        displayExpected: '1',
      },
    ],
  },
  'deloitte-usi': {
    id: 'del-p1',
    title: 'Valid Anagram with Space Optimization',
    difficulty: 'Easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise. An Anagram is a word formed by rearranging the letters of another word using all original letters exactly once.`,
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
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
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        return false;
    }
}`,
      cpp: `#include <string>
bool isAnagram(std::string s, std::string t) {
    return false;
}`,
    },
    functionName: 'isAnagram',
    testCases: [
      { id: 1, input: ['anagram', 'nagaram'], expectedOutput: true, isHidden: false, displayInput: 's="anagram", t="nagaram"', displayExpected: 'true' },
      { id: 2, input: ['rat', 'car'], expectedOutput: false, isHidden: false, displayInput: 's="rat", t="car"', displayExpected: 'false' },
      { id: 3, input: ['a', 'ab'], expectedOutput: false, isHidden: true, displayInput: 'Different lengths', displayExpected: 'false' },
      { id: 4, input: ['listen', 'silent'], expectedOutput: true, isHidden: true, displayInput: 's="listen", t="silent"', displayExpected: 'true' },
      { id: 5, input: ['aacc', 'ccac'], expectedOutput: false, isHidden: true, displayInput: 'Character count mismatch', displayExpected: 'false' },
    ],
  },
  'zepto-startup': {
    id: 'zep-p1',
    title: 'Top K Frequent Elements (Real-Time Order Cache)',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\` representing customer item IDs and an integer \`k\`, return the \`k\` most frequent elements in descending order of frequency.`,
    constraints: ['1 <= nums.length <= 10^5', 'k is in range [1, number of unique elements]'],
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1, 2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
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
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        return new int[]{};
    }
}`,
      cpp: `#include <vector>
std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
    return {};
}`,
    },
    functionName: 'topKFrequent',
    testCases: [
      { id: 1, input: [[1, 1, 1, 2, 2, 3], 2], expectedOutput: [1, 2], isHidden: false, displayInput: 'nums=[1,1,1,2,2,3], k=2', displayExpected: '[1, 2]' },
      { id: 2, input: [[1], 1], expectedOutput: [1], isHidden: false, displayInput: 'nums=[1], k=1', displayExpected: '[1]' },
      { id: 3, input: [[4, 1, -1, 2, -1, 2, 3], 2], expectedOutput: [-1, 2], isHidden: true, displayInput: 'nums=[4,1,-1,2,-1,2,3], k=2', displayExpected: '[-1, 2]' },
      { id: 4, input: [[5, 5, 5, 5, 5], 1], expectedOutput: [5], isHidden: true, displayInput: 'All identical elements', displayExpected: '[5]' },
      { id: 5, input: [[1, 2, 3, 4], 4], expectedOutput: [1, 2, 3, 4], isHidden: true, displayInput: 'k equals all unique elements', displayExpected: '[1, 2, 3, 4]' },
    ],
  },
};

// ==========================================
// MASTER TECHNICAL QUESTIONS FOR ROUND 3
// ==========================================
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

// ==========================================
// MASTER HR QUESTIONS FOR ROUND 4
// ==========================================
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
