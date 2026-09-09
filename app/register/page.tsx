'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, ShieldCheck, Mail, User, Briefcase, RefreshCw, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import { OtpInput } from '@/components/auth/OtpInput';
import { useUser } from '@/lib/store/user-context';

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile } = useUser();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('Vibhas Kadam');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('Fullstack Software Engineer');
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devCodePreview, setDevCodePreview] = useState<string | null>(null);

  // 60-second resend countdown timer
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, targetRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setSuccessMsg(data.message);
      if (data.previewCode) {
        setDevCodePreview(data.previewCode);
      }
      setStep(2);
      setResendTimer(60);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while sending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, name, targetRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed. Please try again.');
      }

      // Update client-side user context
      updateProfile({
        name: data.user?.name || name,
        email: data.user?.email || email,
        targetRole: data.user?.targetRole || targetRole,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-200 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-black">Placify AI</span>
        </Link>

        <div className="text-xs text-gray-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-black hover:underline">
            Log in
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          {/* Brand header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-[11px] font-mono font-medium text-gray-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>Passwordless Cryptographic Auth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              {step === 1 ? 'Create Candidate Account' : 'Verify Email Address'}
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              {step === 1
                ? 'Join PlacifyAI to estimate your placement probability with calibrated ML models.'
                : `We sent a single-use 6-digit code to ${email}`}
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Dev Mode Code Preview Alert */}
          {devCodePreview && step === 2 && (
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black font-mono">
                <Info className="w-3.5 h-3.5 text-black" />
                <span>Development Mode Preview:</span>
              </div>
              <p className="font-mono text-xs">
                Your OTP code is <strong className="text-black text-sm tracking-widest bg-white px-2 py-0.5 rounded border border-gray-300">{devCodePreview}</strong>
              </p>
            </div>
          )}

          {/* STEP 1: Candidate Information & Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vibhas Kadam"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@university.edu"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span>Target Role</span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                >
                  <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
                  <option value="Backend Software Engineer">Backend Software Engineer</option>
                  <option value="Frontend Software Engineer">Frontend Software Engineer</option>
                  <option value="Data Engineer / ML Engineer">Data Engineer / ML Engineer</option>
                  <option value="DevOps / Cloud Platform Engineer">DevOps / Cloud Platform Engineer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 text-center block">
                  Enter 6-Digit Code
                </label>
                <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Complete Registration</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setErrorMsg('');
                  }}
                  className="flex items-center gap-1 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || isLoading}
                  onClick={() => handleSendOtp()}
                  className={`font-mono ${
                    resendTimer > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-black font-semibold hover:underline'
                  }`}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6 sm:px-12 text-center text-xs text-gray-400 font-mono">
        PlacifyAI — Secured by Cryptographic Single-Use OTP & Supabase Database.
      </footer>
    </div>
  );
}
