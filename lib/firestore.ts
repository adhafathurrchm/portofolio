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

export async function getProfileData(): Promise<Profile> {
  if (!isFirebaseConfigured || !db) return memoryProfile;
  try {
    const docRef = doc(db, "profile", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Profile;
    }
  } catch (err) {
    console.warn("Firestore profile fetch error, using fallback:", err);
  }
  return memoryProfile;
}

export async function saveProfileData(profile: Profile): Promise<boolean> {
  memoryProfile = { ...profile };
  if (!isFirebaseConfigured || !db) return true;
  try {
    const docRef = doc(db, "profile", "main");
    await setDoc(docRef, profile, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore profile save error:", err);
    return false;
  }
}

export async function getServicesData(): Promise<Service[]> {
  if (!isFirebaseConfigured || !db) return memoryServices;
  try {
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Service));
    }
  } catch (err) {
    console.warn("Firestore services fetch error:", err);
  }
  return memoryServices;
}

export async function saveServiceItem(service: Partial<Service>): Promise<boolean> {
  if (service.id) {
    memoryServices = memoryServices.map((s) => (s.id === service.id ? { ...s, ...service } as Service : s));
  } else {
    const newService = { ...service, id: `serv-${Date.now()}`, order: memoryServices.length + 1 } as Service;
    memoryServices.push(newService);
  }

  if (!isFirebaseConfigured || !db) return true;
  try {
    if (service.id) {
      await updateDoc(doc(db, "services", service.id), service);
    } else {
      await addDoc(collection(db, "services"), service);
    }
    return true;
  } catch (err) {
    console.error("Firestore service save error:", err);
    return false;
  }
}

export async function deleteServiceItem(id: string): Promise<boolean> {
  memoryServices = memoryServices.filter((s) => s.id !== id);
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
  if (!isFirebaseConfigured || !db) return memoryResumeItems;
  try {
    const q = query(collection(db, "resume"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ResumeItem));
    }
  } catch (err) {
    console.warn("Firestore resume fetch error:", err);
  }
  return memoryResumeItems;
}

export async function saveResumeItem(item: Partial<ResumeItem>): Promise<boolean> {
  if (item.id) {
    memoryResumeItems = memoryResumeItems.map((r) => (r.id === item.id ? { ...r, ...item } as ResumeItem : r));
  } else {
    const newItem = { ...item, id: `res-${Date.now()}`, order: memoryResumeItems.length + 1 } as ResumeItem;
    memoryResumeItems.push(newItem);
  }

  if (!isFirebaseConfigured || !db) return true;
  try {
    if (item.id) {
      await updateDoc(doc(db, "resume", item.id), item);
    } else {
      await addDoc(collection(db, "resume"), item);
    }
    return true;
  } catch (err) {
    console.error("Firestore resume save error:", err);
    return false;
  }
}

export async function deleteResumeItem(id: string): Promise<boolean> {
  memoryResumeItems = memoryResumeItems.filter((r) => r.id !== id);
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
  if (!isFirebaseConfigured || !db) return memoryProjects;
  try {
    const q = query(collection(db, "portfolio"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as PortfolioProject));
    }
  } catch (err) {
    console.warn("Firestore portfolio fetch error:", err);
  }
  return memoryProjects;
}

export async function saveProjectData(project: Partial<PortfolioProject>): Promise<boolean> {
  if (project.id) {
    memoryProjects = memoryProjects.map((p) => (p.id === project.id ? { ...p, ...project } as PortfolioProject : p));
  } else {
    const newProj = { ...project, id: `proj-${Date.now()}`, createdAt: Date.now() } as PortfolioProject;
    memoryProjects.unshift(newProj);
  }

  if (!isFirebaseConfigured || !db) return true;
  try {
    if (project.id) {
      await updateDoc(doc(db, "portfolio", project.id), project);
    } else {
      await addDoc(collection(db, "portfolio"), { ...project, createdAt: Date.now() });
    }
    return true;
  } catch (err) {
    console.error("Firestore project save error:", err);
    return false;
  }
}

export async function deleteProjectData(id: string): Promise<boolean> {
  memoryProjects = memoryProjects.filter((p) => p.id !== id);
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
  if (!isFirebaseConfigured || !db) return memoryCompetencies;
  try {
    const q = query(collection(db, "competencies"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Competency));
    }
  } catch (err) {
    console.warn("Firestore competencies fetch error:", err);
  }
  return memoryCompetencies;
}

export async function saveCompetencyItem(item: Partial<Competency>): Promise<boolean> {
  if (item.id) {
    memoryCompetencies = memoryCompetencies.map((c) => (c.id === item.id ? { ...c, ...item } as Competency : c));
  } else {
    const newItem = { ...item, id: `comp-${Date.now()}`, order: memoryCompetencies.length + 1 } as Competency;
    memoryCompetencies.push(newItem);
  }

  if (!isFirebaseConfigured || !db) return true;
  try {
    if (item.id) {
      await updateDoc(doc(db, "competencies", item.id), item);
    } else {
      await addDoc(collection(db, "competencies"), item);
    }
    return true;
  } catch (err) {
    console.error("Firestore competency save error:", err);
    return false;
  }
}

export async function deleteCompetencyItem(id: string): Promise<boolean> {
  memoryCompetencies = memoryCompetencies.filter((c) => c.id !== id);
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
  if (!isFirebaseConfigured || !db) return memorySkills;
  try {
    const q = query(collection(db, "skills"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as SkillCategory));
    }
  } catch (err) {
    console.warn("Firestore skills fetch error:", err);
  }
  return memorySkills;
}

export async function saveSkillItem(item: Partial<SkillCategory>): Promise<boolean> {
  if (item.id) {
    memorySkills = memorySkills.map((s) => (s.id === item.id ? { ...s, ...item } as SkillCategory : s));
  } else {
    const newItem = { ...item, id: `skill-${Date.now()}`, order: memorySkills.length + 1 } as SkillCategory;
    memorySkills.push(newItem);
  }

  if (!isFirebaseConfigured || !db) return true;
  try {
    if (item.id) {
      await updateDoc(doc(db, "skills", item.id), item);
    } else {
      await addDoc(collection(db, "skills"), item);
    }
    return true;
  } catch (err) {
    console.error("Firestore skill save error:", err);
    return false;
  }
}

export async function deleteSkillItem(id: string): Promise<boolean> {
  memorySkills = memorySkills.filter((s) => s.id !== id);
  if (!isFirebaseConfigured || !db) return true;
  try {
    await deleteDoc(doc(db, "skills", id));
    return true;
  } catch (err) {
    console.error("Firestore skill delete error:", err);
    return false;
  }
}
