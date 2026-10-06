'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isLoadingProfile: boolean;
  isSavingProfile: boolean;
  unreadNotificationsCount: number;
  setSessionProfile: (newProfile: UserProfile) => void;
  clearSession: () => void;
  updateProfile: (updates: Partial<UserProfile>, syncToSupabase?: boolean) => Promise<void>;
  saveProfileToSupabase: (profileToSave?: UserProfile) => Promise<boolean>;
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
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(3);
  const [shapFactors, setShapFactors] = useState<ShapFactor[]>([]);

  const setSessionProfile = useCallback((newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('placify_profile', JSON.stringify(newProfile));
    } catch {}
  }, []);

  const clearSession = useCallback(() => {
    setProfile(INITIAL_USER_PROFILE);
    try {
      localStorage.removeItem('placify_profile');
    } catch {}
  }, []);

  // 1. Initial hydration from localStorage and Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem('placify_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({ ...prev, ...parsed }));

        // Attempt fetch from Supabase if email exists
        if (parsed.email) {
          setIsLoadingProfile(true);
          fetch(`/api/profile?email=${encodeURIComponent(parsed.email)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data?.profile) {
                const dbProf = data.profile;
                const isConfigured = Boolean(dbProf.university && dbProf.university !== 'Engineering Institution' && Number(dbProf.cgpa) > 0);
                setProfile({
                  id: dbProf.id || '',
                  name: dbProf.name || parsed.name || '',
                  email: dbProf.email || parsed.email,
                  avatarUrl: '',
                  targetRole: dbProf.target_role || parsed.targetRole || 'Fullstack Software Engineer',
                  cgpa: isConfigured ? (Number(dbProf.cgpa) || 0) : 0,
                  university: isConfigured ? dbProf.university : '',
                  degree: isConfigured ? (dbProf.degree || '') : '',
                  tier: (Number(dbProf.tier) as 1 | 2 | 3) || 2,
                  graduationYear: Number(dbProf.graduation_year) || 2026,
                  experienceMonths: Number(dbProf.experience_months) || 0,
                  githubUrl: isConfigured ? (dbProf.github_url || '') : '',
                  linkedinUrl: isConfigured ? (dbProf.linkedin_url || '') : '',
                  verifiedSkills: isConfigured && Array.isArray(dbProf.verified_skills) ? dbProf.verified_skills : [],
                  pendingSkills: isConfigured && Array.isArray(dbProf.pending_skills) ? dbProf.pending_skills : [],
                  projectsCount: isConfigured ? (Number(dbProf.projects_count) || 0) : 0,
                  hasProductionDeployment: isConfigured ? Boolean(dbProf.has_production_deployment) : false,
                  codeSignalScore: isConfigured ? (Number(dbProf.code_signal_score) || 0) : 0,
                  resumeAtsScore: isConfigured ? (Number(dbProf.resume_ats_score) || 0) : 0,
                  placementProbability: isConfigured ? (Number(dbProf.placement_probability) || 0) : 0,
                  careerReadinessScore: isConfigured ? (Number(dbProf.career_readiness_score) || 0) : 0,
                  isOnboarded: isConfigured,
                });
              }
            })
            .catch(() => {})
            .finally(() => setIsLoadingProfile(false));
        }
      }
    } catch {}
  }, []);

  // 2. Recalculate ML predictions whenever profile parameters change
  useEffect(() => {
    const result = calculatePlacementProbability(profile);
    setShapFactors(result.shapFactors);
    setProfile((prev) => {
      const updated = {
        ...prev,
        placementProbability: result.probability,
        careerReadinessScore: result.readinessScore,
      };
      try {
        localStorage.setItem('placify_profile', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [
    profile.cgpa,
    profile.resumeAtsScore,
    profile.codeSignalScore,
    profile.projectsCount,
    profile.hasProductionDeployment,
    profile.verifiedSkills?.length,
    profile.experienceMonths,
    profile.tier,
  ]);

  // 3. Save profile to Supabase database
  const saveProfileToSupabase = useCallback(async (profileToSave?: UserProfile): Promise<boolean> => {
    const target = profileToSave || profile;
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: target }),
      });
      const data = await res.json();
      return res.ok;
    } catch (err) {
      console.error('[Failed to save profile to Supabase]:', err);
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  }, [profile]);

  const updateProfile = async (updates: Partial<UserProfile>, syncToSupabase: boolean = true) => {
    const nextProfile = { ...profile, ...updates };
    setProfile(nextProfile);
    try {
      localStorage.setItem('placify_profile', JSON.stringify(nextProfile));
    } catch {}

    if (syncToSupabase) {
      await saveProfileToSupabase(nextProfile);
    }
  };

  const addVerifiedSkill = (skill: string) => {
    if (!profile.verifiedSkills.includes(skill)) {
      const nextSkills = [...profile.verifiedSkills, skill];
      const nextPending = profile.pendingSkills.filter((s) => s !== skill);
      updateProfile({
        verifiedSkills: nextSkills,
        pendingSkills: nextPending,
      });
    }
  };

  const removeVerifiedSkill = (skill: string) => {
    const nextSkills = profile.verifiedSkills.filter((s) => s !== skill);
    const nextPending = [...profile.pendingSkills, skill];
    updateProfile({
      verifiedSkills: nextSkills,
      pendingSkills: nextPending,
    });
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
    updateProfile({ resumeAtsScore: score });
  };

  const updateCodeSignalScore = (score: number) => {
    updateProfile({ codeSignalScore: score });
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
        isLoadingProfile,
        isSavingProfile,
        unreadNotificationsCount,
        setSessionProfile,
        clearSession,
        updateProfile,
        saveProfileToSupabase,
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
