import { NextResponse } from 'next/server';
import { generateFinalInterviewReport, generateWeaknessSpecificRoadmap } from '@/lib/interview/engine';
import { InterviewSession } from '@/lib/interview/types';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session: InterviewSession = body.session;

    if (!session || !Array.isArray(session.questions)) {
      return NextResponse.json({ error: 'Valid session payload is required.' }, { status: 400 });
    }

    // 1. Generate final comprehensive report
    const report = generateFinalInterviewReport(session);

    // 2. Generate personalized weakness-specific practice roadmap
    const roadmap = generateWeaknessSpecificRoadmap(session);

    const completedSession: InterviewSession = {
      ...session,
      status: 'completed',
      completedAt: new Date().toISOString(),
      report,
      roadmap,
    };

    // 3. Persist completed session to Supabase database if reachable
    try {
      const supabase = createAdminClient();
      const email = session.userEmail || 'candidate@placify.ai';

      await supabase.from('interview_sessions').upsert({
        user_email: email,
        target_role: session.config.targetRole,
        target_company: session.config.targetCompany,
        interview_type: session.config.interviewType,
        difficulty: session.config.difficulty,
        duration_minutes: session.config.durationMinutes,
        question_count: session.config.questionCount,
        status: 'completed',
        overall_score: report.overallScore,
        questions_answered: report.questionsAnswered,
        config: session.config as any,
        qa_history: session.qaHistory as any,
        report: report as any,
        roadmap: roadmap as any,
        completed_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('[Supabase Finish Save Notice]:', dbErr);
    }

    return NextResponse.json({
      success: true,
      session: completedSession,
      report,
      roadmap,
    });
  } catch (error: any) {
    console.error('[Interview Finish Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to finalize interview session.' },
      { status: 500 }
    );
  }
}
