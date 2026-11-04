import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { PastInterviewSummary } from '@/lib/interview/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: true, history: [] });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.warn('[Supabase Interview History Notice]:', error.message);
      return NextResponse.json({ success: true, history: [] });
    }

    const history: PastInterviewSummary[] = (data || []).map((row: any) => ({
      id: row.id,
      targetRole: row.target_role || 'Software Engineer',
      targetCompany: row.target_company || 'General Placement',
      interviewType: row.interview_type || 'technical',
      difficulty: row.difficulty || 'intermediate',
      overallScore: Number(row.overall_score) || 0,
      questionsAnswered: Number(row.questions_answered) || 0,
      totalQuestions: Number(row.question_count) || 5,
      completedAt: row.completed_at || row.created_at,
      status: row.status || 'completed',
      strongestCategory: row.report?.strongestAreas?.[0],
      weakestCategory: row.report?.weakestAreas?.[0],
    }));

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error: any) {
    console.error('[Interview History API Error]:', error);
    return NextResponse.json({ success: true, history: [] });
  }
}
