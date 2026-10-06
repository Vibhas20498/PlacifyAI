import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET: Fetch user profile by email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase is not configured yet in .env.local' }, { status: 503 });
    }

    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[Supabase GET Profile Error]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error: any) {
    console.error('[GET Profile API Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST/PUT: Upsert / update user profile in Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile } = body;

    if (!profile || !profile.email) {
      return NextResponse.json({ error: 'Valid profile data with email is required.' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        warning: 'Supabase credentials missing in .env.local. Profile saved locally.',
        profile,
      });
    }

    const cleanEmail = profile.email.toLowerCase().trim();
    const supabase = createAdminClient();

    const dbPayload = {
      email: cleanEmail,
      name: profile.name || 'Candidate',
      target_role: profile.targetRole || 'Fullstack Software Engineer',
      cgpa: Number(profile.cgpa) || 8.0,
      university: profile.university || 'Engineering Institution',
      tier: Number(profile.tier) || 2,
      graduation_year: Number(profile.graduationYear) || 2026,
      experience_months: Number(profile.experienceMonths) || 0,
      github_url: profile.githubUrl || '',
      linkedin_url: profile.linkedinUrl || '',
      verified_skills: profile.verifiedSkills || [],
      pending_skills: profile.pendingSkills || [],
      projects_count: Number(profile.projectsCount) || 2,
      has_production_deployment: Boolean(profile.hasProductionDeployment),
      code_signal_score: Number(profile.codeSignalScore) || 600,
      resume_ats_score: Number(profile.resumeAtsScore) || 65,
      placement_probability: Number(profile.placementProbability) || 70,
      career_readiness_score: Number(profile.careerReadinessScore) || 68,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .upsert(dbPayload, { onConflict: 'email' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase Upsert Profile Error]:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated in Supabase successfully.',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('[POST Profile API Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
