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
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [competencies, setCompetencies] = useState<Competency[]>(initialCompetencies);
  const [resumeItems, setResumeItems] = useState<ResumeItem[]>(initialResumeItems);
  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Firestore Data
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
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

      <main className="flex-1 lg:mr-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
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
