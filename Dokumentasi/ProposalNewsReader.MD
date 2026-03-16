# 📱 **Proposal Aplikasi – WartaKini (Mobile News Reader App)**

## 1. Deskripsi Aplikasi

**WartaKini** adalah aplikasi mobile pembaca berita yang menyediakan informasi terkini dari berbagai kategori di Indonesia. Aplikasi ini dibangun menggunakan **React Native + Expo**, menggunakan **Supabase** sebagai backend, serta integrasi API berita dari **NewsData.io**.

WartaKini dirancang untuk memberikan pengalaman membaca berita yang cepat, modern, dan personal. Pengguna dapat membaca berita terbaru, mencari artikel, menyimpan berita sebagai bookmark, serta membuat koleksi berita sesuai preferensi mereka. Aplikasi mendukung dua mode penggunaan: **Guest** dan **Logged-In User**, dengan fitur lengkap untuk pengguna yang melakukan login.

---

## 2. Target User

Aplikasi WartaKini ditargetkan untuk:

1. **Mahasiswa/Pelajar**  
   Membutuhkan sumber berita cepat dan kredibel untuk tugas, diskusi, atau referensi.

2. **Pekerja Profesional**  
   Butuh update berita politik, ekonomi, teknologi, dan isu terbaru secara cepat.

3. **Pembaca Umum**  
   Masyarakat yang ingin ringkasan berita harian dengan tampilan yang nyaman dan modern.

4. **Pengguna yang butuh personalisasi**  
   Sesuai fitur koleksi dan bookmark, pengguna dapat mengatur berita sesuai preferensi.

---

## 3. Fitur-Fitur Utama

### 🔹 Fitur untuk Guest (Tanpa Login)
- Membaca berita utama  
- Melihat breaking news carousel  
- Mencari berita berdasarkan keyword  
- Filter berita berdasarkan kategori  
- Membaca detail artikel  

### 🔹 Fitur untuk Logged-In User
- Semua fitur Guest  
- Bookmark artikel  
- Melihat daftar bookmark  
- Membuat dan mengelola koleksi artikel  
- Menambahkan artikel ke koleksi  
- Melihat dan mengatur profil  
- Logout  

### 🔹 Fitur Teknis
- Desain responsif untuk Android & iOS  
- Autentikasi menggunakan Supabase Auth  
- Penyimpanan offline untuk bookmarks  
- Konten berita lengkap dengan gambar & tanggal  
- Carousel berita utama penarik perhatian  

---

## 4. User Flow Diagram

```mermaid
flowchart TD

A[Open App] --> B{Logged In?}

B -->|No| C[Home Screen - Guest]
B -->|Yes| D[Home Screen - User]

%% Guest Flow
C --> C1[Browse News]
C --> C2[Search News]
C --> C3[Filter by Category]
C --> C4[Read Article Detail]
C4 --> C5[Prompt Login for Bookmark]

%% Login
C --> L[Login/Register]
L --> D

%% User Flow
D --> D1[Browse News]
D --> D2[Search News]
D --> D3[Filter by Category]
D --> D4[Read Article Detail]
D4 --> D5[Bookmark Article]
D4 --> D6[Add to Collection]

%% Collections
D --> E[Collections List]
E --> E1[Create New Collection]
E --> E2[View Collection Detail]
E2 --> E3[Manage Collection Items]

%% Profile
D --> F[Profile & Settings]
F --> F1[Logout]
F1 --> C
