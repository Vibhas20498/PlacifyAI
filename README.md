# PlacifyAI — Career Intelligence & Placement Analytics Platform

> **AI-Powered · Explainable · Never a Black Box**  
> Precision placement probability estimation, grounded RAG career coaching, and explainable skill gap roadmaps in a Swiss Editorial Monochrome design system.

---

## 🌟 Key Features

- **XGBoost ML Placement Probability Engine:** Deterministic calculation calibrated on academic CGPA, Code Signal scores, project depth, and production deployment with SHAP factor explainability.
- **RAG (Retrieval-Augmented Generation) Architecture:**
  - **AI Career Coach (`/ai-coach`):** Multi-turn conversational terminal referencing verified FAANG/Tier-1 hiring rubrics, system design standards, and market syllabi with grounded citations.
  - **Resume ATS Analyzer (`/resume`):** 5-factor ATS scoring and Google XYZ / STAR method bullet point rewriter.
  - **Mock Interview Simulator (`/mock-interview`):** Interactive AI interviewer with rubric-grounded evaluations and voice dictation.
- **Signature 7-Stage Career Node-Path:** Visual milestone tracking across the landing hero, dashboard overview, and learning roadmap.
- **What-If Sensitivity Simulator (`/what-if`):** Live interactive sliders to test hypothetical improvements and project probability gains.
- **Minimalist Black & White Swiss UI:** Clean typographic hierarchy (`Fraunces` serif + `Inter Tight` sans + `JetBrains Mono`), 1px hairline borders, and zero color noise.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone repository
git clone https://github.com/Vibhas20498/PlacifyAI.git
cd PlacifyAI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```
PlacifyAI/
├── PLACIFYAI_PROJECT_SPECIFICATION.md  # Detailed technical architectural dossier
├── app/
│   ├── page.tsx                        # Public landing page with Node-Path Hero
│   ├── dashboard/page.tsx              # Placement Readiness Command Center
│   ├── profile/page.tsx                # Career profile & verified skills
│   ├── resume/page.tsx                 # ATS Analyzer & STAR rewriter
│   ├── job-analyzer/page.tsx           # Semantic job match matrix
│   ├── jobs/page.tsx                   # Job recommendations directory
│   ├── skill-gap/page.tsx              # Market deficit & priority matrix
│   ├── placement-prediction/page.tsx   # ML Probability & SHAP waterfall
│   ├── what-if/page.tsx                # Interactive sensitivity simulator
│   ├── learning-roadmap/page.tsx       # Sequenced milestone curriculum
│   ├── ai-coach/page.tsx               # Grounded RAG conversational terminal
│   └── mock-interview/page.tsx         # Live AI interview simulator
├── components/
│   ├── layout/                         # AppShell, Sidebar, Topbar
│   ├── motif/                          # SVG Node-Path journey graphics
│   └── ui/                             # StatCard, RadarChart, SkillBarChart
└── lib/
    ├── ml-engine/                      # XGBoost & SHAP mathematical calculations
    ├── rag-engine/                     # Vector store, hybrid search, knowledge corpus
    └── store/                          # React context for dynamic user profile
```

---

## 📄 Documentation
See [`PLACIFYAI_PROJECT_SPECIFICATION.md`](./PLACIFYAI_PROJECT_SPECIFICATION.md) for full architectural diagrams, mathematical formulations, and database schemas.
