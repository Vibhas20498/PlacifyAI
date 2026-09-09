-- ==============================================================================
-- PlacifyAI — Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Candidate',
  target_role TEXT NOT NULL DEFAULT 'Fullstack Software Engineer',
  cgpa NUMERIC(3,1) NOT NULL DEFAULT 8.0,
  university TEXT NOT NULL DEFAULT 'Engineering Institution',
  tier INT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3)),
  graduation_year INT NOT NULL DEFAULT 2026,
  experience_months INT NOT NULL DEFAULT 0,
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  verified_skills TEXT[] NOT NULL DEFAULT ARRAY['Python', 'SQL', 'TypeScript', 'React'],
  pending_skills TEXT[] NOT NULL DEFAULT ARRAY['Docker', 'Redis', 'System Design'],
  projects_count INT NOT NULL DEFAULT 2,
  has_production_deployment BOOLEAN NOT NULL DEFAULT false,
  code_signal_score INT NOT NULL DEFAULT 600,
  resume_ats_score INT NOT NULL DEFAULT 65,
  placement_probability INT NOT NULL DEFAULT 70,
  career_readiness_score INT NOT NULL DEFAULT 68,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Fallback / Custom OTP Store (for high-capacity free SMTP delivery)
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  hashed_otp TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'registration',
  metadata JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_email ON public.otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_expires ON public.otps(expires_at);

-- 4. Automatic Profile Trigger on Auth User Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    name,
    target_role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Candidate'),
    COALESCE(NEW.raw_user_meta_data->>'target_role', 'Fullstack Software Engineer')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Service role full access
CREATE POLICY "Service role full access on profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role full access on otps"
  ON public.otps FOR ALL
  TO service_role
  USING (true);
