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
    {
      id: 'quant-7',
      category: 'Quantitative Aptitude',
      question: 'In a 60-liter mixture of milk and water, the ratio of milk to water is 2:1. How much water (in liters) must be added to make the ratio 1:2?',
      options: ['40 liters', '50 liters', '60 liters', '75 liters'],
      correctOptionIndex: 2,
      explanation: 'Initial milk = 60 * (2/3) = 40L, water = 20L. Let x liters of water be added. Then 40 / (20 + x) = 1/2 => 20 + x = 80 => x = 60 liters.',
    },
    {
      id: 'quant-8',
      category: 'Quantitative Aptitude',
      question: 'A boat travels 36 km downstream in 2 hours and takes 4 hours to travel 24 km upstream. What is the speed of the boat in still water?',
      options: ['10 km/hr', '12 km/hr', '14 km/hr', '15 km/hr'],
      correctOptionIndex: 1,
      explanation: 'Downstream speed (u + v) = 36 / 2 = 18 km/hr. Upstream speed (u - v) = 24 / 4 = 6 km/hr. Speed in still water u = (18 + 6) / 2 = 12 km/hr.',
    },
    {
      id: 'quant-9',
      category: 'Quantitative Aptitude',
      question: 'In how many different ways can the letters of the word "CORPORATE" be arranged so that all the vowels always come together?',
      options: ['2160', '3600', '4320', '8640'],
      correctOptionIndex: 2,
      explanation: 'Word has 9 letters: C, R, P, R, T (5 consonants, R repeats twice) and O, O, A, E (4 vowels, O repeats twice). Treat vowels as 1 unit: 6 items arranged in 6! / 2! = 360 ways. Vowels arranged among themselves in 4! / 2! = 12 ways. Total = 360 * 12 = 4320 ways.',
    },
    {
      id: 'quant-10',
      category: 'Quantitative Aptitude',
      question: 'The ratio of the present ages of a father and his son is 7:3. Ten years from now, the ratio will become 2:1. What is the father\'s present age?',
      options: ['56 years', '63 years', '70 years', '77 years'],
      correctOptionIndex: 2,
      explanation: 'Let present ages be 7x and 3x. (7x + 10) / (3x + 10) = 2/1 => 7x + 10 = 6x + 20 => x = 10. Father’s age = 7 * 10 = 70 years.',
    },
    {
      id: 'quant-11',
      category: 'Quantitative Aptitude',
      question: 'What least number must be added to 1056 so that the sum is completely divisible by 23?',
      options: ['2', '3', '18', '21'],
      correctOptionIndex: 0,
      explanation: '1056 / 23 = 45 with a remainder of 21 (since 45 * 23 = 1035, 1056 - 1035 = 21). Number to add = 23 - 21 = 2. (1056 + 2 = 1058 = 46 * 23).',
    },
    {
      id: 'quant-12',
      category: 'Quantitative Aptitude',
      question: 'If the price of a cloud database subscription increases by 25%, by what percentage must an engineering department reduce usage so that total expenditure remains unchanged?',
      options: ['15%', '20%', '22.5%', '25%'],
      correctOptionIndex: 1,
      explanation: 'Reduction % = [r / (100 + r)] * 100 = [25 / 125] * 100 = (1/5) * 100 = 20%.',
    },
    {
      id: 'quant-13',
      category: 'Quantitative Aptitude',
      question: 'The average weight of a team of 8 software engineers increases by 2.5 kg when a new hire replaces an engineer weighing 65 kg. What is the weight of the new hire?',
      options: ['75 kg', '80 kg', '85 kg', '90 kg'],
      correctOptionIndex: 2,
      explanation: 'Total weight increase = 8 * 2.5 = 20 kg. Weight of new engineer = 65 + 20 = 85 kg.',
    },
    {
      id: 'quant-14',
      category: 'Quantitative Aptitude',
      question: 'Two runners start at the same time from points A and B towards each other at 18 km/hr and 24 km/hr. If the distance between A and B is 84 km, at what distance from point A will they cross each other?',
      options: ['32 km', '36 km', '42 km', '48 km'],
      correctOptionIndex: 1,
      explanation: 'Relative speed = 18 + 24 = 42 km/hr. Time to meet = 84 / 42 = 2 hours. Distance from A = 18 * 2 = 36 km.',
    },
    {
      id: 'quant-15',
      category: 'Quantitative Aptitude',
      question: 'A and B start a SaaS venture investing in the ratio 3:5. After 6 months, C joins with an investment equal to B\'s. In what ratio should the annual profits be distributed among A, B, and C?',
      options: ['3 : 5 : 5', '6 : 10 : 5', '3 : 5 : 2.5', '6 : 5 : 5'],
      correctOptionIndex: 1,
      explanation: 'Ratio of effective investments = (3 * 12) : (5 * 12) : (5 * 6) = 36 : 60 : 30. Divide by 6: 6 : 10 : 5.',
    },
    {
      id: 'quant-16',
      category: 'Quantitative Aptitude',
      question: 'A retailer sells two servers at ₹48,000 each. On one, he makes a profit of 20%, and on the other, he incurs a loss of 20%. What is his overall transaction outcome?',
      options: ['No profit, no loss', '2% loss', '4% loss', '4% profit'],
      correctOptionIndex: 2,
      explanation: 'When two items are sold at the same selling price with x% gain on one and x% loss on the other, there is always an overall loss of (x/10)^2 % = (20/10)^2 = 4% loss.',
    },
    {
      id: 'quant-17',
      category: 'Quantitative Aptitude',
      question: 'A sum of money triples (3x) itself in 4 years at compound interest compounded annually. In how many years will it become 27 times itself at the same interest rate?',
      options: ['8 years', '10 years', '12 years', '16 years'],
      correctOptionIndex: 2,
      explanation: 'Under compound interest, if P becomes 3P in 4 years, it becomes 3^n * P in 4n years. 27 = 3^3, so time = 4 * 3 = 12 years.',
    },
    {
      id: 'quant-18',
      category: 'Quantitative Aptitude',
      question: 'Two unbiased six-faced dice are rolled simultaneously. What is the probability that the sum of the numbers obtained is a prime number?',
      options: ['11/36', '13/36', '5/12', '17/36'],
      correctOptionIndex: 2,
      explanation: 'Possible prime sums are 2, 3, 5, 7, 11. Sum 2: (1,1)=1; Sum 3: (1,2),(2,1)=2; Sum 5: (1,4),(2,3),(3,2),(4,1)=4; Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1)=6; Sum 11: (5,6),(6,5)=2. Total favorable outcomes = 1+2+4+6+2 = 15. P = 15/36 = 5/12.',
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
    {
      id: 'logic-7',
      category: 'Logical Reasoning',
      question: 'Six friends P, Q, R, S, T, and U are seated around a circular table facing the center. Q is between P and R. T is opposite Q. S is immediately to the left of P. Who is seated directly opposite P?',
      options: ['R', 'S', 'U', 'T'],
      correctOptionIndex: 0,
      explanation: 'Q is between P and R. Since T is opposite Q, the circular arrangement has P and R facing each other across the circle, with S next to P. Hence, R sits opposite P.',
    },
    {
      id: 'logic-8',
      category: 'Logical Reasoning',
      question: 'At what time between 3:00 and 4:00 will the minute and hour hands of a clock coincide (overlap)?',
      options: ['3 hours 15 minutes', '3 hours 16 4/11 minutes', '3 hours 17 2/11 minutes', '3 hours 18 minutes'],
      correctOptionIndex: 1,
      explanation: 'At 3 o\'clock, hour hand is at 15-minute mark. Relative speed of minute hand over hour hand is 55/60 min/min. Time = 15 * (60/55) = 180/11 = 16 4/11 minutes past 3.',
    },
    {
      id: 'logic-9',
      category: 'Logical Reasoning',
      question: 'If 15th August 2024 was a Thursday, which day of the week was 15th August 2025?',
      options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
      correctOptionIndex: 1,
      explanation: '2024 is a leap year, but August 2024 is after February 29th. The period from 15 Aug 2024 to 15 Aug 2025 has 365 days (1 odd day). Thursday + 1 day = Friday.',
    },
    {
      id: 'logic-10',
      category: 'Logical Reasoning',
      question: 'Find the next term in the alphabetical progression: BDF, CFI, DHL, ?',
      options: ['EIO', 'EJM', 'EJO', 'EKP'],
      correctOptionIndex: 2,
      explanation: '1st letter: B(+1)=C, C(+1)=D, D(+1)=E. 2nd letter: D(+2)=F, F(+2)=H, H(+2)=J. 3rd letter: F(+3)=I, I(+3)=L, L(+3)=O. Next term = EJO.',
    },
    {
      id: 'logic-11',
      category: 'Logical Reasoning',
      question: 'Statement: "PlacifyAI simulates authentic corporate placement drives to prepare engineering students for rigorous campus eliminations." Assumptions: (I) Pre-placement simulation helps students overcome drive anxiety and technical barriers. (II) Company recruitment panels prefer candidates who have practiced standard drive formats.',
      options: ['Only Assumption I is implicit', 'Only Assumption II is implicit', 'Both Assumptions I and II are implicit', 'Neither is implicit'],
      correctOptionIndex: 0,
      explanation: 'Assumption I is directly underlying the reason why the simulator exists to prepare students. Assumption II makes an unsubstantiated generalization about interview panels preferring specific prep tools.',
    },
    {
      id: 'logic-12',
      category: 'Logical Reasoning',
      question: 'Complete the analogy: ARCHITECT : BLUEPRINT :: SOFTWARE DEVELOPER : ?',
      options: ['MONITOR', 'SOURCE CODE', 'HARDWARE', 'PRINTER'],
      correctOptionIndex: 1,
      explanation: 'An architect designs and produces a blueprint as their primary technical specification; a software developer designs and writes source code.',
    },
    {
      id: 'logic-13',
      category: 'Logical Reasoning',
      question: 'Find the odd/incorrect number in the given series: 3, 7, 15, 31, 64, 127, 255',
      options: ['15', '31', '64', '127'],
      correctOptionIndex: 2,
      explanation: 'The rule is (prev * 2) + 1: 3*2+1=7, 7*2+1=15, 15*2+1=31, 31*2+1=63. But here 64 is given instead of 63 (and 63*2+1=127). So 64 is wrong.',
    },
    {
      id: 'logic-14',
      category: 'Logical Reasoning',
      question: 'A solid wooden cube of side 4 cm is painted red on all six faces. It is then cut into smaller unit cubes of side 1 cm each. How many of the smaller cubes have painted faces on EXACTLY two sides?',
      options: ['12', '16', '24', '32'],
      correctOptionIndex: 2,
      explanation: 'For an n x n x n cube, cubes with exactly 2 faces painted lie on the edges (excluding corners): 12 * (n - 2). Here n = 4, so 12 * (4 - 2) = 12 * 2 = 24.',
    },
    {
      id: 'logic-15',
      category: 'Logical Reasoning',
      question: 'In a certain military code, "256" means "you are good", "637" means "we are bad", and "358" means "good and bad". Which numeric digit stands for the word "and"?',
      options: ['2', '3', '5', '8'],
      correctOptionIndex: 3,
      explanation: 'In (1) and (3), common digit is "5", common word is "good" -> good = 5. In (2) and (3), common digit is "3", common word is "bad" -> bad = 3. In (3), remaining digit is 8 and word is "and". So "and" = 8.',
    },
    {
      id: 'logic-16',
      category: 'Logical Reasoning',
      question: 'Karan starts walking towards the South. After walking 25 meters, he turns to his left and walks 30 meters. He then turns to his left again and walks 25 meters. In which direction and at what distance is he now from his starting point?',
      options: ['30m East', '30m West', '25m North', '55m South-East'],
      correctOptionIndex: 0,
      explanation: 'South 25m, turn left (East) 30m, turn left (North) 25m. South and North cancel out. He is 30m East of the starting point.',
    },
    {
      id: 'logic-17',
      category: 'Logical Reasoning',
      question: 'What is Rohan\'s rank from the top in a class of 45 students? Statement I: Rohan is 5 ranks behind Akash, who is 18th from the bottom. Statement II: Rohan is 8 ranks ahead of Priya, who is 30th from the top.',
      options: ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Either Statement I alone or Statement II alone is sufficient', 'Both statements together are insufficient'],
      correctOptionIndex: 2,
      explanation: 'From I: Akash is 18th from bottom, so Akash is (45 - 18 + 1) = 28th from top. Rohan is 5 ranks behind Akash = 28 + 5 = 33rd from top. From II: Priya is 30th from top. Rohan is 8 ranks ahead = 30 - 8 = 22nd. Each statement independently allows determining Rohan\'s rank.',
    },
    {
      id: 'logic-18',
      category: 'Logical Reasoning',
      question: 'Pointing to a gentleman, Anjali said: "His only brother is the father of my daughter\'s father." How is the gentleman related to Anjali\'s husband?',
      options: ['Father', 'Uncle (Paternal)', 'Brother', 'Grandfather'],
      correctOptionIndex: 1,
      explanation: 'My daughter\'s father is Anjali\'s husband. The father of Anjali\'s husband is the father-in-law. The gentleman is the brother of that father. Hence, he is the paternal uncle of Anjali\'s husband.',
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
    {
      id: 'verb-6',
      category: 'Verbal Ability',
      question: 'Choose the word that is most nearly SIMILAR in meaning to the word: EPHEMERAL',
      options: ['Permanent', 'Transient', 'Perpetual', 'Tenacious'],
      correctOptionIndex: 1,
      explanation: '"Ephemeral" means lasting for a very short time; transient, fleeting, or momentary.',
    },
    {
      id: 'verb-7',
      category: 'Verbal Ability',
      question: 'Select the one-word substitution for: "An uncontrollable and obsessive urge to steal items regardless of economic need"',
      options: ['Pyromania', 'Megalomania', 'Kleptomania', 'Dipsomania'],
      correctOptionIndex: 2,
      explanation: 'Kleptomania is an impulse control disorder characterized by the recurrent failure to resist the urge to steal items.',
    },
    {
      id: 'verb-8',
      category: 'Verbal Ability',
      question: 'Choose the correct meaning of the business idiom: "To burn the midnight oil"',
      options: ['To waste corporate energy resources', 'To work diligently late into the night', 'To destroy confidential records', 'To shut down an unprofitable subsidiary'],
      correctOptionIndex: 1,
      explanation: '"Burning the midnight oil" means working or studying deep into the late night hours.',
    },
    {
      id: 'verb-9',
      category: 'Verbal Ability',
      question: 'Identify the grammatically INCORRECT part in the sentence: "The chief technology officer (A) along with his core team of lead architects (B) have approved the microservices migration plan (C) ahead of the quarterly review (D)."',
      options: ['(A)', '(B)', '(C)', '(D)'],
      correctOptionIndex: 2,
      explanation: 'When a subject is joined with other nouns using "along with", "as well as", or "together with", the verb agrees with the primary subject ("The chief technology officer" - singular). Therefore, it should be "has approved", not "have approved".',
    },
    {
      id: 'verb-10',
      category: 'Verbal Ability',
      question: 'Fill in the blank with the most appropriate word: "Due to unprecedented traffic spikes during the product launch, the infrastructure proved to be remarkably _______, scaling seamlessly without latency degradation."',
      options: ['fragile', 'resilient', 'erratic', 'obsolete'],
      correctOptionIndex: 1,
      explanation: '"Resilient" refers to the ability to withstand or recover quickly from difficult conditions or sudden spikes.',
    },
    {
      id: 'verb-11',
      category: 'Verbal Ability',
      question: 'Rearrange the sentences into a coherent paragraph:\nP: Predictive telemetry continuously monitors rotational vibrations in server cooling systems.\nQ: Modern cloud data centers deploy automated machine learning models for hardware diagnostics.\nR: This enables automated dispatch of technicians before catastrophic failure occurs.\nS: When anomalous acoustic signatures deviate from baseline thresholds, alerts are triggered.',
      options: ['Q - P - S - R', 'P - Q - R - S', 'S - R - Q - P', 'Q - S - P - R'],
      correctOptionIndex: 0,
      explanation: 'Q introduces the overall diagnostic domain; P describes the specific telemetry monitoring; S describes the threshold breach detection; R concludes with the mitigation action.',
    },
    {
      id: 'verb-12',
      category: 'Verbal Ability',
      question: 'Choose the word that is most nearly OPPOSITE in meaning to the word: CANDID',
      options: ['Frank', 'Deceitful', 'Outspoken', 'Sincere'],
      correctOptionIndex: 1,
      explanation: '"Candid" means truthful, straightforward, and sincere. Its direct antonym is deceitful or devious.',
    },
    {
      id: 'verb-13',
      category: 'Verbal Ability',
      question: 'Complete the analogy: EPILOGUE : NOVEL :: ?',
      options: ['PRELUDE : OPERA', 'CODA : SYMPHONY', 'ACT : PLAY', 'STANZA : POEM'],
      correctOptionIndex: 1,
      explanation: 'An epilogue is the concluding section that rounds out a literary novel, just as a coda is the concluding musical passage that brings a symphony to an artistic close.',
    },
    {
      id: 'verb-14',
      category: 'Verbal Ability',
      question: 'Fill in the blank with the appropriate preposition: "The internal audit committee agreed to look _______ the anonymous allegations of insider trading."',
      options: ['into', 'after', 'upon', 'through'],
      correctOptionIndex: 0,
      explanation: 'The phrasal verb "look into" means to investigate or examine the facts of a situation.',
    },
    {
      id: 'verb-15',
      category: 'Verbal Ability',
      question: 'Select the option that correctly completes the sentence: "The engineering VP gave an inspiring keynote, _______ the developers to adopt generative AI tooling into their day-to-day workflow."',
      options: ['exhorting', 'admonishing', 'ostracizing', 'reproaching'],
      correctOptionIndex: 0,
      explanation: '"Exhorting" means strongly encouraging, urging, or motivating someone to take positive action.',
    },
    {
      id: 'verb-16',
      category: 'Verbal Ability',
      question: 'Select the word that is spelled correctly according to standard corporate English:',
      options: ['Millenium', 'Millennium', 'Milenium', 'Milennium'],
      correctOptionIndex: 1,
      explanation: '"Millennium" is spelled with double \'l\' and double \'n\' (m-i-l-l-e-n-n-i-u-m).',
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
    {
      id: 'cs-7',
      category: 'Core CS & Technical Logic',
      question: 'Which data structure is primarily utilized by compilers, language runtimes, and operating systems to manage function activation records and local variable scope during nested recursion?',
      options: ['Queue', 'Call Stack', 'Binary Heap', 'Hash Table'],
      correctOptionIndex: 1,
      explanation: 'A Call Stack utilizes LIFO (Last In First Out) semantics to push activation records/stack frames during nested function calls and pop them when execution returns.',
    },
    {
      id: 'cs-8',
      category: 'Core CS & Technical Logic',
      question: 'In operating system virtual memory management, what is the critical performance state where the system spends significantly more time swapping pages between RAM and swap space than executing application code?',
      options: ['Fragmentation', 'Thrashing', 'Segmentation Fault', 'Starvation'],
      correctOptionIndex: 1,
      explanation: 'Thrashing occurs when the collective working set of active processes exceeds physical memory, causing continuous page faults and disk I/O saturation.',
    },
    {
      id: 'cs-9',
      category: 'Core CS & Technical Logic',
      question: 'In the standard OSI 7-layer networking architecture, at which layer does the Address Resolution Protocol (ARP) operate to map logical IPv4 addresses to physical MAC addresses?',
      options: ['Application Layer (Layer 7)', 'Transport Layer (Layer 4)', 'Network Layer (Layer 3)', 'Data Link Layer (Layer 2)'],
      correctOptionIndex: 3,
      explanation: 'ARP operates primarily at Layer 2 (Data Link Layer) to translate Layer 3 IPv4 addresses into Layer 2 physical Ethernet/MAC addresses.',
    },
    {
      id: 'cs-10',
      category: 'Core CS & Technical Logic',
      question: 'In database ACID transaction guarantees, which property ensures that once a transaction has committed, its updates persist permanently in storage even in the event of an immediate power outage or system crash?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctOptionIndex: 3,
      explanation: 'Durability guarantees that write-ahead logs (WAL) or committed database changes will survive sudden system failure or server reboots.',
    },
    {
      id: 'cs-11',
      category: 'Core CS & Technical Logic',
      question: 'What is the tight worst-case time complexity of the standard QuickSort algorithm when the pivot chosen is always the smallest or largest element in an already sorted array?',
      options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(2^N)'],
      correctOptionIndex: 2,
      explanation: 'If partition splits are consistently maximally unbalanced (1 element and N-1 elements), QuickSort recurses N times with O(N) work per level, leading to O(N^2).',
    },
    {
      id: 'cs-12',
      category: 'Core CS & Technical Logic',
      question: 'Which Object-Oriented Design principle in SOLID asserts that objects of a superclass should be replaceable with objects of a subclass without affecting the correctness or contract of the application?',
      options: ['Single Responsibility Principle (SRP)', 'Open-Closed Principle (OCP)', 'Liskov Substitution Principle (LSP)', 'Interface Segregation Principle (ISP)'],
      correctOptionIndex: 2,
      explanation: 'The Liskov Substitution Principle states that subtypes must adhere to all behavioral contracts and pre/post-conditions established by their base type.',
    },
    {
      id: 'cs-13',
      category: 'Core CS & Technical Logic',
      question: 'In concurrent programming, what is the term for a concurrency anomaly where two or more threads continuously alter their execution states in response to each other without making any forward progress, yet neither thread is blocked or sleeping?',
      options: ['Deadlock', 'Livelock', 'Race Condition', 'Priority Inversion'],
      correctOptionIndex: 1,
      explanation: 'In a livelock, active threads remain in running states and consume CPU cycles responding to each other\'s state transitions without completing useful work.',
    },
    {
      id: 'cs-14',
      category: 'Core CS & Technical Logic',
      question: 'What is the output of the following C code snippet?\nint arr[] = {10, 20, 30, 40};\nint *ptr = arr;\nprintf("%d", *(ptr + 2));',
      options: ['10', '20', '30', '40'],
      correctOptionIndex: 2,
      explanation: 'Pointer arithmetic: arr points to arr[0] (10). ptr + 2 points to arr[2], which contains the value 30. Dereferencing *(ptr + 2) prints 30.',
    },
    {
      id: 'cs-15',
      category: 'Core CS & Technical Logic',
      question: 'Which distributed systems algorithmic technique is widely employed by distributed caches (e.g. Memcached, DynamoDB) to minimize data migration when cluster nodes are added or removed dynamically?',
      options: ['Linear Probing', 'Consistent Hashing', 'Double Hashing', 'Round Robin Scheduling'],
      correctOptionIndex: 1,
      explanation: 'Consistent hashing maps keys and nodes to a circular hash ring, ensuring that adding or removing a node only impacts k/N keys instead of re-mapping all keys.',
    },
    {
      id: 'cs-16',
      category: 'Core CS & Technical Logic',
      question: 'In modern CPU memory management units (MMU), what is the primary role of the Translation Lookaside Buffer (TLB)?',
      options: ['To store compiled machine bytecode', 'To cache virtual-to-physical address translations and prevent multiple memory bus traversals', 'To manage the branch prediction pipeline', 'To execute floating-point vector calculations'],
      correctOptionIndex: 1,
      explanation: 'The TLB is a high-speed hardware cache that stores recent virtual-to-physical page table mappings, eliminating the need to traverse multi-level page tables in DRAM on every memory access.',
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
    {
      id: 'sit-5',
      category: 'Situational Judgment',
      question: 'You realize on Wednesday afternoon that an assigned sprint feature will take 3 additional days due to unforeseen third-party API rate limits, which will miss Friday\'s sprint demo. What should you do?',
      options: [
        'Keep quiet, work 18 hours each day, and hope to finish before anyone notices',
        'Immediately raise the blocker on Slack and during standup, explaining the API constraint and offering an adjusted scope for Friday',
        'Blame the third-party API provider publicly and request cancellation of the sprint',
        'Commit incomplete code with commented-out tests so the CI pipeline passes',
      ],
      correctOptionIndex: 1,
      explanation: 'Transparent and prompt escalation allows the scrum master and team to re-plan, rebalance story points, or agree on a reduced MVP demo scope without surprise deadline failures.',
    },
    {
      id: 'sit-6',
      category: 'Situational Judgment',
      question: 'A senior engineer frequently uses "--no-verify" to bypass local pre-commit hooks and pushes code directly that breaks automated TypeScript build checks on CI. How should you address this?',
      options: [
        'Start using "--no-verify" yourself to speed up your own commits',
        'Publicly shame the senior engineer in the company-wide #general channel',
        'Politely speak with the engineer in private to understand their workflow friction, and propose making CI branch protections mandatory on main',
        'Silently fix their build errors after hours without saying anything',
      ],
      correctOptionIndex: 2,
      explanation: 'Private constructive feedback addresses workflow pain points diplomatically, while recommending repository branch protections eliminates bypass vulnerabilities systematically.',
    },
    {
      id: 'sit-7',
      category: 'Situational Judgment',
      question: 'During an exploratory database query, you inadvertently discover that an internal microservice has been writing unmasked customer credit card numbers into application access logs. What is your immediate obligation?',
      options: [
        'Post a screenshot of the card numbers on an internal tech Slack channel to warn colleagues',
        'Immediately alert your Engineering Manager and the Security/Data Protection Officer (DPO) so log retention can be purged and masking applied',
        'Ignore it since it is an internal log file accessible only by developers',
        'Export the log file to your personal laptop as evidence',
      ],
      correctOptionIndex: 1,
      explanation: 'Security incidents involving sensitive customer financial data must be immediately escalated through official incident response and data protection channels to contain enterprise liability.',
    },
    {
      id: 'sit-8',
      category: 'Situational Judgment',
      question: 'During a sprint design discussion, two software engineers get into a heated argument over whether to use GraphQL or REST for a new public endpoint with a tight client deadline. How should the team reach a consensus?',
      options: [
        'Pick whichever engineer has higher seniority and dismiss the other',
        'Evaluate both against concrete project requirements (existing client tooling, schema caching, deadline constraints) and select the lowest-risk approach with a documented decision record (ADR)',
        'Spend two weeks building prototypes for both before making any decision',
        'Flip a coin to decide arbitrarily',
      ],
      correctOptionIndex: 1,
      explanation: 'Architectural decisions should be driven by objective project constraints, client compatibility, and formal Architecture Decision Records (ADRs) rather than hierarchy or personal preference.',
    },
    {
      id: 'sit-9',
      category: 'Situational Judgment',
      question: 'You notice that a contractor has accidentally committed a live AWS Production Secret Key into a public open-source repository commit history. What is the immediate first step to execute?',
      options: [
        'Immediately revoke and rotate the compromised AWS IAM access key in the AWS Console, then audit CloudTrail logs for unauthorized access',
        'Write a polite email to the contractor asking them to remove the key when they start work tomorrow',
        'Make a new commit overwriting the key file with blank text',
        'File a low-priority Jira ticket for sprint planning next week',
      ],
      correctOptionIndex: 0,
      explanation: 'Publicly exposed cloud credentials are systematically scanned by bots within seconds. The immediate containment step is credential revocation and rotation, followed by access audit.',
    },
    {
      id: 'sit-10',
      category: 'Situational Judgment',
      question: 'A delivery manager asks you to modify code coverage reports and suppress failing integration tests in order to present a "100% Green" status dashboard to a prospective enterprise buyer. How should you respond?',
      options: [
        'Comply immediately since the manager is your direct superior',
        'Politely decline to falsify quality metrics, explain the severe operational risk of delivering defective software, and offer to present the genuine status alongside an actionable remediation timeline',
        'Resign on the spot without explaining your decision',
        'Falsify the report but leave an anonymous note on the customer support portal',
      ],
      correctOptionIndex: 1,
      explanation: 'Professional ethics and software reliability require refusing to falsify compliance or testing telemetry, while constructively offering a transparent remediation roadmap to protect the client and organization.',
    },
    {
      id: 'sit-11',
      category: 'Situational Judgment',
      question: 'You are assigned to build an urgent feature in a fragile legacy monolithic codebase with zero automated unit tests. Any modification risks breaking existing enterprise workflows. What is the most sound engineering strategy?',
      options: [
        'Refactor the entire monolith from scratch before writing the feature',
        'Add characterization integration tests around the existing workflow first, implement the new feature modularly, and write regression tests for the new path',
        'Ship the code quickly without testing and rely on customer complaints to identify broken flows',
        'Refuse to work on the legacy system',
      ],
      correctOptionIndex: 1,
      explanation: 'Writing characterization / regression tests around legacy behavior establishes a safety net, allowing new feature development with minimal risk of breaking undocumented legacy behavior.',
    },
    {
      id: 'sit-12',
      category: 'Situational Judgment',
      question: 'During an executive demo in front of prospective clients, your live staging environment unexpectedly throws a 500 Internal Server error. How should you conduct yourself?',
      options: [
        'Blame the DevOps team for failing to maintain server stability',
        'Remain calm, candidly acknowledge the unexpected glitch, seamlessly switch to a pre-recorded backup demo or architectural slide deck, and investigate the error immediately following the meeting',
        'Pretend nothing happened and stare at the error screen until someone else speaks',
        'Abruptly disconnect from the call and log off',
      ],
      correctOptionIndex: 1,
      explanation: 'Professional poise and executive maturity in the face of unexpected technical glitches inspire confidence; having a backup walkthrough prevents derailment of high-stakes stakeholder meetings.',
    },
  ],
};

/**
 * Generates an authentic, fresh, randomized 20-question corporate paper for Round 1.
 * Distribution mirrors corporate placement exams (TCS NQT, Infosys, Deloitte, Google OA):
 * - 5 Quantitative Aptitude
 * - 5 Logical Reasoning
 * - 4 Verbal Ability
 * - 4 Core CS & Technical Logic
 * - 2 Situational Judgment
 * Total = 20 questions. Completely randomized on every single attempt!
 */
export function generateRandomizedScreeningPaper(
  companyKey: DriveCompanyKey
): ScreeningQuestion[] {
  const distribution: Record<ScreeningCategory, number> = {
    'Quantitative Aptitude': 5,
    'Logical Reasoning': 5,
    'Verbal Ability': 4,
    'Core CS & Technical Logic': 4,
    'Situational Judgment': 2,
  };

  const selectedPaper: ScreeningQuestion[] = [];

  (Object.keys(distribution) as ScreeningCategory[]).forEach((cat) => {
    const count = distribution[cat];
    const pool = MASTER_QUESTION_BANK[cat] || [];
    if (pool.length > 0) {
      // Shuffle pool copy
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      // Pick required number of questions for this section
      selectedPaper.push(...shuffled.slice(0, count));
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
    {
      id: 'tcs-t3',
      topic: 'Microservices & REST API Idempotency',
      question: 'In a distributed microservice setup, how do you ensure that payment and order placement endpoints are idempotent so network retries do not cause duplicate transactions?',
      contextTip: 'Discuss unique idempotency keys (UUIDs), distributed cache/database atomic locks, and handling duplicate retry payloads.',
      sampleExpectedPoints: ['Unique idempotency key generated per client request', 'Atomic lock check in Redis or DB constraint before processing', 'Returning cached prior response if same idempotency key is received'],
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
    {
      id: 'inf-t2',
      topic: 'Dynamic Programming vs Greedy Strategy',
      question: 'Explain when you choose Dynamic Programming over a Greedy heuristic. Walk me through a problem where a Greedy choice fails to find the global optimum and DP is strictly required.',
      contextTip: 'Highlight optimal substructure, overlapping subproblems, and give a counterexample like 0/1 Knapsack or Coin Change.',
      sampleExpectedPoints: ['Optimal substructure and overlapping subproblems requirement', '0/1 Knapsack counterexample where greedy ratio choice fails', 'Memoization (top-down) vs Tabulation (bottom-up) space optimization'],
    },
    {
      id: 'inf-t3',
      topic: 'JVM Concurrency & Thread Synchronization',
      question: 'How does the Java Memory Model handle volatile variables and atomic operations? What is the architectural difference between synchronized blocks and ReentrantLock?',
      contextTip: 'Explain memory barriers, CPU cache flushes, CAS (Compare-And-Swap), and reentrancy/fairness.',
      sampleExpectedPoints: ['Volatile guarantees cross-core visibility and prevents instruction reordering', 'ReentrantLock provides tryLock, timeouts, and explicit condition variables', 'Atomic variables utilize non-blocking hardware CAS instructions'],
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
    {
      id: 'goog-t2',
      topic: 'Distributed Caching & Cache Invalidation',
      question: 'Design a multi-region distributed caching layer for high-throughput query suggestions. How do you mitigate Cache Avalanche, Cache Stampede (Thundering Herd), and Cache Penetration?',
      contextTip: 'Discuss Bloom filters, mutex locks / XFetch for stampede, and jittered TTL for avalanche.',
      sampleExpectedPoints: ['Bloom filters to quickly reject non-existent keys (Cache Penetration)', 'Probabilistic early recomputation or distributed mutex for Cache Stampede', 'Randomized/jittered TTL expiration to prevent simultaneous Cache Avalanche'],
    },
    {
      id: 'goog-t3',
      topic: 'Operating Systems & Virtual Memory',
      question: 'Explain how Linux virtual memory, multi-level Page Tables, and the MMU interact. What exact sequence of events occurs at the CPU and kernel level when a thread triggers a Page Fault?',
      contextTip: 'Mention MMU exception, CR2 register, kernel trap handler, VMA verification, frame allocation, and TLB refresh.',
      sampleExpectedPoints: ['MMU triggers hardware interrupt (Exception 14) saving faulting address', 'Kernel verifies if address belongs to valid process VMA segment', 'Allocates physical page frame from free list, fetches from swap/disk, updates Page Table and TLB'],
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
    {
      id: 'del-t2',
      topic: 'Zero-Downtime Database Migrations',
      question: 'How do you perform zero-downtime database schema migrations on a mission-critical table containing 50 million records without locking writes or causing customer downtime?',
      contextTip: 'Explain the Expand and Contract pattern, dual writing, asynchronous backfilling, and safe column deprecation.',
      sampleExpectedPoints: ['Expand and Contract pattern with dual writes', 'Asynchronous chunked batch backfill to prevent table row locking', 'Switching read traffic to new schema and safely deprecating legacy column'],
    },
    {
      id: 'del-t3',
      topic: 'Microservices Resiliency & Circuit Breakers',
      question: 'When a downstream third-party verification service experiences an 8-second latency spike, how do you prevent cascading failure across your enterprise microservices? Explain the Circuit Breaker pattern.',
      contextTip: 'Detail Closed, Open, and Half-Open states, fallback strategies, and bulkhead isolation.',
      sampleExpectedPoints: ['Circuit breaker states: Closed, Open, Half-Open based on error failure thresholds', 'Fallback default response or degraded service when circuit trips Open', 'Bulkhead thread pool isolation to prevent connection exhaustion'],
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
    {
      id: 'zep-t2',
      topic: 'Real-Time Geospatial Driver Dispatching',
      question: 'In a 10-minute delivery platform, how do you ingest and query live GPS coordinates for 5,000 delivery partners updated every 3 seconds to instantly dispatch the closest rider to a dark store?',
      contextTip: 'Discuss Redis GEO / Geohashing, in-memory spatial indexes (R-Tree/QuadTree), and persistent WebSocket/MQTT telemetry streams.',
      sampleExpectedPoints: ['Redis geospatial indexing (GEOADD, GEORADIUS) for sub-millisecond proximity lookup', 'WebSocket / MQTT persistent lightweight connections for frequent mobile telemetry', 'Spatial partitioning (QuadTree/H3 cells) to bound neighbor search'],
    },
    {
      id: 'zep-t3',
      topic: 'Event-Driven Architecture & Message Ordering',
      question: 'How do you guarantee strictly ordered event processing in an Apache Kafka order pipeline across multiple partitions, and how do you handle poisoned/malformed payloads without stalling the queue?',
      contextTip: 'Mention partition keys (Order ID), idempotent consumers, and Dead-Letter Queues (DLQ).',
      sampleExpectedPoints: ['Partitioning by Order ID guarantees per-order sequential delivery', 'Dead-Letter Queue (DLQ) isolates malformed payloads without blocking partition processing', 'Idempotent consumer logic with transactional deduplication'],
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
    {
      id: 'tcs-h2',
      theme: 'Cross-Functional Team Collaboration',
      scenario: 'Describe a project where you had to collaborate with team members who had varying technical skill levels or differing work styles. How did you ensure the project succeeded without personal friction?',
      evaluates: 'Empathy, conflict resolution, active mentorship, and shared delivery commitment.',
      idealResponseCriteria: [
        'Demonstrates patience and structured task delegation based on individual strengths',
        'Focuses on collective milestone success rather than pointing fingers',
        'Established open communication channels and frequent informal check-ins',
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
    {
      id: 'inf-h2',
      theme: 'Continuous Learning & Technical Self-Drive',
      scenario: 'The software engineering industry evolves rapidly with AI and emerging tech stacks. Can you share an example of a complex technology you taught yourself entirely outside your university syllabus, and how you built something meaningful with it?',
      evaluates: 'Self-directed curiosity, intrinsic motivation, and practical engineering execution.',
      idealResponseCriteria: [
        'Explains learning approach: documentation, small prototypes, overcoming roadblocks',
        'Highlights hands-on projects deployed or contributed to open source',
        'Demonstrates passion for keeping pace with modern industry standards',
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
    {
      id: 'goog-h2',
      theme: 'Navigating Ambiguity & Project Failure',
      scenario: 'Tell me about a time when you had to work on a project with vague or constantly shifting requirements, or where a project you invested weeks in failed. How did you adapt and what insights did you take away?',
      evaluates: 'Comfort with ambiguity, resilience, objective retrospectives, and agile pivoting.',
      idealResponseCriteria: [
        'Proactively defined measurable milestones to clarify ambiguous goals',
        'Maintained composure and conducted a blameless post-mortem analysis',
        'Pivoted swiftly to a better alternative without dwelling on sunk costs',
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
    {
      id: 'del-h2',
      theme: 'Navigating Competing Stakeholder Demands',
      scenario: 'When two key business stakeholders present conflicting priorities for a single software solution, how do you diplomatically facilitate alignment while keeping the delivery milestone on schedule?',
      evaluates: 'Stakeholder negotiation, strategic prioritization, and transparent consensus building.',
      idealResponseCriteria: [
        'Identifies shared overarching business objectives between stakeholders',
        'Presents objective trade-off matrices and impact assessments',
        'Facilitates collaborative consensus without taking partisan sides',
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
    {
      id: 'zep-h2',
      theme: 'Speed of Execution vs Perfectionism',
      scenario: 'In high-growth tech startups, speed to market is critical. Tell me about a time you had to balance engineering perfectionism with the urgency to ship an MVP to capture a business opportunity.',
      evaluates: 'Pragmatic engineering trade-offs, velocity mindset, and managing technical debt.',
      idealResponseCriteria: [
        'Recognized when 80% completeness delivers 100% of user value',
        'Delivered the working feature rapidly to unblock user feedback',
        'Created a scheduled backlog ticket to refactor and pay down technical debt post-launch',
      ],
    },
  ],
};
