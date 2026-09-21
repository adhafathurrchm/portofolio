# AGENT.md — AI Agent Guidance & Project Context

Dokumen ini berisi panduan, instruksi, dan aturan teknis bagi **AI Coding Agent** yang bekerja di dalam repositori ini. Semua perubahan kode, penambahan fitur, dan perbaikan bug harus mematuhi petunjuk di dokumen ini.

---

## 1. Konteks Proyek & Dokumen Acuan

Proyek ini adalah **Situs Web Portofolio Personal & CV Interaktif dengan Admin CMS** berbasis **Next.js** dan **Firebase**.

* **Desain System**: Harus mengikuti aturan visual di **[design.md](file:///d:/Iseng/Portofolio/new/design.md)**.
* **Persyaratan Produk (PRD)**: Harus sesuai dengan fitur & alur kerja di **[prd.md](file:///d:/Iseng/Portofolio/new/prd.md)**.

---

## 2. Tech Stack & Dependencies Utama

* **Framework**: Next.js (App Router, React 19 / 18)
* **Bahasa**: TypeScript (`.ts`, `.tsx`)
* **Styling**: Tailwind CSS + CSS Variables (`globals.css`)
* **Database & BaaS**:
  * **Firebase Cloud Firestore**: Penyiapan & query data NoSQL.
  * **Firebase Authentication**: Login Admin (Email & Password).
  * **Firebase Storage**: Upload & simpan file media/foto profil/thumbnail.
* **Animasi**: `framer-motion` (smooth scroll, filter tab, modal pop-up, sidebar toggle).
* **Ikon**: `lucide-react` (line icons minimalis).
* **Typography**: `Poppins` (Bold Uppercase Headings) & `Montserrat` (Subheadings/Body).

---

## 3. Struktur Direktori Proyek

Selalu patuhi konvensi struktur folder berikut saat membuat file baru:

```
d:/Iseng/Portofolio/new/
├── app/
│   ├── (public)/              # Rute Halaman Publik Portofolio
│   │   ├── page.tsx           # Single Page App (Hero, About, Resume, Portfolio, Contact)
│   │   └── layout.tsx
│   ├── admin/                 # Rute Dashboard CMS Admin
│   │   ├── login/page.tsx     # Halaman Login Admin
│   │   ├── profile/page.tsx   # Manager Profil & Bio
│   │   ├── resume/page.tsx    # Manager Education, Experience, Organization, Award
│   │   ├── portfolio/page.tsx # Manager Portofolio & Upload Foto
│   │   ├── messages/page.tsx  # Inbox Pesan Kontak
│   │   ├── page.tsx           # Dashboard Overview
│   │   └── layout.tsx         # Layout Admin & Auth Guard
│   ├── layout.tsx             # Root Layout Next.js
│   └── globals.css            # Token CSS Variables & Base Styles
├── components/
│   ├── ui/                    # Komponen UI Dasar (Button, Modal, Card, Badge, Spinner)
│   ├── public/                # Komponen Publik (SidebarLeft, SidebarRight, Hero, About, MasonryGrid)
│   └── admin/                 # Komponen Admin (AdminSidebar, DataTable, FormEditor, ImageUploader)
├── lib/
│   ├── firebase.ts            # Inisialisasi Firebase App, Auth, Firestore, Storage
│   ├── firestore.ts           # Utility Helpers untuk CRUD Firestore
│   ├── auth-context.tsx       # Auth Context Provider & Protected Route Guard
│   └── utils.ts               # Helper gabungan classnames (clsx / tailwind-merge)
├── types/
│   └── index.ts               # TypeScript Interfaces (Profile, ResumeItem, Project, Message, etc.)
├── design.md                  # Acuan Desain UI/UX
├── prd.md                     # Acuan Persyaratan Produk
└── agent.md                   # Panduan AI Agent (Dokumen ini)
```

---

## 4. Aturan Pemrograman & Konvensi Kode (Coding Rules)

### 4.1 Next.js App Router & Server/Client Components
* Gunakan arahan `'use client';` secara eksplisit pada bagian atas file jika komponen menggunakan *hooks* (`useState`, `useEffect`), komponen `framer-motion`, atau fungsi Firebase real-time.
* Untuk komponen publik yang membutuhkan SEO (seperti metadata halaman utama), pertahankan sebagai Server Component atau sediakan fallback metadata yang kuat.

### 4.2 Firebase Guidelines
* File inisialisasi Firebase harus berada di `@/lib/firebase.ts` dan mengambil kredensial dari `.env.local`:
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...
  ```
* Buat fungsi helper CRUD Firestore terpusat di `@/lib/firestore.ts` (contoh: `getProfile()`, `updateProfile()`, `getResumeItems()`, `addPortfolioProject()`). Jangan menulis query Firestore secara acak di dalam komponen UI.

### 4.3 Design System & Styling Rules
* **Palet Warna**: Wajib mengacu ke CSS Variables di `globals.css`:
  * Yellow Primary: `#F5A623` / `#FDB022`
  * Black: `#111111`
  * White: `#FFFFFF`
  * Dark Gray: `#4A4A4A`
* **Visual Identity**:
  * Foto profil hero publik harus menggunakan filter **hitam-putih (grayscale)** secara default.
  * Kartu statistik ber-background hitam dengan teks angka besar berwarna kuning.
  * Gunakan **dashed border** (`border-dashed`) untuk garis pemisah section & indikator progres navigasi.
  * Tombol CTA utama menggunakan bentuk **pill shape** (`rounded-full`).

### 4.4 Auth Guard Halaman Admin
* Seluruh rute di bawah `/admin/*` (kecuali `/admin/login`) wajib dilindungi oleh Auth Guard (`AuthContext` / `ProtectedRoute`).
* Jika `user` tidak terautentikasi (`null`), otomatis redirect ke `/admin/login`.

---

## 5. Alur Kerja Implementasi AI Agent

1. **Persiapan**: Pastikan membaca [design.md](file:///d:/Iseng/Portofolio/new/design.md) dan [prd.md](file:///d:/Iseng/Portofolio/new/prd.md) sebelum membuat komponen baru.
2. **Verifikasi**: Setiap kali menambahkan kode baru, jalankan build/lint atau perintah verifikasi untuk memastikan tidak ada *type error* atau broken imports.
3. **Penyelarasan Tipe Data**: Selalu perbarui `@/types/index.ts` jika ada perubahan pada struktur Firestore Document.
