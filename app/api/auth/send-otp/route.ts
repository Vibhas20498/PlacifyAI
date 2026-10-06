import { NextResponse } from 'next/server';
import { generateOtpCode, sendOtpEmail } from '@/lib/email/otp-service';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name = 'Candidate', targetRole = 'Fullstack Software Engineer', purpose = 'registration' } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if account already exists in Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createAdminClient();
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, email, name, university, cgpa')
          .eq('email', cleanEmail)
          .single();

        if (purpose === 'registration') {
          // If already registered and configured
          if (existingProfile && existingProfile.university && existingProfile.university !== 'Engineering Institution' && Number(existingProfile.cgpa) > 0) {
            return NextResponse.json(
              { error: 'An account with this email address already exists. Please log in instead.' },
              { status: 409 }
            );
          }
        } else if (purpose === 'login') {
          if (!existingProfile) {
            return NextResponse.json(
              { error: 'No account found with this email address. Please create an account first.' },
              { status: 404 }
            );
          }
        }
      } catch (dbCheckErr) {
        console.warn('[Supabase Account Check Warning]:', dbCheckErr);
      }
    }

    const otp = generateOtpCode();

    // 1. Send OTP via our high-reliability email dispatcher (Nodemailer / Free SMTP)
    const result = await sendOtpEmail(cleanEmail, otp, name);

    // 2. Also register/notify Supabase if connected
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createAdminClient();
        // Record metadata in Supabase otps table
        await supabase.from('otps').insert({
          email: cleanEmail,
          hashed_otp: otp,
          purpose: purpose,
          metadata: { name, targetRole },
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        });
      } catch (sbErr) {
        // Non-blocking if table not migrated yet
      }
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`,
      devMode: result.devMode,
      previewCode: result.previewCode, // Provided only when SMTP is unconfigured for instant local test
    });
  } catch (error: any) {
    console.error('[Send OTP Error]:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch verification code. Please try again.' },
      { status: 500 }
    );
  }
}
