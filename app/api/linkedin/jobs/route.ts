import { NextResponse } from 'next/server';
import { generateLinkedInJobsForRole, buildLinkedInJobSearchUrl } from '@/lib/linkedin/job-radar';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'Fullstack Software Engineer';
    const skillsParam = searchParams.get('skills');
    const atsScoreParam = searchParams.get('atsScore');

    const verifiedSkills = skillsParam ? skillsParam.split(',').map((s) => s.trim()) : [];
    const atsScore = atsScoreParam ? parseInt(atsScoreParam, 10) : 78;

    const jobs = generateLinkedInJobsForRole(role, verifiedSkills, atsScore);
    const directSearchUrl = buildLinkedInJobSearchUrl(role);

    return NextResponse.json({
      success: true,
      targetRole: role,
      totalMatched: jobs.length,
      directLinkedInSearchUrl: directSearchUrl,
      jobs,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[LinkedIn Jobs API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch LinkedIn job listings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body.role || 'Fullstack Software Engineer';
    const location = body.location || '';
    const searchUrl = buildLinkedInJobSearchUrl(role, location);

    return NextResponse.json({
      success: true,
      role,
      searchUrl,
      message: `LinkedIn Live Radar subscribed for ${role}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
