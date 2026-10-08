'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
  FileCheck,
  FileUp,
} from 'lucide-react';
import { ResumeAnalysisResult } from '@/lib/types';
import { DetailedResumeAnalysis } from '@/lib/resume/analyzer';

interface ResumeUploadDropzoneProps {
  onParsed?: (
    extracted: NonNullable<ResumeAnalysisResult['extractedProfile']>,
    analysis: ResumeAnalysisResult,
    detailedAnalysis?: DetailedResumeAnalysis,
    fullText?: string
  ) => void;
  targetRole?: string;
  userEmail?: string;
  compact?: boolean;
  className?: string;
}

export function ResumeUploadDropzone({
  onParsed,
  targetRole = 'Fullstack Software Engineer',
  userEmail,
  compact = false,
  className = '',
}: ResumeUploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValid) {
      setErrorMsg('Please upload a valid document (.pdf, .docx, or .txt format).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setUploadedFileName(file.name);
    const sizeKb = Math.round(file.size / 1024);
    setUploadedFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetRole', targetRole);
      if (userEmail) formData.append('email', userEmail);

      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      let data: any;
      const resText = await res.text();
      try {
        data = JSON.parse(resText);
      } catch {
        throw new Error('Could not parse resume file. Please ensure it is a valid PDF or Word document, or paste your resume text directly.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse resume document.');
      }

      setSuccessMsg(`Resume parsed successfully: ${data.analysis.detectedSkills.length} skills detected, ATS score calibrated.`);

      if (onParsed && data.extractedProfile) {
        onParsed(data.extractedProfile, data.analysis, data.detailedAnalysis, data.text);
      }
    } catch (err: any) {
      console.error('[Resume Upload Error]:', err);
      setErrorMsg(err.message || 'An error occurred while analyzing the resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none text-center ${
          compact ? 'p-5' : 'p-8 sm:p-10'
        } ${
          isDragging
            ? 'border-black bg-gray-50 scale-[0.99]'
            : isProcessing
            ? 'border-gray-300 bg-gray-50/70 cursor-wait'
            : uploadedFileName
            ? 'border-gray-300 bg-white hover:border-black'
            : 'border-gray-200 bg-white hover:border-black hover:bg-gray-50/50'
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-2">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center animate-spin">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-black">Parsing Resume Structure...</div>
              <p className="text-xs text-gray-500 font-medium">
                Extracting academic credentials, tech stack, and STAR metrics.
              </p>
            </div>
          </div>
        ) : uploadedFileName ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-black truncate max-w-xs sm:max-w-md">
                  {uploadedFileName}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {uploadedFileSize} • Ready for Analysis
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:bg-gray-100 text-black transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-sm">
              <FileUp className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-black">
                Drop your Resume / CV here or <span className="underline font-extrabold">browse</span>
              </div>
              <p className="text-xs text-gray-500">
                Supports PDF, DOCX, or TXT up to 10MB • Auto-extracts college, CGPA, and skills
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Auto-populates profile in 1-click</span>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-black flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
