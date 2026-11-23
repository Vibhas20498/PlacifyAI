/**
 * PlacifyAI - 1-Page Budget & Length Estimator
 * Evaluates whether a candidate's resume fits comfortably on a single page,
 * warns about accidental page 2 overflows (the #1 rejection cause for fresher drives),
 * and detects typographical orphan/widow lines with actionable trimming suggestions.
 */

export interface PageBudgetMetric {
  pageEstimate: number; // e.g. 1.0, 1.2, 0.7
  pagePercentage: number; // e.g. 100%, 120%, 70%
  status: 'safe' | 'warning-overflow' | 'heavy-overflow' | 'underfilled';
  statusLabel: string;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'blue';
  wordCount: number;
  estimatedVisualLines: number;
  maxBudgetLines: number;
  spilloverLines: number;
  summaryMessage: string;
  sectionLineBreakdown: {
    section: string;
    lines: number;
  }[];
  trimmingOpportunities: TrimmingOpportunity[];
}

export interface TrimmingOpportunity {
  id: string;
  originalText: string;
  wordCount: number;
  estimatedLines: number;
  overflowRisk: 'high' | 'medium';
  savingsTip: string;
  suggestedCondensation: string;
}

const BUDGET_MAX_LINES = 50; // standard 1-page A4/Letter with 0.6in margins & 10.5pt font
const WORDS_PER_PAGE_BENCHMARK = 520;

/**
 * Calculates page budget, line density, and detects widow/overflow lines.
 */
export function calculatePageBudget(text: string): PageBudgetMetric {
  if (!text || text.trim().length === 0) {
    return {
      pageEstimate: 0,
      pagePercentage: 0,
      status: 'underfilled',
      statusLabel: 'Empty Document',
      badgeColor: 'blue',
      wordCount: 0,
      estimatedVisualLines: 0,
      maxBudgetLines: BUDGET_MAX_LINES,
      spilloverLines: 0,
      summaryMessage: 'Paste or upload your resume to calculate your 1-page budget.',
      sectionLineBreakdown: [],
      trimmingOpportunities: [],
    };
  }

  const rawLines = text.split('\n');
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let visualLines = 0;
  const sections: { [key: string]: number } = {
    'Contact & Header': 0,
    'Education': 0,
    'Skills': 0,
    'Projects & Experience': 0,
    'Other / Spacing': 0,
  };

  let currentSection = 'Contact & Header';

  const longBulletsCandidates: { text: string; words: number; lines: number }[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (line.length === 0) {
      visualLines += 0.6; // paragraph spacing
      sections['Other / Spacing'] = (sections['Other / Spacing'] || 0) + 0.6;
      continue;
    }

    const lower = line.toLowerCase();
    if (/^(education|academic background|academics)\b/i.test(lower)) {
      currentSection = 'Education';
      visualLines += 1.5;
      sections['Education'] = (sections['Education'] || 0) + 1.5;
      continue;
    } else if (/^(technical skills|skills|technologies|proficiencies|core competencies)\b/i.test(lower)) {
      currentSection = 'Skills';
      visualLines += 1.5;
      sections['Skills'] = (sections['Skills'] || 0) + 1.5;
      continue;
    } else if (/^(projects|technical projects|experience|work experience|internships|employment)\b/i.test(lower)) {
      currentSection = 'Projects & Experience';
      visualLines += 1.5;
      sections['Projects & Experience'] = (sections['Projects & Experience'] || 0) + 1.5;
      continue;
    }

    // Wrap-around calculation (approx 80 chars per line in standard 10pt 2-column or 88 in 1-column)
    const lineVisualCount = Math.max(1, Math.ceil(line.length / 82));
    visualLines += lineVisualCount;
    sections[currentSection] = (sections[currentSection] || 0) + lineVisualCount;

    // Detect candidate bullet points that span multiple lines or have high word counts
    const lineWords = line.split(/\s+/).filter(Boolean).length;
    const isBullet = /^[-*•·]/.test(line) || (lineWords >= 8 && line.length >= 60);

    if (isBullet && (lineWords >= 22 || lineVisualCount >= 2)) {
      longBulletsCandidates.push({
        text: line.replace(/^[-*•·]\s*/, ''),
        words: lineWords,
        lines: lineVisualCount,
      });
    }
  }

  const roundedVisualLines = Math.round(visualLines);
  const lineRatio = roundedVisualLines / BUDGET_MAX_LINES;
  const wordRatio = wordCount / WORDS_PER_PAGE_BENCHMARK;

  // Blended estimate weighted towards visual line geometry
  const rawPageEstimate = Math.max(0.2, (lineRatio * 0.65) + (wordRatio * 0.35));
  const pageEstimate = Number(rawPageEstimate.toFixed(1));
  const pagePercentage = Math.round(rawPageEstimate * 100);

  let status: PageBudgetMetric['status'] = 'safe';
  let statusLabel = 'Optimal 1-Page';
  let badgeColor: PageBudgetMetric['badgeColor'] = 'emerald';
  let summaryMessage = '';
  let spilloverLines = 0;

  if (pageEstimate < 0.8) {
    status = 'underfilled';
    statusLabel = 'Under-Budget (Sparse)';
    badgeColor = 'amber';
    summaryMessage = `Your resume uses approx ${pagePercentage}% of a standard page. Add 1-2 project impact bullets or technical coursework so it looks full and accomplished.`;
  } else if (pageEstimate >= 0.8 && pageEstimate <= 1.0) {
    status = 'safe';
    statusLabel = 'Safe 1-Page Budget';
    badgeColor = 'emerald';
    summaryMessage = `Great job! Your resume comfortably fills ${pagePercentage}% of 1 standard page. It will print cleanly without accidental page spillovers.`;
  } else if (pageEstimate > 1.0 && pageEstimate <= 1.2) {
    status = 'warning-overflow';
    statusLabel = 'High Spillover Risk';
    badgeColor = 'amber';
    spilloverLines = Math.max(1, roundedVisualLines - BUDGET_MAX_LINES);
    summaryMessage = `Danger: Your content spills ~${spilloverLines} lines onto Page 2! Campus recruiters and ATS scanners at TCS, Infosys, and Google often penalize 2-page fresher resumes. Trim ~${spilloverLines} lines to guarantee a clean 1-page fit.`;
  } else {
    status = 'heavy-overflow';
    statusLabel = 'Multi-Page Spillover';
    badgeColor = 'rose';
    spilloverLines = Math.max(1, roundedVisualLines - BUDGET_MAX_LINES);
    summaryMessage = `Exceeds single-page standard (${pageEstimate} pages / ~${spilloverLines} lines over budget). Highly recommended to condense to 1 page for undergraduate and early-career placement drives.`;
  }

  // Format section breakdown
  const sectionLineBreakdown = Object.entries(sections)
    .filter(([_, count]) => count > 0)
    .map(([section, count]) => ({
      section,
      lines: Math.round(count),
    }));

  // Identify top 3 trimming opportunities (orphan lines and bloated statements)
  const trimmingOpportunities: TrimmingOpportunity[] = longBulletsCandidates
    .sort((a, b) => b.words - a.words)
    .slice(0, 3)
    .map((item, idx) => {
      // Suggest trimmed condensation
      const wordsArr = item.text.split(/\s+/);
      let condensed = item.text;
      if (wordsArr.length > 18) {
        // Trim filler prepositions and adjectives
        condensed = item.text
          .replace(/\b(?:successfully|in order to|responsible for|helped to|worked on|assisted in)\b/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      }

      const wordsSaved = Math.max(4, Math.round(item.words * 0.25));

      return {
        id: `trim-${idx + 1}`,
        originalText: item.text,
        wordCount: item.words,
        estimatedLines: item.lines,
        overflowRisk: item.lines >= 3 ? 'high' : 'medium',
        savingsTip: `Spans ${item.lines} lines (${item.words} words). Condensing by ~${wordsSaved} words eliminates an entire line of vertical space.`,
        suggestedCondensation: condensed !== item.text ? condensed : `${wordsArr.slice(0, Math.max(12, wordsArr.length - 6)).join(' ')}...`,
      };
    });

  return {
    pageEstimate,
    pagePercentage,
    status,
    statusLabel,
    badgeColor,
    wordCount,
    estimatedVisualLines: roundedVisualLines,
    maxBudgetLines: BUDGET_MAX_LINES,
    spilloverLines,
    summaryMessage,
    sectionLineBreakdown,
    trimmingOpportunities,
  };
}
