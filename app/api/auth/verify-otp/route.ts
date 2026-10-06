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

        let isOnboarded = false;

        if (existingProfile) {
          profileData = existingProfile;
          isOnboarded = existingProfile.is_onboarded ?? (Boolean(existingProfile.university) && existingProfile.cgpa > 0);
        } else {
          // Upsert new profile record for newly registered candidate
          const { data: newProfile, error: profileErr } = await supabase
            .from('profiles')
            .upsert({
              email: cleanEmail,
              name: userName,
              target_role: userRole,
              cgpa: 0, // Unconfigured
              university: '',
              tier: 2,
              graduation_year: 2026,
              verified_skills: [],
              pending_skills: [],
              projects_count: 0,
              has_production_deployment: false,
              code_signal_score: 500,
              resume_ats_score: 50,
              placement_probability: 50,
              career_readiness_score: 50,
            })
            .select()
            .single();

          if (newProfile) {
            profileData = newProfile;
          }
          isOnboarded = false;
        }

        profileData.isOnboarded = isOnboarded;
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
      isOnboarded: Boolean(profileData?.isOnboarded),
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
