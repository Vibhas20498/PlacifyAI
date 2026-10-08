import { RAGKnowledgeChunk } from '../types';

export const ROLE_KNOWLEDGE_CHUNKS: RAGKnowledgeChunk[] = [
  // 1. SOFTWARE ENGINEER
  {
    id: 'role-swe-guidelines',
    category: 'Role Guideline',
    roleTarget: 'Software Engineer',
    title: 'Software Engineer (Fullstack / Backend / Frontend) Evaluation Rubric',
    topic: 'Core Technical Competencies',
    content: `Tier-1 Software Engineering screeners look for evidence of fullstack or backend architecture depth:
- Core Tech Stack: React, TypeScript, Next.js, Node.js, Python, Java, Go, PostgreSQL, Redis, Docker, Git, CI/CD.
- Expected Evidence: Demonstrating idempotent REST/gRPC API architecture, database indexing, caching strategies, state management, containerized deployment, and unit/integration testing.
- Common Resume Mistakes: Simple CRUD tutorial apps (To-Do list, basic clone) without authentication, pagination, caching, performance benchmarks, or deployment links.
- Key Action Verbs: Architected, Engineered, Optimized, Automated, Deployed, Refactored, Containerized.`,
    keyActionVerbs: ['Architected', 'Engineered', 'Optimized', 'Automated', 'Deployed', 'Refactored'],
    sampleWeakBullet: 'Worked on a fullstack social media clone app with React and Node.',
    sampleStrongBullet: 'Architected a fullstack web platform using Next.js, Node.js, and PostgreSQL, implementing JWT auth, Redis session caching, and Dockerized deployment on AWS ECS.',
    quantificationAdvice: 'Highlight API response times (ms), concurrent users handled, database query performance, or test coverage %.',
    tags: ['software-engineer', 'fullstack', 'backend', 'frontend', 'react', 'node', 'typescript', 'docker', 'postgresql'],
  },

  // 2. DATA ANALYST
  {
    id: 'role-data-analyst-guidelines',
    category: 'Role Guideline',
    roleTarget: 'Data Analyst',
    title: 'Data Analyst Evaluation Rubric & Project Standards',
    topic: 'Analytical Storytelling & BI Standards',
    content: `Data Analyst recruiters evaluate candidates on data transformation, business KPI storytelling, and SQL proficiency:
- Core Tech Stack: SQL (Window functions, CTEs, self-joins, query optimization), Python (Pandas, NumPy), Excel (VLOOKUP, Pivot Tables, Power Query), Power BI, Tableau, A/B Testing.
- Expected Evidence: Solving actual business problems (churn analysis, sales funnel optimization, customer segmentation), building automated KPI dashboards, and translating raw query output into actionable stakeholder recommendations.
- Common Resume Mistakes: Listing 'Python and SQL' without stating dataset volume, specific business KPIs measured, or automated reporting cadences.
- Key Action Verbs: Formulated, Analyzed, Visualized, Streamlined, Modeled, Uncovered, Automated.`,
    keyActionVerbs: ['Analyzed', 'Visualized', 'Formulated', 'Streamlined', 'Synthesized', 'Engineered'],
    sampleWeakBullet: 'Made Power BI dashboards and wrote SQL queries for sales data.',
    sampleStrongBullet: 'Formulated automated Power BI dashboards connecting to PostgreSQL via complex SQL CTEs, tracking 14 executive KPIs and reducing weekly reporting turnaround from 10 hours to real-time.',
    quantificationAdvice: 'Quantify records analyzed (e.g., 250,000+ transaction rows), time saved (hours/week), KPI improvements, or dashboard user adoption count.',
    tags: ['data-analyst', 'sql', 'power-bi', 'tableau', 'excel', 'pandas', 'analytics', 'kpis', 'dashboard'],
  },

  // 3. DATA SCIENTIST
  {
    id: 'role-data-scientist-guidelines',
    category: 'Role Guideline',
    roleTarget: 'Data Scientist',
    title: 'Data Scientist Evaluation Rubric & Statistical Modeling Standards',
    topic: 'Machine Learning & Statistical Rigor',
    content: `Data Scientist evaluations focus on end-to-end mathematical modeling, feature engineering, and statistical experimentation:
- Core Tech Stack: Python (Scikit-Learn, Pandas, NumPy, SciPy), SQL, PyTorch/TensorFlow, XGBoost, A/B Testing, Feature Engineering, EDA, Statistical Hypothesis Testing.
- Expected Evidence: Rigorous baseline benchmarking, cross-validation, feature importance analysis, handling class imbalance (SMOTE, precision-recall optimization), and statistical significance ($p$-values, confidence intervals).
- Common Resume Mistakes: Stating 'built a model' without naming the baseline comparator, dataset dimensions, loss function, or evaluation metrics (R², F1-Score, ROC-AUC).
- Key Action Verbs: Formulated, Developed, Modeled, Evaluated, Engineered, Predicted, Fine-Tuned.`,
    keyActionVerbs: ['Modeled', 'Formulated', 'Engineered', 'Evaluated', 'Optimized', 'Trained'],
    sampleWeakBullet: 'Built machine learning model for predicting customer churn.',
    sampleStrongBullet: 'Developed an XGBoost classification pipeline on 120,000+ records, implementing SMOTE resampling and hyperparameter grid search to achieve an 88.7% F1-score (+14% over baseline).',
    quantificationAdvice: 'State dataset sample size, precision/recall/F1/R² metrics, baseline comparison gain, and feature importance highlights.',
    tags: ['data-scientist', 'machine-learning', 'python', 'scikit-learn', 'xgboost', 'statistics', 'eda', 'f1-score'],
  },

  // 4. AI / ML ENGINEER
  {
    id: 'role-ai-ml-guidelines',
    category: 'Role Guideline',
    roleTarget: 'AI/ML Engineer',
    title: 'AI / Machine Learning Engineer Evaluation Rubric',
    topic: 'Deep Learning & ML Systems Engineering',
    content: `AI/ML Engineering recruiters look for production ML systems engineering, deep learning architectures, and inference optimization:
- Core Tech Stack: PyTorch, TensorFlow, HuggingFace, FastAPI, Docker, CUDA, LangChain/LlamaIndex, Vector Databases (Chroma, Pinecone, FAISS), Triton/ONNX, MLflow.
- Expected Evidence: Training deep neural networks, fine-tuning foundation LLMs/transformers, implementing Retrieval-Augmented Generation (RAG) with semantic vector indexing, model quantization (8-bit/4-bit), and low-latency API serving.
- Common Resume Mistakes: Superficial wrapper apps calling external OpenAI APIs without local evaluation benchmarks, custom embeddings, chunking strategies, or latency metrics.
- Key Action Verbs: Architected, Trained, Quantized, Fine-Tuned, Deployed, Optimized, Formulated.`,
    keyActionVerbs: ['Architected', 'Trained', 'Fine-Tuned', 'Quantized', 'Deployed', 'Accelerated'],
    sampleWeakBullet: 'Created an AI chatbot using LangChain and Python.',
    sampleStrongBullet: 'Architected an end-to-end RAG question-answering pipeline using PyTorch, HuggingFace, and ChromaDB, achieving sub-180ms retrieval latency across 50,000+ indexed documentation pages.',
    quantificationAdvice: 'State inference latency (ms), model parameter scale (7B/13B), embedding dimensions, retrieval precision, or throughput (tokens/sec).',
    tags: ['ai-ml-engineer', 'pytorch', 'deep-learning', 'rag', 'llm', 'huggingface', 'vector-search', 'fastapi', 'docker'],
  },

  // 5. POWER BI / DATA VISUALIZATION SPECIALIST
  {
    id: 'role-power-bi-guidelines',
    category: 'Role Guideline',
    roleTarget: 'Power BI Specialist',
    title: 'Power BI & Data Visualization Specialist Evaluation Rubric',
    topic: 'Data Modeling, DAX & Executive Dashboards',
    content: `Power BI recruiters look for advanced DAX calculation logic, Star Schema data modeling, and automated ETL workflows:
- Core Tech Stack: Power BI Desktop & Service, DAX (CALCULATE, FILTER, Time Intelligence, Iterators), Power Query (M Language), Star Schema dimensional modeling, SQL, Excel.
- Expected Evidence: Advanced DAX measures for year-over-year (YoY) variances, row-level security (RLS) implementation, data gateway configuration, scheduled refresh optimization, and user-centric UI design.
- Common Resume Mistakes: Describing simple drag-and-drop bar charts without mentioning DAX measures, data modeling architecture, or row-level security.
- Key Action Verbs: Architected, Visualized, Modeled, Streamlined, Programmed, Automated.`,
    keyActionVerbs: ['Architected', 'Visualized', 'Engineered', 'Modeled', 'Automated', 'Streamlined'],
    sampleWeakBullet: 'Created Power BI reports for business metrics.',
    sampleStrongBullet: 'Architected a Star Schema dimensional model and 25+ custom DAX measures in Power BI, implementing Row-Level Security (RLS) for 80+ regional sales stakeholders.',
    quantificationAdvice: 'Mention number of DAX measures authored, data models structured, rows processed, stakeholders served, or refresh time reductions.',
    tags: ['power-bi', 'dax', 'power-query', 'star-schema', 'data-visualization', 'tableau', 'sql', 'dashboards', 'rls'],
  }
];
