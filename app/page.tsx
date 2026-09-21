'use client';

import React, { useEffect, useState } from 'react';
import { SidebarLeft } from '@/components/public/SidebarLeft';
import { SidebarRight } from '@/components/public/SidebarRight';
import { HeroSection } from '@/components/public/HeroSection';
import { AboutSection } from '@/components/public/AboutSection';
import { CompetencySection } from '@/components/public/CompetencySection';
import { ResumeSection } from '@/components/public/ResumeSection';
import { PortfolioSection } from '@/components/public/PortfolioSection';
import { ContactSection } from '@/components/public/ContactSection';
import { LanguageSwitcher } from '@/components/public/LanguageSwitcher';

import {
  getProfileData,
  getServicesData,
  getResumeData,
  getProjectsData,
  getCompetenciesData,
  getSkillsData,
} from '@/lib/firestore';

import { Profile, Service, ResumeItem, PortfolioProject, Competency, SkillCategory } from '@/types';
import { initialProfile, initialServices, initialResumeItems, initialProjects, initialCompetencies, initialSkills } from '@/lib/mock-data';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>('home');

  const [hasCache, setHasCache] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('portfolio_profile'));
    }
    return false;
  });

  const [profile, setProfile] = useState<Profile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_profile');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialProfile;
  });

  const [services, setServices] = useState<Service[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_services');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialServices;
  });

  const [skills, setSkills] = useState<SkillCategory[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_skills');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialSkills;
  });

  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_competencies');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialCompetencies;
  });

  const [resumeItems, setResumeItems] = useState<ResumeItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_resume');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialResumeItems;
  });

  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('portfolio_projects');
        if (item) return JSON.parse(item);
      } catch (e) {}
    }
    return initialProjects;
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Read cache on client mount
  useEffect(() => {
    try {
      const cProf = localStorage.getItem('portfolio_profile');
      const cServ = localStorage.getItem('portfolio_services');
      const cComp = localStorage.getItem('portfolio_competencies');
      const cRes = localStorage.getItem('portfolio_resume');
      const cProj = localStorage.getItem('portfolio_projects');
      const cSkills = localStorage.getItem('portfolio_skills');

      if (cProf) {
        setProfile(JSON.parse(cProf));
        setHasCache(true);
      }
      if (cServ) setServices(JSON.parse(cServ));
      if (cComp) setCompetencies(JSON.parse(cComp));
      if (cRes) setResumeItems(JSON.parse(cRes));
      if (cProj) setProjects(JSON.parse(cProj));
      if (cSkills) setSkills(JSON.parse(cSkills));
    } catch (e) {
      console.warn('Failed to load cache:', e);
    }
  }, []);

  // Fetch fresh Firestore Data
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, servData, compData, resData, projData, skillData] = await Promise.all([
          getProfileData(),
          getServicesData(),
          getCompetenciesData(),
          getResumeData(),
          getProjectsData(),
          getSkillsData(),
        ]);

        if (profData) setProfile(profData);
        if (servData?.length) setServices(servData);
        if (compData?.length) setCompetencies(compData);
        if (resData?.length) setResumeItems(resData);
        if (projData?.length) setProjects(projData);
        if (skillData?.length) setSkills(skillData);
      } catch (err) {
        console.warn('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['home', 'about', 'kompetensi', 'resume', 'portfolio', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading && !hasCache) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mb-4" />
          <h2 className="text-amber-400 font-extrabold uppercase tracking-widest text-sm animate-pulse">
            MEMUAT PORTOFOLIO...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative lg:pr-16 overflow-x-hidden">
      <div className="fixed top-4 right-4 lg:right-20 z-40">
        <LanguageSwitcher />
      </div>

      <SidebarLeft
        profile={profile}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <SidebarRight
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <HeroSection profile={profile} onNavigate={handleNavigate} />
        <AboutSection profile={profile} services={services} skills={skills} />
        <CompetencySection competencies={competencies} />
        <ResumeSection resumeItems={resumeItems} />
        <PortfolioSection projects={projects} />
        <ContactSection profile={profile} />
      </main>
    </div>
  );
}
