# Design System — Personal Portfolio / Resume Template

Dokumentasi ini diekstrak dari referensi UI (template presentasi/portofolio bergaya CV interaktif dengan tema hitam-kuning).

---

## 1. Konsep Umum
- **Gaya**: Modern, bold, minimalis dengan aksen warna kuning/oranye sebagai identitas.
- **Tipe konten**: Personal portfolio / CV interaktif (cocok untuk PPT, landing page, atau web portfolio).
- **Nuansa**: Profesional tapi playful, foto hitam-putih dikombinasikan dengan aksen warna cerah.

---

## 2. Color Palette

| Nama | Hex (perkiraan) | Penggunaan |
|---|---|---|
| Yellow/Amber (Primary) | `#F5A623` – `#FDB022` | Aksen utama, tombol CTA, sidebar kiri, highlight teks |
| Black | `#111111` | Background foto, card statistik, teks judul besar |
| White | `#FFFFFF` | Background konten utama |
| Light Gray | `#EAEAEA` – `#D9D9D9` | Background halaman/section pemisah |
| Dark Gray (teks body) | `#4A4A4A` | Paragraf deskripsi |

**Pola pemakaian warna**: 3 warna dominan per halaman — Putih (kanvas), Hitam (kontras/foto/kartu statistik), Kuning (aksen & CTA). Tidak lebih dari itu supaya tetap clean.

---

## 3. Typography
- **Heading (H1/H2)**: Sans-serif tebal, uppercase, ukuran besar (mis. "ABOUT ME", "PORTFOLIO", "RESUME"). Kesan: Poppins Bold / Montserrat ExtraBold.
- **Sub-heading / Nama**: Bold, warna hitam dengan kata kunci di-highlight kuning (contoh: "I'M **BENJAMIN**").
- **Body text**: Sans-serif regular, abu-abu gelap, ukuran kecil-menengah, line-height longgar.
- **Label kecil (tag/kategori)**: Uppercase, letter-spacing lebar, kadang di dalam badge kuning (contoh: "GRAPHIC DESIGNER / PHOTOGRAPHER").

---

## 4. Layout Structure

### 4.1 Navigasi
- **Sidebar ikon vertikal** di sisi kanan tiap halaman (background kuning), berisi ikon: Home, About, Portfolio/Briefcase, Chart, Megaphone, Send/Contact.
- **Menu teks vertikal** di sisi kiri (pada halaman dalam), dengan foto profil bulat di atasnya, list menu: Home, About Me, Resume, Portfolio, Testimonials, Contact — item aktif berwarna kuning, ditandai garis putus-putus vertikal sebagai indikator progres.

### 4.2 Grid & Spacing
- Konten utama menggunakan **grid 2 kolom** pada halaman landing (teks kiri, foto kanan).
- Halaman dalam menggunakan **grid 3 kolom**: sidebar foto/menu (kiri, sempit) — konten utama (tengah, lebar) — sidebar ikon (kanan, sempit).
- Statistik ditampilkan dalam **card hitam grid 2x2**, angka besar kuning + label putih kecil di bawahnya.

---

## 5. Komponen per Section

### Home / Hero
- Sapaan kecil ("HI THERE!") + nama besar dengan kata kunci disorot kuning.
- Badge peran/jabatan (background kuning, teks hitam).
- Paragraf singkat deskripsi diri.
- Tombol CTA pill-shape kuning ("MORE ABOUT ME").
- Foto profil hitam-putih besar mengisi sisi kanan.

### About Me
- Judul besar + garis kotak putus-putus dekoratif.
- Intro singkat nama & profesi.
- **4 kartu statistik** (Years Experience, Projects Done, Happy Clients, Followers) — background hitam, angka kuning besar.
- List "What I Do?" dengan ikon kecil + judul + deskripsi singkat (Print Design, Web Design, Photography, dst).

### Resume
- Dua kolom: **Education** & **Experience**, masing-masing berupa list card ringkas (judul posisi/institusi, waktu, deskripsi singkat).

### Portfolio
- Filter tab kategori: **All / Graphic Design / Web Design / Photography** (tab aktif berwarna kuning).
- Grid gambar/thumbnail 2x2 atau 2x3, gaya masonry sederhana, tiap item bisa berupa foto/ilustrasi/mockup.

### Testimonials
- Card gelap berjajar (2 kolom), tiap card: foto klien bulat kecil, nama, rating bintang kuning, kutipan testimoni singkat.

### Contact
- List info kontak dengan ikon (alamat, telepon, email/website) + catatan penutup kecil ("Thanks for patience!").

---

## 6. UI Elements & Style Notes
- **Sudut**: Elemen umumnya siku (sharp corner) untuk card & foto; tombol CTA menggunakan **pill/rounded shape**.
- **Ikon**: Line icon minimalis, konsisten satu gaya di seluruh sidebar.
- **Foto**: Selalu diproses hitam-putih (grayscale) untuk foto profil/hero, kontras dengan elemen kuning.
- **Garis dekoratif**: Garis putus-putus (dashed) dipakai sebagai pemisah/indikator progres menu dan bingkai judul section.
- **Konsistensi**: Header/sidebar (foto + menu + ikon) berulang identik di semua halaman dalam — hanya konten tengah yang berubah per section.

---

## 7. Rekomendasi Implementasi (jika dijadikan Web/HTML)
- Gunakan CSS variable untuk palet warna di atas agar konsisten.
- Font: `Poppins` atau `Montserrat` dari Google Fonts (weight 700–800 untuk heading, 400 untuk body).
- Layout sidebar bisa dibuat `position: sticky` agar menu & ikon tetap terlihat saat scroll antar section.
- Grid portfolio & testimonial bisa memakai CSS Grid dengan `grid-template-columns: repeat(2, 1fr)`.
