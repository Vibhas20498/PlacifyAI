import { NextResponse } from 'next/server';
import { rewriteBulletWithAI, batchRewriteBulletsWithAI, getActiveAIKey } from '@/lib/ai/bullet-rewriter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetRole = body.targetRole || 'Software Engineer';
    const apiKey = body.apiKey;

    // Single bullet rewrite
    if (body.bullet && typeof body.bullet === 'string') {
      const result = await rewriteBulletWithAI(body.bullet, {
        targetRole,
        apiKey,
      });

      return NextResponse.json({
        success: true,
        result,
      });
    }

    // Batch bullets rewrite
    if (Array.isArray(body.bullets)) {
      const results = await batchRewriteBulletsWithAI(body.bullets, {
        targetRole,
        apiKey,
      });

      return NextResponse.json({
        success: true,
        results,
      });
    }

    return NextResponse.json(
      { error: 'Provide either "bullet" string or "bullets" array.' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[AI Bullet Rewrite API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to rewrite bullet point with AI.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const activeKeyInfo = getActiveAIKey();
  return NextResponse.json({
    configured: Boolean(activeKeyInfo.key),
    provider: activeKeyInfo.provider,
  });
}
