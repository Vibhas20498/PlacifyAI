'use client';

import React from 'react';
import { DriveCompanyKey } from '@/lib/placement-war-room/types';

interface CompanyLogoProps {
  companyKey: DriveCompanyKey;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export function CompanyLogo({
  companyKey,
  size = 'md',
  showWordmark = true,
  className = '',
}: CompanyLogoProps) {
  const sizeMap = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
    xl: 'h-12 w-auto',
  };

  switch (companyKey) {
    case 'google-sde':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          {/* Authentic Google Multi-Color G Icon */}
          <svg className={sizeMap[size]} viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          {showWordmark && (
            <span className="font-bold tracking-tight text-gray-900 font-sans text-base sm:text-lg">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          )}
        </div>
      );

    case 'tcs-digital':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          {/* Authentic Tata Consultancy Services Corporate Badge */}
          <div className="flex items-center gap-1.5">
            <div className="bg-[#002D62] text-white px-2 py-1 rounded-md flex flex-col items-center justify-center font-bold leading-none shadow-xs">
              <span className="text-[9px] tracking-widest font-mono font-extrabold text-[#7FB2E5]">TATA</span>
              <span className="text-xs font-black tracking-tight">TCS</span>
            </div>
            {showWordmark && (
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-extrabold text-[#002D62] tracking-tight">TATA</span>
                <span className="text-[10px] font-bold text-gray-700 tracking-wider uppercase">
                  Consultancy Services
                </span>
              </div>
            )}
          </div>
        </div>
      );

    case 'infosys-sp':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          {/* Authentic Infosys Cobalt Blue Signature */}
          <div className="flex items-center">
            <span className="text-[#007cc3] font-bold tracking-tight text-lg sm:text-xl font-sans italic font-black">
              Infosys
            </span>
            {showWordmark && (
              <span className="ml-1 text-[9px] text-gray-400 font-sans uppercase tracking-widest font-semibold border-l border-gray-300 pl-1.5 hidden sm:inline">
                Navigate your next
              </span>
            )}
          </div>
        </div>
      );

    case 'deloitte-usi':
      return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
          {/* Authentic Deloitte Wordmark with signature Green Dot */}
          <span className="font-black tracking-tight text-black text-lg sm:text-xl font-sans">
            Deloitte<span className="text-[#86BC25] font-black">.</span>
          </span>
          {showWordmark && (
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 bg-gray-100 px-1.5 py-0.5 rounded">
              USI
            </span>
          )}
        </div>
      );

    case 'zepto-startup':
      return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
          {/* Authentic Zepto Berry Purple + Lightning Emblem */}
          <div className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white w-7 h-7 rounded-lg flex items-center justify-center font-black shadow-xs">
            <span className="text-xs">⚡</span>
          </div>
          {showWordmark && (
            <span className="text-base sm:text-lg font-black tracking-tighter text-[#7B1FA2]">
              zepto
            </span>
          )}
        </div>
      );

    default:
      return null;
  }
}
