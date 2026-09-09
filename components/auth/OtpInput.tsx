'use client';

import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const valDigits = value.split('').slice(0, length);
    const newDigits = Array(length).fill('');
    valDigits.forEach((d, i) => {
      newDigits[i] = d;
    });
    setDigits(newDigits);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;
    const cleanVal = val.replace(/\D/g, '');

    if (!cleanVal) {
      // Empty / clear
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      onChange(updated.join(''));
      return;
    }

    // Single digit entry
    const lastChar = cleanVal.slice(-1);
    const updated = [...digits];
    updated[index] = lastChar;
    setDigits(updated);
    onChange(updated.join(''));

    // Move focus to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData) {
      const updated = Array(length).fill('');
      pastedData.split('').forEach((char, idx) => {
        updated[idx] = char;
      });
      setDigits(updated);
      onChange(updated.join(''));

      const nextFocusIdx = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIdx]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 select-none">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          className={`w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
            digit
              ? 'border-black bg-white text-black ring-1 ring-black'
              : 'border-gray-200 bg-gray-50/50 text-gray-800 hover:border-gray-400 focus:border-black focus:bg-white focus:ring-1 focus:ring-black'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
}
