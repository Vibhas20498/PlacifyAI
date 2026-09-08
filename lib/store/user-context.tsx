'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SkillGapItem, JobListing, RoadmapNode, ShapFactor } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_SKILL_GAPS, INITIAL_JOBS, INITIAL_ROADMAP } from '../mock-data';
import { calculatePlacementProbability } from '../ml-engine';

interface UserContextType {
  profile: UserProfile;
  skillGaps: SkillGapItem[];
  jobs: JobListing[];
  roadmap: RoadmapNode[];
  shapFactors: ShapFactor[];
  isOnline: boolean;
  unreadNotificationsCount: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addVerifiedSkill: (skill: string) => void;
  removeVerifiedSkill: (skill: string) => void;
  toggleRoadmapNode: (nodeId: string) => void;
  updateResumeAts: (score: number) => void;
  updateCodeSignalScore: (score: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(INITIAL_SKILL_GAPS);
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [roadmap, setRoadmap] = useState<RoadmapNode[]>(INITIAL_ROADMAP);
  const [isOnline] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);
  const [shapFactors, setShapFactors] = useState<ShapFactor[]>([]);

  // Recalculate ML predictions whenever profile changes
  useEffect(() => {
    const result = calculatePlacementProbability(profile);
    setShapFactors(result.shapFactors);
    setProfile((prev) => ({
      ...prev,
      placementProbability: result.probability,
      careerReadinessScore: result.readinessScore,
    }));
  }, [
    profile.cgpa,
    profile.resumeAtsScore,
    profile.codeSignalScore,
    profile.projectsCount,
    profile.hasProductionDeployment,
    profile.verifiedSkills?.length,
    profile.experienceMonths,
    profile.tier
  ]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addVerifiedSkill = (skill: string) => {
    if (!profile.verifiedSkills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        verifiedSkills: [...prev.verifiedSkills, skill],
        pendingSkills: prev.pendingSkills.filter((s) => s !== skill),
      }));
    }
  };

  const removeVerifiedSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      verifiedSkills: prev.verifiedSkills.filter((s) => s !== skill),
      pendingSkills: [...prev.pendingSkills, skill],
    }));
  };

  const toggleRoadmapNode = (nodeId: string) => {
    setRoadmap((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const nextStatus =
            node.status === 'completed'
              ? 'in-progress'
              : node.status === 'in-progress'
              ? 'pending'
              : 'completed';
          return { ...node, status: nextStatus };
        }
        return node;
      })
    );
  };

  const updateResumeAts = (score: number) => {
    setProfile((prev) => ({ ...prev, resumeAtsScore: score }));
  };

  const updateCodeSignalScore = (score: number) => {
    setProfile((prev) => ({ ...prev, codeSignalScore: score }));
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        skillGaps,
        jobs,
        roadmap,
        shapFactors,
        isOnline,
        unreadNotificationsCount,
        updateProfile,
        addVerifiedSkill,
        removeVerifiedSkill,
        toggleRoadmapNode,
        updateResumeAts,
        updateCodeSignalScore,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
