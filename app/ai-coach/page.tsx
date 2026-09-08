'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/lib/store/user-context';
import { generateCoachResponse } from '@/lib/rag-engine';
import { CoachMessage } from '@/lib/types';
import { MessageSquare, Send, Sparkles, BookOpen, ShieldCheck, User } from 'lucide-react';

export default function AICoachPage() {
  const { profile } = useUser();
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'msg-init',
      sender: 'coach',
      text: `Hello ${profile.name}. I am your RAG-grounded Career Coach. I provide placement guidance constrained directly by verified engineering rubrics, company interview transcripts, and ATS scoring standards for ${profile.targetRole} roles. How can I assist your placement preparation today?`,
      timestamp: '10:00 AM',
      groundedSources: [
        { title: 'Tier-1 Engineering Hiring Rubric', sourceDoc: 'FAANG/Tier-1 Guidelines', category: 'Hiring Rubric' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isGenerating) return;

    const userMsg: CoachMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    setTimeout(() => {
      const response = generateCoachResponse(query, profile);
      const coachMsg: CoachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedSources: response.sources,
      };

      setMessages((prev) => [...prev, coachMsg]);
      setIsGenerating(false);
    }, 800);
  };

  const suggestedPrompts = [
    'How do I optimize my resume for Tier-1 backend roles?',
    'What are the most tested DSA patterns in campus placements?',
    'How do I handle behavioral interview questions with the STAR method?',
    'What project should I build to boost my probability above 90%?',
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-black">
                RAG Career Coach
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-black">
                <ShieldCheck className="w-3 h-3 text-black" />
                Grounded Engine
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Multi-turn conversational advisor referencing your profile and verified market rubrics.
            </p>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.groundedSources && msg.groundedSources.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
                      <div className="text-[10px] font-mono font-semibold uppercase text-gray-400">
                        Grounded Knowledge Citations
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundedSources.map((source, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-[10px] font-medium text-gray-700"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-gray-500" />
                            <span>{source.title}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] font-mono ${
                      isUser ? 'text-gray-400 text-right' : 'text-gray-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 text-black flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex gap-3 items-center text-xs text-gray-500 font-mono">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Searching vector store & synthesizing grounded advice...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompt Chips & Input Bar */}
        <div className="space-y-3 shrink-0 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full border border-gray-200 bg-white hover:border-black hover:bg-gray-50 text-[11px] font-medium text-gray-700 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Ask coach about ${profile.targetRole} placement strategies...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-xs focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isGenerating}
              className="px-5 py-3 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
