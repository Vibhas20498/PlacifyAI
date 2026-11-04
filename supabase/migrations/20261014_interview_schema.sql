-- ==============================================================================
-- PlacifyAI — Supabase Migration: Mock Interview Sessions & Reports
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  target_role TEXT NOT NULL DEFAULT 'Fullstack Software Engineer',
  target_company TEXT NOT NULL DEFAULT 'General Placement',
  interview_type TEXT NOT NULL DEFAULT 'technical',
  difficulty TEXT NOT NULL DEFAULT 'intermediate',
  duration_minutes INT NOT NULL DEFAULT 20,
  question_count INT NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('setup', 'active', 'evaluating', 'completed', 'abandoned')),
  overall_score INT NOT NULL DEFAULT 0,
  questions_answered INT NOT NULL DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  qa_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  report JSONB,
  roadmap JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups by student
CREATE INDEX IF NOT EXISTS idx_interview_sessions_email ON public.interview_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON public.interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created ON public.interview_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own sessions
DROP POLICY IF EXISTS "Users can view own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can view own interview sessions"
  ON public.interview_sessions FOR SELECT
  USING (auth.uid() = user_id OR user_email = (auth.jwt() ->> 'email'));

-- Allow users to insert/update their own sessions
DROP POLICY IF EXISTS "Users can manage own interview sessions" ON public.interview_sessions;
CREATE POLICY "Users can manage own interview sessions"
  ON public.interview_sessions FOR ALL
  USING (auth.uid() = user_id OR user_email = (auth.jwt() ->> 'email'));

-- Service role full access for backend API routes
DROP POLICY IF EXISTS "Service role full access on interview sessions" ON public.interview_sessions;
CREATE POLICY "Service role full access on interview sessions"
  ON public.interview_sessions FOR ALL
  TO service_role
  USING (true);
