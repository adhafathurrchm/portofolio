export interface ProfileStats {
  yearsExp: number;
  projectsDone: number;
  happyClients: number;
  followers: number;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
}

export interface Profile {
  greeting: string;
  namePrefix?: string;
  fullName: string;
  highlightWords: string;
  roleBadges: string[];
  bio: string;
  heroDescription?: string;
  avatarUrl: string;
  heroImageUrl: string;
  stats: ProfileStats;
  contactInfo: ContactInfo;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  skills: string[];
  order: number;
}

export type ResumeCategory = 'EDUCATION' | 'EXPERIENCE' | 'ORGANIZATION' | 'AWARD';

export interface ResumeItem {
  id: string;
  category: ResumeCategory;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  imageUrl?: string; // Image / Logo URL for Organizations & Awards
  order: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'IOT' | 'NETWORKING' | 'OTHER' | string;
  thumbnailUrl: string;
  images?: string[];
  description: string;
  projectUrl?: string;
  repoUrl?: string;
  featured: boolean;
  showInAll?: boolean;
  createdAt: number;
}

export interface Competency {
  id: string;
  title: string;
  issuer?: string;
  issueDate?: string;
  imageUrl?: string;
  credentialUrl?: string;
  category?: string;
  description: string;
  order: number;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company?: string;
  avatarUrl?: string;
  quote: string;
  rating: number;
  isVisible?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}
