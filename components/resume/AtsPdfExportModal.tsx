'use client';

import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  Sliders,
  Eye,
} from 'lucide-react';
import { DetailedResumeAnalysis } from '@/lib/resume/analyzer';

interface AtsPdfExportModalProps {
  analysis: DetailedResumeAnalysis;
  targetRole: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AtsPdfExportModal({
  analysis,
  targetRole,
  isOpen,
  onClose,
}: AtsPdfExportModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [accentStyle, setAccentStyle] = useState<'classic' | 'modern' | 'minimal'>('classic');
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyText = (type: 'markdown' | 'plain') => {
    let content = '';
    const prof = analysis.extractedProfile;

    if (type === 'markdown') {
      content = `# ${prof.name || 'Candidate Name'}\n${prof.email || ''} | ${prof.phone || ''} | ${prof.university || ''} | ${prof.githubUrl || ''} | ${prof.linkedinUrl || ''}\n\n## Technical Skills\n${analysis.checks.keywordMatch.foundSkills.join(', ')}\n\n## Projects & Experience\n`;
      analysis.bulletImprovements.forEach((b) => {
        content += `- ${b.improved}\n`;
      });
      content += `\n## Education\n${prof.degree || 'Bachelor of Engineering'} - ${prof.university || 'University'} (CGPA: ${prof.cgpa || '8.5'}/10)\n`;
    } else {
      content = `${prof.name || 'Candidate Name'}\n${prof.email || ''} • ${prof.phone || ''} • ${prof.university || ''}\n\nTECHNICAL SKILLS:\n${analysis.checks.keywordMatch.foundSkills.join(', ')}\n\nEXPERIENCE & PROJECTS:\n`;
      analysis.bulletImprovements.forEach((b) => {
        content += `• ${b.improved}\n`;
      });
      content += `\nEDUCATION:\n${prof.degree || 'Bachelor of Engineering'} - ${prof.university || 'University'}\n`;
    }

    navigator.clipboard.writeText(content);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const candidateBullets =
    analysis.bulletImprovements.length > 0
      ? analysis.bulletImprovements.map((b) => b.improved)
      : [
          'Architected responsive web applications using React and TypeScript, accelerating page load speeds by 45%.',
          'Engineered scalable REST microservices with Node.js and PostgreSQL database handling 20,000+ daily requests.',
          'Automated CI/CD staging deployment pipelines with Docker on AWS ECS, ensuring 99.9% uptime.',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black">
                ATS-Optimized Resume Export
              </h2>
              <p className="text-[11px] text-gray-500">
                Industry-standard single-column Harvard/Jake&apos;s format with 100% parsable typography.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleCopyText('plain')}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:text-black hover:border-black transition-all flex items-center gap-1.5 shadow-2xs"
            >
              {copiedFormat === 'plain' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat === 'plain' ? 'Copied Text!' : 'Copy Plain Text'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-4 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RESUME PREVIEW (A4 Harvard/Jake's Format) */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-gray-100 flex-1 flex justify-center">
          <div
            ref={printAreaRef}
            id="ats-printable-resume"
            className="bg-white text-black p-8 sm:p-12 max-w-[760px] w-full shadow-lg rounded-sm border border-gray-200 font-sans text-left space-y-5 text-sm leading-normal print:p-0 print:border-none print:shadow-none"
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            {/* HEADER */}
            <div className="text-center border-b border-black pb-3 space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black uppercase">
                {analysis.extractedProfile.name || 'Candidate Name'}
              </h1>
              <div className="text-xs text-gray-800 flex flex-wrap justify-center gap-x-3 gap-y-1">
                {analysis.extractedProfile.email && <span>{analysis.extractedProfile.email}</span>}
                {analysis.extractedProfile.phone && <span>• {analysis.extractedProfile.phone}</span>}
                {analysis.extractedProfile.university && <span>• {analysis.extractedProfile.university}</span>}
                {analysis.extractedProfile.linkedinUrl && <span>• linkedin.com/in/...</span>}
                {analysis.extractedProfile.githubUrl && <span>• github.com/...</span>}
              </div>
            </div>

            {/* EDUCATION */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5">
                Education
              </h2>
              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <strong>{analysis.extractedProfile.university || 'University / Institution of Technology'}</strong>
                  <div className="italic text-gray-700">
                    {analysis.extractedProfile.degree || 'Bachelor of Technology in Computer Science'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {analysis.extractedProfile.cgpa ? `CGPA: ${analysis.extractedProfile.cgpa}/10.0` : 'Graduation: 2026'}
                  </div>
                </div>
              </div>
            </div>

            {/* TECHNICAL SKILLS */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5">
                Technical Skills & Competencies
              </h2>
              <div className="text-xs text-gray-900 leading-relaxed space-y-1">
                <div>
                  <strong>Core Languages & Frameworks:</strong>{' '}
                  {analysis.checks.keywordMatch.foundSkills.slice(0, 10).join(', ') || 'React, TypeScript, Node.js, SQL, JavaScript'}
                </div>
                <div>
                  <strong>Developer Tools & Platforms:</strong> Git, Docker, REST APIs, Linux, CI/CD, VS Code
                </div>
              </div>
            </div>

            {/* PROJECTS & EXPERIENCE (Optimized Impact Statements) */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5">
                Projects & Engineering Experience
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-baseline text-xs font-bold text-black">
                    <span>Smart Career & Placement Analytics Platform</span>
                    <span className="font-normal italic text-gray-600">TypeScript, Next.js, Node.js, PostgreSQL</span>
                  </div>
                  <ul className="list-disc pl-4 mt-1 text-xs text-gray-800 space-y-1 leading-snug">
                    {candidateBullets.slice(0, 3).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>

                {candidateBullets.length > 3 && (
                  <div>
                    <div className="flex justify-between items-baseline text-xs font-bold text-black">
                      <span>Distributed Microservices Architecture</span>
                      <span className="font-normal italic text-gray-600">Docker, Redis, PostgreSQL, AWS</span>
                    </div>
                    <ul className="list-disc pl-4 mt-1 text-xs text-gray-800 space-y-1 leading-snug">
                      {candidateBullets.slice(3, 6).map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-300 pb-0.5">
                Certifications & Achievements
              </h2>
              <ul className="list-disc pl-4 text-xs text-gray-800 space-y-0.5">
                <li>Ranked in Top 5% across algorithmic programming assessments (CodeSignal / LeetCode).</li>
                <li>Verified Fullstack Career Readiness Credential — Placify AI ATS Benchmark.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
