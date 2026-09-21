import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import {
  initialProfile,
  initialServices,
  initialResumeItems,
  initialProjects,
  initialCompetencies,
  initialSkills,
} from "./mock-data";
import {
  Profile,
  Service,
  ResumeItem,
  PortfolioProject,
  Testimonial,
  ContactMessage,
  Competency,
  SkillCategory,
} from "@/types";

// Local state fallback memory for active dev sessions without Firebase
let memoryProfile: Profile = { ...initialProfile };
let memoryServices: Service[] = [...initialServices];
let memoryResumeItems: ResumeItem[] = [...initialResumeItems];
let memoryProjects: PortfolioProject[] = [...initialProjects];
let memoryCompetencies: Competency[] = [...initialCompetencies];
let memorySkills: SkillCategory[] = [...initialSkills];
let memoryTestimonials: Testimonial[] = [];
let memoryMessages: ContactMessage[] = [];

function getLocalCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
}

function setLocalCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
}

function cleanPayload<T extends object>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    const val = (data as any)[key];
    if (val !== undefined && key !== "id") {
      clean[key] = val;
    }
  });
  return clean;
}

export async function getProfileData(): Promise<Profile> {
  const cached = getLocalCache<Profile>("portfolio_profile");
  if (!isFirebaseConfigured || !db) return cached || memoryProfile;
  try {
    const docRef = doc(db, "profile", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as Profile;
      memoryProfile = { ...data };
      setLocalCache("portfolio_profile", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore profile fetch error, using fallback:", err);
  }
  return cached || memoryProfile;
}

export async function saveProfileData(profile: Profile): Promise<boolean> {
  memoryProfile = { ...profile };
  setLocalCache("portfolio_profile", profile);
  if (!isFirebaseConfigured || !db) return true;
  try {
    const docRef = doc(db, "profile", "main");
    const payload = cleanPayload(profile);
    await setDoc(docRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore profile save error:", err);
    return false;
  }
}

export async function getServicesData(): Promise<Service[]> {
  const cached = getLocalCache<Service[]>("portfolio_services");
  if (!isFirebaseConfigured || !db) return cached || memoryServices;
  try {
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Service));
      memoryServices = [...data];
      setLocalCache("portfolio_services", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore services fetch error:", err);
  }
  return cached || memoryServices;
}

export async function saveServiceItem(service: Partial<Service>): Promise<boolean> {
  let targetId = service.id;
  if (targetId) {
    memoryServices = memoryServices.map((s) => (s.id === targetId ? ({ ...s, ...service } as Service) : s));
  } else {
    targetId = `serv-${Date.now()}`;
    const newService = { ...service, id: targetId, order: memoryServices.length + 1 } as Service;
    memoryServices.push(newService);
  }
  setLocalCache("portfolio_services", memoryServices);

  if (!isFirebaseConfigured || !db) return true;
  try {
    const payload = cleanPayload(service);
    await setDoc(doc(db, "services", targetId), payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore service save error:", err);
    return false;
  }
}

export async function deleteServiceItem(id: string): Promise<boolean> {
  memoryServices = memoryServices.filter((s) => s.id !== id);
  setLocalCache("portfolio_services", memoryServices);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "services", id));
    return true;
  } catch (err) {
    console.error("Firestore service delete error:", err);
    return false;
  }
}

// 3. Resume Items Helpers (Education, Experience, Organization, Award)
export async function getResumeData(): Promise<ResumeItem[]> {
  const cached = getLocalCache<ResumeItem[]>("portfolio_resume");
  if (!isFirebaseConfigured || !db) return cached || memoryResumeItems;
  try {
    const q = query(collection(db, "resume"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ResumeItem));
      memoryResumeItems = [...data];
      setLocalCache("portfolio_resume", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore resume fetch error:", err);
  }
  return cached || memoryResumeItems;
}

export async function saveResumeItem(item: Partial<ResumeItem>): Promise<boolean> {
  let targetId = item.id;
  if (targetId) {
    memoryResumeItems = memoryResumeItems.map((r) => (r.id === targetId ? ({ ...r, ...item } as ResumeItem) : r));
  } else {
    targetId = `res-${Date.now()}`;
    const newItem = { ...item, id: targetId, order: memoryResumeItems.length + 1 } as ResumeItem;
    memoryResumeItems.push(newItem);
  }
  setLocalCache("portfolio_resume", memoryResumeItems);

  if (!isFirebaseConfigured || !db) return true;
  try {
    const payload = cleanPayload(item);
    await setDoc(doc(db, "resume", targetId), payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore resume save error:", err);
    return false;
  }
}

export async function deleteResumeItem(id: string): Promise<boolean> {
  memoryResumeItems = memoryResumeItems.filter((r) => r.id !== id);
  setLocalCache("portfolio_resume", memoryResumeItems);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "resume", id));
    return true;
  } catch (err) {
    console.error("Firestore resume delete error:", err);
    return false;
  }
}

// 4. Portfolio Projects Helpers
export async function getProjectsData(): Promise<PortfolioProject[]> {
  const cached = getLocalCache<PortfolioProject[]>("portfolio_projects");
  if (!isFirebaseConfigured || !db) return cached || memoryProjects;
  try {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as PortfolioProject));
      memoryProjects = [...data];
      setLocalCache("portfolio_projects", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore portfolio fetch error:", err);
  }
  return cached || memoryProjects;
}

export async function saveProjectData(project: Partial<PortfolioProject>): Promise<boolean> {
  let targetId = project.id;
  if (targetId) {
    memoryProjects = memoryProjects.map((p) => (p.id === targetId ? ({ ...p, ...project } as PortfolioProject) : p));
  } else {
    targetId = `proj-${Date.now()}`;
    const newProj = { ...project, id: targetId, createdAt: Date.now() } as PortfolioProject;
    memoryProjects.unshift(newProj);
  }
  setLocalCache("portfolio_projects", memoryProjects);

  if (!isFirebaseConfigured || !db) return true;
  try {
    const payload = cleanPayload({ ...project, createdAt: project.createdAt || Date.now() });
    await setDoc(doc(db, "portfolio", targetId), payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore project save error:", err);
    return false;
  }
}

export async function deleteProjectData(id: string): Promise<boolean> {
  memoryProjects = memoryProjects.filter((p) => p.id !== id);
  setLocalCache("portfolio_projects", memoryProjects);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "portfolio", id));
    return true;
  } catch (err) {
    console.error("Firestore project delete error:", err);
    return false;
  }
}

// 5. Testimonials Helpers
export async function getTestimonialsData(): Promise<Testimonial[]> {
  if (!isFirebaseConfigured || !db) return memoryTestimonials;
  try {
    const snap = await getDocs(collection(db, "testimonials"));
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Testimonial));
    }
  } catch (err) {
    console.warn("Firestore testimonials fetch error:", err);
  }
  return memoryTestimonials;
}

// 6. Contact Messages Helpers
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isFirebaseConfigured || !db) return memoryMessages;
  try {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ContactMessage));
    }
  } catch (err) {
    console.warn("Firestore messages fetch error:", err);
  }
  return memoryMessages;
}

export async function sendContactMessage(msg: Omit<ContactMessage, "id" | "isRead" | "createdAt">): Promise<boolean> {
  const newMsg: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    isRead: false,
    createdAt: Date.now(),
  };
  memoryMessages.unshift(newMsg);

  if (!isFirebaseConfigured || !db) return true;
  try {
    await addDoc(collection(db, "contact_messages"), {
      ...msg,
      isRead: false,
      createdAt: Date.now(),
    });
    return true;
  } catch (err) {
    console.error("Firestore message send error:", err);
    return false;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  memoryMessages = memoryMessages.filter((m) => m.id !== id);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "contact_messages", id));
    return true;
  } catch (err) {
    console.error("Firestore message delete error:", err);
    return false;
  }
}

// 7. Competencies Helpers
export async function getCompetenciesData(): Promise<Competency[]> {
  const cached = getLocalCache<Competency[]>("portfolio_competencies");
  if (!isFirebaseConfigured || !db) return cached || memoryCompetencies;
  try {
    const q = query(collection(db, "competencies"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Competency));
      memoryCompetencies = [...data];
      setLocalCache("portfolio_competencies", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore competencies fetch error:", err);
  }
  return cached || memoryCompetencies;
}

export async function saveCompetencyItem(item: Partial<Competency>): Promise<boolean> {
  let targetId = item.id;
  if (targetId) {
    memoryCompetencies = memoryCompetencies.map((c) => (c.id === targetId ? ({ ...c, ...item } as Competency) : c));
  } else {
    targetId = `comp-${Date.now()}`;
    const newItem = { ...item, id: targetId, order: memoryCompetencies.length + 1 } as Competency;
    memoryCompetencies.push(newItem);
  }
  setLocalCache("portfolio_competencies", memoryCompetencies);

  if (!isFirebaseConfigured || !db) return true;
  try {
    const payload = cleanPayload(item);
    await setDoc(doc(db, "competencies", targetId), payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore competency save error:", err);
    return false;
  }
}

export async function deleteCompetencyItem(id: string): Promise<boolean> {
  memoryCompetencies = memoryCompetencies.filter((c) => c.id !== id);
  setLocalCache("portfolio_competencies", memoryCompetencies);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "competencies", id));
    return true;
  } catch (err) {
    console.error("Firestore competency delete error:", err);
    return false;
  }
}

// 8. Skills Helpers
export async function getSkillsData(): Promise<SkillCategory[]> {
  const cached = getLocalCache<SkillCategory[]>("portfolio_skills");
  if (!isFirebaseConfigured || !db) return cached || memorySkills;
  try {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as SkillCategory));
      memorySkills = [...data];
      setLocalCache("portfolio_skills", data);
      return data;
    }
  } catch (err) {
    console.warn("Firestore skills fetch error:", err);
  }
  return cached || memorySkills;
}

export async function saveSkillItem(item: Partial<SkillCategory>): Promise<boolean> {
  let targetId = item.id;
  if (targetId) {
    memorySkills = memorySkills.map((s) => (s.id === targetId ? ({ ...s, ...item } as SkillCategory) : s));
  } else {
    targetId = `skill-${Date.now()}`;
    const newItem = { ...item, id: targetId, order: memorySkills.length + 1 } as SkillCategory;
    memorySkills.push(newItem);
  }
  setLocalCache("portfolio_skills", memorySkills);

  if (!isFirebaseConfigured || !db) return true;
  try {
    const payload = cleanPayload(item);
    await setDoc(doc(db, "skills", targetId), payload, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore skill save error:", err);
    return false;
  }
}

export async function deleteSkillItem(id: string): Promise<boolean> {
  memorySkills = memorySkills.filter((s) => s.id !== id);
  setLocalCache("portfolio_skills", memorySkills);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "skills", id));
    return true;
  } catch (err) {
    console.error("Firestore skill delete error:", err);
    return false;
  }
}

