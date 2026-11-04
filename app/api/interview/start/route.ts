import { NextResponse } from 'next/server';
import { generateInterviewQuestions } from '@/lib/interview/engine';
import { InterviewConfig, InterviewSession } from '@/lib/interview/types';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config: InterviewConfig = {
      targetRole: body.targetRole || 'Fullstack Software Engineer',
      targetCompany: body.targetCompany || 'General Placement',
      interviewType: body.interviewType || 'technical',
      difficulty: body.difficulty || 'intermediate',
      questionCount: Number(body.questionCount) || 5,
      durationMinutes: Number(body.durationMinutes) || 15,
      useAnalyzedResume: Boolean(body.useAnalyzedResume !== false),
      resumeText: body.resumeText || '',
      focusSkills: Array.isArray(body.focusSkills) ? body.focusSkills : [],
      focusProjects: Boolean(body.focusProjects),
      practiceWeakAreas: Boolean(body.practiceWeakAreas),
      includeCoding: Boolean(body.includeCoding),
      feedbackTiming: body.feedbackTiming === 'practice' ? 'practice' : 'realistic',
      mode: body.mode === 'voice' ? 'voice' : 'text',
    };

    const userProfile = body.profile;
    const resumeText = body.resumeText || '';

    // Generate grounded questions using AI or domain engine
    const questions = await generateInterviewQuestions(config, resumeText, userProfile);

    const sessionId = `session-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const session: InterviewSession = {
      id: sessionId,
      userId: body.userId || userProfile?.id,
      userEmail: body.userEmail || userProfile?.email || 'candidate@placify.ai',
      config,
      status: 'active',
      currentQuestionIndex: 0,
      questions,
      qaHistory: [],
      startedAt: new Date().toISOString(),
      timeRemainingSeconds: config.durationMinutes * 60,
    };

    // Attempt saving initial session to Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from('interview_sessions').insert({
        id: session.id.startsWith('session-') ? undefined : session.id,
        user_email: session.userEmail,
        target_role: config.targetRole,
        target_company: config.targetCompany,
        interview_type: config.interviewType,
        difficulty: config.difficulty,
        duration_minutes: config.durationMinutes,
        question_count: config.questionCount,
        status: 'active',
        config: config as any,
        qa_history: [] as any,
      });
    } catch (dbErr) {
      // Non-blocking fallback: Session continues in local/memory state
      console.warn('[Supabase Session Start Notice]:', dbErr);
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error: any) {
    console.error('[Interview Start Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize interview session.' },
      { status: 500 }
    );
  }
}
