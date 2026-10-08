import { NextResponse } from 'next/server';
import { analyzeResume, analyzeResumeContent } from '@/lib/resume/analyzer';
import { extractResumeTextFromBuffer } from '@/lib/resume/extractor';
import { parseResumeText } from '@/lib/resume/parser';
import { generateRAGResumeAnalysis } from '@/lib/rag-engine/resume-rag-service';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let textContent = '';
    let fileName = 'resume.pdf';
    let fileSize = '185 KB';
    let targetRole = 'Software Engineer';
    let userEmail: string | undefined;
    let jobDescription: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      targetRole = (formData.get('targetRole') as string) || targetRole;
      userEmail = (formData.get('email') as string) || undefined;
      jobDescription = (formData.get('jobDescription') as string) || undefined;

      if (!file) {
        return NextResponse.json({ error: 'No resume file provided in upload.' }, { status: 400 });
      }

      fileName = file.name;
      const sizeInKb = Math.round(file.size / 1024);
      fileSize = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;

      // Read buffer content
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Accurately extract plain text from PDF/DOCX/TXT
      textContent = await extractResumeTextFromBuffer(buffer, fileName);
    } else {
      const body = await request.json();
      textContent = body.text || '';
      targetRole = body.targetRole || targetRole;
      fileName = body.fileName || fileName;
      fileSize = body.fileSize || fileSize;
      userEmail = body.email;
      jobDescription = body.jobDescription;

      if (!textContent) {
        return NextResponse.json({ error: 'Resume text content is required.' }, { status: 400 });
      }
    }

    // 1. Structured entity parsing
    const parsedEntities = parseResumeText(textContent);

    // 2. Run deep deterministic ATS analysis
    const detailedAnalysis = analyzeResumeContent(textContent, targetRole, fileName, fileSize);
    const analysis = analyzeResume(textContent, targetRole, fileName, fileSize);

    // 3. Run RAG Reasoning Intelligence Layer
    const ragAnalysis = await generateRAGResumeAnalysis({
      rawText: textContent,
      parsedEntities,
      deterministicAnalysis: detailedAnalysis,
      targetRole,
      jobDescription,
    });

    detailedAnalysis.ragAnalysis = ragAnalysis;

    // 4. If user is authenticated with email, sync ATS score and resume metadata to Supabase
    if (userEmail && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('profiles')
          .update({
            resume_ats_score: analysis.overallScore,
            updated_at: new Date().toISOString(),
          })
          .eq('email', userEmail.toLowerCase().trim());
      } catch (dbErr) {
        console.warn('[Supabase Resume ATS Sync Warning]:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      text: textContent,
      analysis,
      detailedAnalysis,
      ragAnalysis,
      extractedProfile: analysis.extractedProfile,
    });
  } catch (error: any) {
    console.error('[Resume Parsing & RAG API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process and analyze resume file.' },
      { status: 500 }
    );
  }
}
