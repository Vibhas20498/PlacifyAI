import { NextResponse } from 'next/server';
import { evaluateAnswerWithAI } from '@/lib/interview/engine';
import { InterviewQuestion } from '@/lib/interview/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question: InterviewQuestion = body.question;
    const answer: string = String(body.answer || '').trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const config = body.config;

    if (!question || !question.question) {
      return NextResponse.json({ error: 'Valid question object is required.' }, { status: 400 });
    }

    if (!answer) {
      return NextResponse.json({ error: 'Answer content cannot be empty.' }, { status: 400 });
    }

    // Evaluate answer with AI / domain engine
    const evaluation = await evaluateAnswerWithAI(question, answer, history, config);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('[Interview Answer Evaluation Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to evaluate interview answer.' },
      { status: 500 }
    );
  }
}
