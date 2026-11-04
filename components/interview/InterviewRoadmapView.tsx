'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Map,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code2,
  RotateCcw,
  Target,
  Plus,
} from 'lucide-react';
import { InterviewRoadmapTask } from '@/lib/interview/types';
import { useUser } from '@/lib/store/user-context';
import { convertTaskToRoadmapNode } from '@/lib/interview/client-service';

interface InterviewRoadmapViewProps {
  tasks: InterviewRoadmapTask[];
  targetRole: string;
  onRetakeInterview: () => void;
}

export function InterviewRoadmapView({
  tasks,
  targetRole,
  onRetakeInterview,
}: InterviewRoadmapViewProps) {
  const { roadmap } = useUser();
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [addedNodeIds, setAddedNodeIds] = useState<Set<string>>(new Set());

  const toggleTaskCompleted = (id: string) => {
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddToMainRoadmap = (task: InterviewRoadmapTask) => {
    setAddedNodeIds((prev) => new Set(prev).add(task.id));
    // Save to user context or local storage
    try {
      const newNode = convertTaskToRoadmapNode(task, roadmap.length);
      const updated = [...roadmap, newNode];
      localStorage.setItem('placify_roadmap', JSON.stringify(updated));
    } catch {}
  };

  const highPriorityTasks = tasks.filter((t) => t.priority === 'high');
  const mediumPriorityTasks = tasks.filter((t) => t.priority === 'medium');
  const lowPriorityTasks = tasks.filter((t) => t.priority === 'low');

  const totalEffortHours = tasks.reduce((sum, t) => sum + t.studyEffortHours, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs card-hover-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                WEAKNESS-SPECIFIC PRACTICE ROADMAP
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                AI Grounded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black font-heading mt-1">
              Personalized Placement Practice Plan
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Derived directly from your mock interview answers and identified knowledge gaps for{' '}
              <span className="font-semibold text-black">{targetRole}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 self-start sm:self-auto font-mono text-xs">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-bold text-black">{totalEffortHours} Hours</span>
              <span className="text-gray-400 block text-[10px]">Estimated Study Effort</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Bridging Your Interview Gaps: </span>
            <span>
              Each task below links directly to an interview question where technical depth or trade-offs were lacking. Complete the practice activity, then retake the mock interview to verify your score improvement.
            </span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-6">
        {tasks.map((task, idx) => {
          const isDone = completedTaskIds.has(task.id);
          const isAdded = addedNodeIds.has(task.id);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-2xs space-y-4 ${
                isDone
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-200/90 hover:border-black'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleTaskCompleted(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-gray-300 hover:border-black'
                    }`}
                    title="Mark task completed"
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black font-heading">
                        {task.skillOrConcept}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{task.studyEffortHours} Hours</span>
                </div>
              </div>

              {/* Evidence from interview */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 border border-gray-100">
                <span className="font-bold text-gray-900">Observed in Interview: </span>
                <span>{task.evidenceFromInterview}</span>
              </div>

              {/* Learning Objective & Activity */}
              <div className="space-y-2 text-xs leading-relaxed">
                <div>
                  <span className="font-bold text-black">Learning Objective: </span>
                  <span className="text-gray-700">{task.learningObjective}</span>
                </div>
                <div>
                  <span className="font-bold text-black">Hands-on Practice Activity: </span>
                  <span className="text-gray-700">{task.practiceActivity}</span>
                </div>
                <div>
                  <span className="font-bold text-black">Mastery Completion Criteria: </span>
                  <span className="text-gray-700">{task.completionCriteria}</span>
                </div>
              </div>

              {/* Example retry question */}
              {task.exampleQuestionsToRetry?.[0] && (
                <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-sky-400 block">
                    Interview Question to Retry:
                  </span>
                  <p className="text-slate-200 italic">"{task.exampleQuestionsToRetry[0]}"</p>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => toggleTaskCompleted(task.id)}
                  className="text-xs font-semibold text-gray-500 hover:text-black"
                >
                  {isDone ? 'Mark as Pending' : 'Mark as Done'}
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToMainRoadmap(task)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white text-black border-gray-200 hover:border-black'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Added to Main Roadmap</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Learning Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Nav CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <Link
          href="/learning-roadmap"
          className="px-6 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-800 hover:border-black transition-all flex items-center justify-center gap-2 shadow-2xs"
        >
          <Map className="w-4 h-4" />
          <span>Go to Master Learning Roadmap</span>
        </Link>

        <button
          type="button"
          onClick={onRetakeInterview}
          className="px-8 py-3.5 rounded-2xl bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group btn-press"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Launch Retest Mock Interview</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
