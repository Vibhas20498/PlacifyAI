-- ==============================================================================
-- PlacifyAI — Supabase Database Clean & Reset Script
-- Run this in your Supabase SQL Editor to wipe all existing data and reset tables
-- ==============================================================================

-- 1. Truncate existing application tables
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.otps CASCADE;

-- 2. Optional: Clean auth users if you want to reset all registered auth accounts
-- (Uncomment the line below if you want to wipe all registered users in auth.users)
-- DELETE FROM auth.users;

-- 3. Confirm clean state
SELECT 'profiles count' AS table_name, count(*) FROM public.profiles
UNION ALL
SELECT 'otps count' AS table_name, count(*) FROM public.otps;
