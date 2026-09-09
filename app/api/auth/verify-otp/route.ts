import { NextResponse } from 'next/server';
import { verifyStoredOtp } from '@/lib/email/otp-service';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp, name = 'Candidate', targetRole = 'Fullstack Software Engineer' } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.trim();

    // 1. Verify OTP
    const verification = await verifyStoredOtp(cleanEmail, cleanOtp);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.message || 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    const userName = name || verification.metadata?.name || 'Candidate';
    const userRole = targetRole || verification.metadata?.targetRole || 'Fullstack Software Engineer';

    // 2. Provision or update profile in Supabase Database
    let profileData: any = {
      email: cleanEmail,
      name: userName,
      targetRole: userRole,
    };

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createAdminClient();
        
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .single();

        if (existingProfile) {
          profileData = existingProfile;
        } else {
          // Upsert new profile record
          const { data: newProfile, error: profileErr } = await supabase
            .from('profiles')
            .upsert({
              email: cleanEmail,
              name: userName,
              target_role: userRole,
              cgpa: 8.4,
              university: 'Engineering Institution',
              tier: 1,
              graduation_year: 2026,
              verified_skills: ['Python', 'SQL', 'TypeScript', 'React', 'FastAPI'],
              pending_skills: ['Docker', 'Redis', 'System Design'],
              projects_count: 3,
              has_production_deployment: true,
              code_signal_score: 700,
              resume_ats_score: 75,
              placement_probability: 78,
              career_readiness_score: 82,
            })
            .select()
            .single();

          if (newProfile) {
            profileData = newProfile;
          }
        }
      } catch (dbErr) {
        console.warn('[Supabase Profile Provisioning Warning]:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email successfully verified. Welcome to PlacifyAI!',
      user: {
        email: cleanEmail,
        name: userName,
        targetRole: userRole,
      },
      profile: profileData,
    });
  } catch (error: any) {
    console.error('[Verify OTP Error]:', error);
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
