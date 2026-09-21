import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';

// 1. Baca variabel lingkungan dari .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=');
      process.env[key.trim()] = valParts.join('=').trim();
    }
  });
}

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!apiKey || !projectId || apiKey === 'your_api_key_here') {
  console.error('❌ EROOR: Kredensial Firebase belum diisi di file .env.local!');
  console.error('Silakan isi NEXT_PUBLIC_FIREBASE_API_KEY dan NEXT_PUBLIC_FIREBASE_PROJECT_ID terlebih dahulu.');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

console.log(`🚀 Mengisikan data awal ke Firebase Firestore untuk project: "${projectId}"...`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initial Data Blueprint
const initialProfile = {
  greeting: "HALO, SAYA",
  fullName: "Adha Dwi Fathur.r",
  highlightWords: "Fathur.r",
  roleBadges: ["MAHASISWA TEKNIK TELEKOMUNIKASI", "IOT & NETWORKING"],
  bio: "Saya adalah mahasiswa Teknik Telekomunikasi di Politeknik Negeri Semarang. Berhasrat tinggi dalam mengembangkan solusi teknologi inovatif dengan fokus kuat pada jaringan komputer, telekomunikasi, rekayasa perangkat keras IoT, dan transformasi digital.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  heroImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  stats: {
    yearsExp: 3,
    projectsDone: 25,
    happyClients: 20,
    followers: 850,
  },
  contactInfo: {
    email: "dfadha1923@gmail.com",
    phone: "",
    location: "Semarang, Jawa Tengah, Indonesia",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com/in/adha-dwi-fathurrochman-670a87297/",
    instagram: "https://www.instagram.com/adhafathurrchm.iwd/",
    twitter: "https://twitter.com",
  },
};

const initialServices = [
  {
    title: "Jaringan Komputer & Telekomunikasi",
    description: "Merancang, mengonfigurasi, dan memelihara jaringan komputer, protokol routing & switching, serta sistem telekomunikasi.",
    iconName: "Network",
    order: 1,
  },
  {
    title: "IoT & Rekayasa Perangkat Keras",
    description: "Merancang dan merakit perangkat IoT, pengkabelan mikrokontroler (ESP32/Arduino), dan sistem otomasi cerdas.",
    iconName: "Server",
    order: 2,
  },
  {
    title: "Lomba & Inovasi Teknologi",
    description: "Aktif mengikuti kompetisi tingkat nasional di bidang esai ilmiah, rekayasa IoT, jaringan komputer, dan inovasi teknologi.",
    iconName: "Award",
    order: 3,
  },
  {
    title: "Desain Grafis & Media Sosial",
    description: "Membuat konten grafis digital, promosi media sosial, spanduk, dan materi branding cetak.",
    iconName: "Layout",
    order: 4,
  },
];

const initialCompetencies = [
  {
    title: "Sertifikat Keahlian Network Technician & Cyber Security",
    issuer: "Diskominfo & LSK Teknologi",
    issueDate: "2024",
    category: "Networking",
    imageUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800",
    credentialUrl: "https://drive.google.com",
    description: "Sertifikat resmi kompetensi dalam konfigurasi perangkat jaringan, routing & switching, manajemen VLAN, IP subnetting, serta instalasi dan pengamanan infrastruktur jaringan komputer.",
    order: 1,
  },
  {
    title: "Sertifikat Keahlian IoT Engineering & Smart Automation",
    issuer: "Elektro Expo & POLIREVO",
    issueDate: "2024",
    category: "IoT & Embedded",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    credentialUrl: "https://drive.google.com",
    description: "Sertifikat kompetensi perakitan perangkat IoT, wiring mikrokontroler (ESP32/Arduino), komunikasi protokol MQTT, integrasi sensor cerdas, dan sistem otomasi.",
    order: 2,
  },
  {
    title: "Sertifikat Kompetensi Sistem Telekomunikasi & Fiber Optics",
    issuer: "Politeknik Negeri Semarang",
    issueDate: "2024",
    category: "Telecommunication",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    credentialUrl: "https://drive.google.com",
    description: "Sertifikat keahlian bidang sistem transmisi telekomunikasi, serat optik (splicing & pengukuran OTDR), serta prinsip kerja transmisi jaringan nirkabel.",
    order: 3,
  },
];

const initialResumeItems = [
  {
    category: "EDUCATION",
    title: "Politeknik Negeri Semarang",
    subtitle: "Mahasiswa Teknik Telekomunikasi",
    period: "2024 - Sekarang",
    description: "Mahasiswa D3/D4 Teknik Telekomunikasi. Aktif mengikuti kompetisi teknologi nasional dan organisasi mahasiswa/robotika.",
    order: 1,
  },
  {
    category: "EDUCATION",
    title: "SMK Negeri 2 Sragen",
    subtitle: "Pendidikan Menengah Kejuruan",
    period: "2021 - 2024",
    description: "Aktif dalam kepemimpinan OSIS dan kompetisi akademik kejuruan.",
    order: 2,
  },
  {
    category: "EXPERIENCE",
    title: "IoT Engineer",
    subtitle: "Office FO",
    period: "2023 - Sekarang",
    description: "Membantu perakitan perangkat keras IoT, mikrokontroler, dan wiring perangkat.",
    order: 1,
  },
  {
    category: "EXPERIENCE",
    title: "Teknisi Jaringan",
    subtitle: "Diskominfo Kab. Sragen",
    period: "Nov 2022 - Feb 2023",
    description: "Magang teknisi jaringan memelihara infrastruktur jaringan daerah dan peralatan server pemkab.",
    order: 2,
  },
  {
    category: "ORGANIZATION",
    title: "Ketua Umum",
    subtitle: "Keluarga Mahasiswa Sragen Polines (KMS)",
    period: "2024 - Sekarang",
    description: "Memimpin organisasi daerah mahasiswa Sragen di Politeknik Negeri Semarang.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400",
    order: 1,
  },
  {
    category: "AWARD",
    title: "Juara 1 — Video Iklan Layanan Masyarakat",
    subtitle: "Iklan Layanan Masyarakat Kab. Sragen 2024",
    period: "2024",
    description: "Meraih Juara 1 dalam kompetisi video Iklan Layanan Masyarakat.",
    imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=400",
    order: 1,
  },
];

const initialProjects = [
  {
    title: "Perakitan Perangkat Keras IoT & Otomasi Cerdas",
    category: "IOT",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    description: "Perakitan mikrokontroler IoT, wiring sensor, dan sistem otomasi cerdas untuk Office FO.",
    projectUrl: "https://adhafathur.my.id",
    featured: true,
    createdAt: Date.now() - 1000000,
  },
  {
    title: "Infrastruktur Jaringan & Pemeliharaan Server Diskominfo",
    category: "NETWORKING",
    thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
    description: "Konfigurasi router, VLAN, IP subnetting, dan troubleshooting teknisi jaringan.",
    projectUrl: "https://adhafathur.my.id",
    featured: true,
    createdAt: Date.now() - 2000000,
  },
  {
    title: "Proyek Desain Grafis & Media Promosi Digital",
    category: "OTHER",
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    description: "Spanduk promosi digital, materi pemasaran media sosial, dan desain branding.",
    projectUrl: "https://adhafathur.my.id",
    featured: true,
    createdAt: Date.now() - 3000000,
  },
];

async function seedData() {
  try {
    // 1. Seed Profile
    console.log('📌 Writing profile/main...');
    await setDoc(doc(db, 'profile', 'main'), initialProfile, { merge: true });

    // 2. Seed Services
    console.log('📌 Writing services...');
    for (const serv of initialServices) {
      await addDoc(collection(db, 'services'), serv);
    }

    // 3. Seed Competencies
    console.log('📌 Writing competencies...');
    for (const comp of initialCompetencies) {
      await addDoc(collection(db, 'competencies'), comp);
    }

    // 4. Seed Resume
    console.log('📌 Writing resume items...');
    for (const item of initialResumeItems) {
      await addDoc(collection(db, 'resume'), item);
    }

    // 5. Seed Portfolio
    console.log('📌 Writing portfolio projects...');
    for (const proj of initialProjects) {
      await addDoc(collection(db, 'portfolio'), proj);
    }

    console.log('✅ BERHASIL! Seluruh data awal portofolio telah di-seed ke Cloud Firestore.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal melakukan seeding ke Firestore:', err);
    process.exit(1);
  }
}

seedData();
