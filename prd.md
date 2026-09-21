# Product Requirement Document (PRD) — Personal Portfolio & Interactive CV with Admin CMS

**Project Name**: Personal Portfolio & Interactive CV Web Application  
**Version**: 1.0  
**Tech Stack Target**: Next.js (App Router), React, Tailwind CSS / Vanilla CSS Variables, Framer Motion, Firebase (Cloud Firestore, Firebase Auth, Firebase Storage)  
**Reference Document**: [design.md](file:///d:/Iseng/Portofolio/new/design.md)

---

## 1. Ringkasan & Tujuan Proyek

Proyek ini bertujuan untuk membangun sebuah **situs web portofolio personal & CV interaktif modern** berbasis **Next.js**, yang dilengkapi dengan **Halaman Admin (CMS)** mandiri berbasis **Firebase**.

### Tujuan Utama:
1. **Public Showcase**: Menampilkan profil profesional, riwayat pendidikan, pengalaman kerja, organisasi, penghargaan, portofolio karya, dan formulir kontak dengan desain yang presisi sesuai [design.md](file:///d:/Iseng/Portofolio/new/design.md).
2. **Admin Dashboard (CMS)**: Memungkinkan pemilik web (admin) untuk mengubah, menambah, menghapus, atau mengedit seluruh isi konten (profil, riwayat, organisasi, penghargaan, portofolio, pesan kontak) secara *real-time* melalui antarmuka web khusus tanpa harus mengubah kode program.
3. **UX & Performance**: Menyediakan transisi antarmuka yang halus (*smooth animation*), tampilan responsif di semua perangkat, serta optimasi SEO yang unggul.

---

## 2. Arsitektur & Teknologi

| Layer | Teknologi / Tool | Alasan Pemilihan |
|---|---|---|
| **Framework Main** | Next.js (App Router) | Full-stack React framework dengan Server Components, SSG/SSR untuk SEO, dan API Routes bawaan. |
| **Language** | TypeScript / JavaScript (ES6+) | Menjamin keandalan tipe data dan kerapian struktur kode. |
| **Styling System** | CSS Variables + Tailwind CSS / Vanilla CSS | Pengelolaan palet warna kustom (Kuning, Hitam, Putih) & utility class yang cepat dan fleksibel. |
| **Animation Engine** | Framer Motion | Untuk transisi menu sidebar, efek hover card, dan filter tab portofolio yang halus. |
| **Database (NoSQL)** | Firebase Cloud Firestore | Database NoSQL real-time cloud yang sangat cepat, handal, dan tanpa server management. |
| **Authentication** | Firebase Authentication | Sistem autentikasi admin bawaan (Email/Password & Session Persistence) yang aman dan siap pakai. |
| **File / Media Storage** | Firebase Storage | Penyimpanan cloud gratis & cepat untuk foto profil, hero image, & thumbnail karya portofolio. |
| **Iconography** | Lucide React | Line icons minimalis sesuai kebutuhan [design.md](file:///d:/Iseng/Portofolio/new/design.md). |
| **Typography** | `Poppins` & `Montserrat` (Google Fonts via `next/font`) | Heading sans-serif bold uppercase & body text profesional. |

---

## 3. Design System & Theme Mapping

Sesuai dengan acuan di [design.md](file:///d:/Iseng/Portofolio/new/design.md):

* **Color Palette Tokens**:
  * `--color-primary`: `#F5A623` (Yellow / Amber - Aksen utama, CTA, sidebar kanan, highlight)
  * `--color-dark`: `#111111` (Black - Frame foto hero, card statistik, background kontras)
  * `--color-white`: `#FFFFFF` (White - Background kanvas utama)
  * `--color-gray-light`: `#EAEAEA` (Light Gray - Background pemisah section)
  * `--color-gray-dark`: `#4A4A4A` (Dark Gray - Paragraf & body text)
* **Visual Style**:
  * Foto profil utama selalu berformat **hitam-putih (grayscale)** dengan aksen warna cerah.
  * Card statistik berwarna **hitam** dengan teks angka besar berwarna **kuning**.
  * Garis dekoratif menggunakan pola **dashed border** untuk pemisah & indikator navigasi.
  * Tombol CTA ber-style **pill shape (rounded-full)**.

---

## 4. Spesifikasi Fitur (Functional Requirements)

### 4.1 Halaman Publik (Public Website)

#### A. Dual-Sidebar Navigation System
* **Sidebar Kiri (Menu Teks Vertikal)**:
  * Foto profil bulat di bagian atas.
  * Daftar menu navigasi: *Home, About Me, Resume, Portfolio, Testimonials, Contact*.
  * Indikator section aktif berupa sorotan warna kuning & garis putus-putus (*progress line*).
* **Sidebar Kanan (Bar Ikon Vertikal)**:
  * Bar khusus berwarna kuning dengan ikon minimalis untuk *quick-jump* ke tiap section.

#### B. Home / Hero Section
* Sapaan ("HI THERE!") + Nama lengkap dengan highlight kata kunci berwarna kuning.
* Badge peran/posisi profesional (contoh: `GRAPHIC DESIGNER / PHOTOGRAPHER`).
* Deskripsi singkat & tombol CTA pill-shape *"MORE ABOUT ME"*.
* Foto profil hero hitam-putih ukuran besar di sisi kanan.

#### C. About Me Section
* Garis bingkai putus-putus dekoratif pada judul section.
* **4 Kartu Statistik Dynamic**: *Years Experience, Projects Done, Happy Clients, Followers* (Background hitam, angka kuning besar).
* List *"What I Do?"*: Kartu layanan/keahlian dengan ikon, judul, dan penjelasan ringkas.

#### D. Resume Section
* Layout 2 Kolom: **Education** & **Experience**.
* Kartu riwayat interaktif (Waktu, Gelar/Posisi, Nama Institusi/Perusahaan, Deskripsi singkat).

#### E. Portfolio Section
* **Tab Filter Kategori**: *All*, *Graphic Design*, *Web Design*, *Photography*, dll.
* **Responsive Masonry Grid**: Menampilkan thumbnail karya.
* **Modal Lightbox / Detail Project**: Mengklik kartu karya akan membuka pop-up berisi galeri foto detail, deskripsi proyek, teknologi yang digunakan, serta link live demo.

#### F. Testimonials Section
* Grid 2 kolom kartu testimoni ber-background gelap/terang.
* Komponen: Foto klien bulat, Nama, Rating bintang (kuning), & Kutipan testimoni.

#### G. Contact Section
* Informasi kontak langsung (Alamat, Telepon, Email, Social Media Icons).
* **Formulir Kontak Interaktif**: Input Nama, Email, Subjek, dan Pesan. Dikirim langsung ke database & inbox Admin.

---

### 4.2 Halaman Admin / CMS (`/admin`)

Halaman admin diproteksi oleh sistem autentikasi dan hanya bisa diakses oleh pemilik portofolio.

#### A. Authentikasi Admin (`/admin/login`)
* Form Login (Email/Username & Password).
* Proteksi rute middleware (menolak akses anonim ke rute `/admin/*`).

#### B. Admin Dashboard Overview (`/admin`)
* Rangkuman statistik singkat: Jumlah Proyek, Jumlah Pesan Masuk Baru, Total Testimoni.
* Quick Links untuk mengedit profil atau menambah proyek baru.

#### C. Profile & Bio Manager (`/admin/profile`)
* Form edit nama lengkap, kata kunci highlight, badge profesi, bio hero, & link sosial media.
* Upload/ganti foto profil & foto hero.

#### D. Statistic & Service Manager (`/admin/services`)
* Edit 4 angka kartu statistik (*Years Experience, Projects, Clients, Followers*).
* CRUD (Create, Read, Update, Delete) list keahlian *"What I Do"*.

#### E. Resume Manager (`/admin/resume`)
* CRUD data Pendidikan (*Education*) dan Pengalaman Kerja (*Experience*).
* Atur urutan kronologis / urutan tampil.

#### F. Portfolio Manager (`/admin/portfolio`)
* CRUD Proyek Portofolio.
* Input: Judul, Kategori/Tag, Image Thumbnail & Galeri, Deskripsi Proyek, Link Demo/Repository.

#### G. Testimonials Manager (`/admin/testimonials`)
* CRUD data Testimoni Klien.
* Toggle sakelar status (Tampilkan / Sembunyikan di web publik).

#### H. Message Inbox (`/admin/messages`)
* Daftar pesan yang dikirim oleh pengunjung melalui form kontak publik.
* Fitur tandai sudah dibaca / hapus pesan.

---

## 5. Model Data (Firebase Firestore Collections Blueprint)

Data disimpan dalam koleksi Firestore (*Cloud Firestore Documents*):

```typescript
// 1. Collection: "profile" (Doc ID: "main")
interface ProfileDocument {
  greeting: string;        // e.g. "HI THERE!"
  fullName: string;        // e.g. "BENJAMIN"
  highlightWords: string;  // Kata disorot kuning
  roleBadges: string[];    // e.g. ["GRAPHIC DESIGNER", "PHOTOGRAPHER"]
  bio: string;
  avatarUrl: string;
  heroImageUrl: string;
  stats: {
    yearsExp: number;
    projectsDone: number;
    happyClients: number;
    followers: number;
  };
}

// 2. Collection: "services"
interface ServiceDocument {
  id?: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

// 3. Collection: "resume" (Pendidikan, Pengalaman Kerja, Organisasi, Penghargaan)
interface ResumeDocument {
  id?: string;
  category: "EDUCATION" | "EXPERIENCE" | "ORGANIZATION" | "AWARD";
  title: string;          // Gelar / Jabatan / Nama Penghargaan
  subtitle: string;       // Universitas / Perusahaan / Penyelenggara
  period: string;         // e.g. "2020 - 2024"
  description: string;
  order: number;
}

// 4. Collection: "portfolio"
interface PortfolioProjectDocument {
  id?: string;
  title: string;
  category: string;       // e.g. "Web Design", "Graphic Design", "Photography"
  thumbnailUrl: string;
  images: string[];
  description: string;
  projectUrl?: string;
  repoUrl?: string;
  featured: boolean;
  createdAt: number;      // Timestamp
}

// 5. Collection: "testimonials"
interface TestimonialDocument {
  id?: string;
  clientName: string;
  clientRole?: string;
  avatarUrl?: string;
  rating: number;         // 1 - 5
  quote: string;
  isVisible: boolean;
}

// 6. Collection: "contact_messages"
interface ContactMessageDocument {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: number;      // Timestamp
}
```

---

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Responsif Multi-Device**: Tampilan menyesuaikan secara elegan dari layar HP (*mobile viewport*), Tablet, hingga Monitor Desktop lebar.
2. **SEO Optimization**:
   * Penggunaan Dynamic Metadata Next.js (Title, OpenGraph images, Twitter Card).
   * Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
3. **Animasi & Interaktivitas (Framer Motion)**:
   * Smooth scroll navigation antar section.
   * Micro-interactions pada tombol & kartu saat di-hover.
4. **Keamanan Admin**:
   * Password admin dienkripsi (*Bcrypt hashing*).
   * Middleware proteksi rute `/admin` & validasi input form (Zod validation).

---

## 7. Tahapan Implementasi Proyek (Roadmap)

- [ ] **Fase 1: Setup Proyek & Design System**
  - Setup Next.js (App Router) + Tailwind / CSS Variables dari [design.md](file:///d:/Iseng/Portofolio/new/design.md).
  - Penyiapan font Poppins/Montserrat & konfigurasi komponen dasar.
- [ ] **Fase 2: Layout & Komponen Publik**
  - Pembuatan dual-sidebar navigasi (kiri & kanan).
  - Pengembangan 6 section publik (*Hero, About, Resume, Portfolio, Testimonial, Contact*).
  - Integrasi Framer Motion untuk filter portfolio & animasi section.
- [ ] **Fase 3: Database & Auth Backend**
  - Setup ORM (Prisma / Supabase / SQLite) & pembuatan skema database.
  - Implementasi NextAuth untuk halaman login Admin.
- [ ] **Fase 4: Halaman Admin (CMS Dashboard)**
  - Pengembangan dashboard `/admin` & modul pengelola konten (Profile, Resume, Portfolio, Testimonials, Inbox).
  - Fitur simpan data real-time ke database.
- [ ] **Fase 5: Testing & Deployment**
  - Pengujian responsivitas & fungsi CRUD.
  - Deployment ke Vercel / Netlify.
