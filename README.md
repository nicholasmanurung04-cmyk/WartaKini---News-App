# NewsApp — Mobile News Reader App

![Expo Router](https://img.shields.io/badge/Expo_Router-6.x-1C1E24?style=flat&logo=expo)
![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**WartaKini-NewsApp** adalah aplikasi mobile pembaca berita berbasis **React Native + Expo** dengan **TypeScript** dan **Supabase** sebagai backend. Aplikasi ini memungkinkan pengguna untuk membaca berita terkini dari Indonesia, menyimpan artikel favorit, membuat koleksi, dan mencari berita dengan berbagai kategori.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Fitur Berdasarkan Status Login](#-fitur-berdasarkan-status-login)
- [Screenshot](#-screenshot)
- [Struktur Database](#-struktur-database)
- [Penggunaan](#-penggunaan)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)
- [Tim Pengembang](#-tim-pengembang)

---

## ✨ Fitur Utama

### Fitur Utama
- ✅ **Browse Berita** — Berita terkini dari Indonesia dengan kategori lengkap
- ✅ **Kategori Berita** — Filter berita berdasarkan kategori (Top, Crime, Education, Food, Politics)
- ✅ **Pencarian Berita** — Search berita dengan keyword
- ✅ **Detail Artikel** — Baca artikel lengkap dengan gambar dan konten
- ✅ **Breaking News Carousel** — Highlight berita utama dengan carousel
- ✅ **Bookmark Artikel** — Simpan artikel favorit untuk dibaca nanti
- ✅ **Koleksi Artikel** — Buat koleksi personal untuk mengorganisir artikel
- ✅ **Autentikasi Pengguna** — Login dengan Supabase Auth
- ✅ **Responsive Design** — Optimized untuk Android dan iOS

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React Native 0.81.5
- **Navigation:** Expo Router 6.0 (file-based routing)
- **Language:** TypeScript 5.9 (strict mode)
- **State Management:** React Hooks + AsyncStorage
- **Icons:** Expo Vector Icons (Ionicons)
- **Image Handling:** React Native built-in Image component
- **Build Tool:** Expo SDK 54

### Backend & APIs
- **Authentication:** Supabase Auth (email/password)
- **Database:** Supabase PostgreSQL (untuk bookmarks dan collections)
- **News API:** NewsData.io API
- **Storage:** AsyncStorage untuk offline bookmarks

### Libraries & Utilities
- **HTTP Client:** Axios 1.7.4
- **Async Storage:** `@react-native-async-storage/async-storage` 2.2.0
- **Supabase Client:** `@supabase/supabase-js` 2.86.2
- **Date Handling:** Moment.js 2.30.1
- **Gradient:** `expo-linear-gradient` 15.0.7
- **Gesture Handler:** `react-native-gesture-handler` 2.28.0
- **Safe Area:** `react-native-safe-area-context` 5.6.2

### Tooling
- **TypeScript:** Strict mode enabled
- **ESLint:** Basic React Native config
- **Prettier:** Code formatting (via .prettierrc)
- **Git:** Version control

---

## 📦 Persyaratan Sistem

### Software Requirements
- **Node.js:** v18.x atau lebih baru (disarankan v20.x)
- **npm:** v9.x atau lebih baru (included dengan Node.js)
- **Expo CLI:** Tidak perlu install global, gunakan `npx expo`
- **Git:** Untuk clone repository

### Device Requirements
- **Android:** Expo Go app (download dari Google Play Store)
- **iOS:** Expo Go app (download dari App Store) — memerlukan macOS untuk build production
- **Physical Device:** Disarankan untuk testing yang optimal

### Akun yang Dibutuhkan
- **Supabase Account:** Gratis di [supabase.com](https://supabase.com)
- **NewsData.io Account:** Untuk API key berita (gratis tier tersedia)
- **Expo Account:** (Opsional) untuk deployment EAS Build

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
# Clone repository dari GitHub
git clone https://github.com/aidilsaputrakirsan-classroom/final-project-mobile-programming-news-app.git

# Masuk ke folder project
cd final-project-mobile-programming-news-app
```

### 2. Install Dependencies

```bash
# Install semua dependencies
npm install
```

**Catatan:** Jika ada warning peer dependencies, itu normal dan tidak masalah.

### 3. Verifikasi Instalasi

```bash
# Cek apakah semua dependencies terinstall dengan benar
npm ls --depth=0

# Cek TypeScript tidak ada error
npx tsc --noEmit
```

---

## ⚙️ Konfigurasi

### 1. Environment Variables

Buat file `.env` di root folder project dengan isi sebagai berikut:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key-here

# News API Configuration
EXPO_PUBLIC_NEWSDATA_API_KEY=your-newsdata-api-key-here
```

**Cara mendapatkan credentials:**

#### Supabase:
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Pilih project atau buat project baru
3. Buka **Settings** → **API**
4. Copy **Project URL** dan **anon public key**

#### NewsData.io:
1. Daftar di [NewsData.io](https://newsdata.io)
2. Buka **API Keys** section
3. Copy API key Anda

### 2. Setup Database (Supabase)

#### Opsi A: Menggunakan Supabase Studio (Recommended)

1. Buka Supabase Dashboard → **SQL Editor**
2. Jalankan script berikut secara berurutan:

**a. Create Tables**
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  pub_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Collections table
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collection Items table
CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  article_id TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  pub_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**b. Create Indexes**
```sql
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collection_items_collection ON collection_items(collection_id);
```

**c. Setup Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Collections policies
CREATE POLICY "Users can view own collections" ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own collections" ON collections FOR ALL USING (auth.uid() = user_id);

-- Collection items policies
CREATE POLICY "Users can view own collection items" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_items.collection_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own collection items" ON collection_items FOR ALL USING (
  EXISTS (SELECT 1 FROM collections WHERE id = collection_items.collection_id AND user_id = auth.uid())
);
```

### 3. Seed Data (Opsional)

Untuk testing, jalankan script insert sample data:

```sql
-- Insert sample user (akan dibuat otomatis saat register)
-- Bookmarks dan collections akan dibuat melalui aplikasi
```

---

## 🔐 Fitur Berdasarkan Status Login

| Fitur | Guest User | Logged In User |
|-------|------------|----------------|
| **Browse Berita** | ✅ | ✅ |
| **Baca Detail Artikel** | ✅ | ✅ |
| **Pencarian Berita** | ✅ | ✅ |
| **Filter Kategori** | ✅ | ✅ |
| **Bookmark Artikel** | ❌ | ✅ |
| **Lihat Bookmarks** | ❌ | ✅ |
| **Buat Koleksi** | ❌ | ✅ |
| **Kelola Koleksi** | ❌ | ✅ |
| **Tambah ke Koleksi** | ❌ | ✅ |
| **Profile & Settings** | ✅ | ✅ |

> Keterangan: ✅ fitur tersedia, ❌ tidak tersedia untuk user yang belum login.

---

## 📸 Screenshot

### Main Features

#### 1. Landing Page (sign in & sign up)
<div style="display: flex; gap: 10px;">
  <img src="dokumentasi/img/LandingPage.jpeg" width="200" alt="Home Screen" />
  <img src="dokumentasi/img/Sign-In.jpeg" width="200" alt="Breaking News Carousel" />
   <img src="dokumentasi/img/Sign-up.jpeg" width="200" alt="Breaking News Carousel" />
</div>

#### 2.Home Screen & Breaking News
<div style="display: flex; gap: 10px;">
  <img src="dokumentasi/img/homepage.jpeg" width="200" alt="Home Screen" />
</div>

**Home Screen** — Welcome message dengan avatar user, search bar, breaking news carousel  
**Breaking News Carousel** — Highlight berita utama dengan swipe gesture


#### 3. News Categories & Article Detail
<div style="display: flex; gap: 10px;">
  <img src="dokumentasi/img/category.jpeg" width="200" alt="News Categories" />
  <img src="dokumentasi/img/ArticlePage.jpeg" width="200" alt="Article Detail" />
</div>

**News Categories** — Filter berita berdasarkan kategori  
**Article Detail** — Full article content dengan bookmark option



#### 4. Collections Management
<div style="display: flex; gap: 10px;">
  <img src="dokumentasi/img/collection.jpeg" width="200" alt="Collections List" />
  <img src="dokumentasi/img/collection-detail.jpeg" width="200" alt="Collection Detail" />
</div>

**Collections List** — Daftar koleksi yang dibuat user  
**Collection Detail** — Artikel dalam koleksi tertentu

#### 5. User Profile & Settings
<div style="display: flex; gap: 10px;">
  <img src="dokumentasi/img/SettingsPage.jpeg" width="200" alt="User Profile" />

</div>

**User Profile** — Informasi user dengan avatar inisial  
**Settings** — Pengaturan aplikasi dan logout

---

## 🗄 Struktur Database

### Entity Relationship Diagram

```
users (Supabase Auth Extended)
├── id (UUID, FK to auth.users)
├── full_name (TEXT)
├── email (TEXT, UNIQUE)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

bookmarks
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── article_id (TEXT)
├── title (TEXT)
├── image_url (TEXT)
├── pub_date (TEXT)
└── created_at (TIMESTAMPTZ)

collections
├── id (UUID, PK)
├── user_id (UUID, FK to users)
├── name (TEXT)
├── description (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

collection_items
├── id (UUID, PK)
├── collection_id (UUID, FK to collections)
├── article_id (TEXT)
├── title (TEXT)
├── image_url (TEXT)
├── pub_date (TEXT)
└── created_at (TIMESTAMPTZ)
```

### Tabel Utama

#### 1. **users**
Extends `auth.users` dari Supabase Auth.
```sql
id UUID PRIMARY KEY (FK to auth.users)
full_name TEXT
email TEXT UNIQUE
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### 2. **bookmarks**
Penyimpanan artikel favorit user.
```sql
id UUID PRIMARY KEY
user_id UUID (FK to users)
article_id TEXT
title TEXT
image_url TEXT
pub_date TEXT
created_at TIMESTAMPTZ
UNIQUE(user_id, article_id)
```

#### 3. **collections**
Koleksi artikel yang dibuat user.
```sql
id UUID PRIMARY KEY
user_id UUID (FK to users)
name TEXT
description TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

#### 4. **collection_items**
Artikel dalam koleksi.
```sql
id UUID PRIMARY KEY
collection_id UUID (FK to collections)
article_id TEXT
title TEXT
image_url TEXT
pub_date TEXT
created_at TIMESTAMPTZ
```

---

## 🎮 Penggunaan

### 1. Jalankan Aplikasi

```bash
# Jalankan Expo development server
npx expo start
```

### 2. Scan QR Code

- **Android:** Buka **Expo Go** → Scan QR Code
- **iOS:** Buka **Camera** → Scan QR Code → Open in Expo Go

### 3. Eksplorasi Fitur

**Mode Guest:**
1. Browse berita di home screen
2. Filter berdasarkan kategori
3. Search berita dengan keyword
4. Baca artikel detail

**Mode Logged In:**
1. Login dengan email/password
2. Bookmark artikel favorit
3. Buat koleksi personal
4. Kelola bookmarks dan collections
5. Logout dari aplikasi

### 4. Testing Flow

- **Browse News:** Swipe carousel, tap kategori, scroll news list
- **Search:** Tap search bar, input keyword, view results
- **Article Detail:** Tap article, read content, bookmark if logged in
- **Collections:** Create collection, add articles, view collection details
- **Offline:** Bookmarks tersimpan di device storage

---

## 🧪 Testing

### Manual Testing

```bash
# Lint check
npm run lint

# TypeScript type check
npx tsc --noEmit
```

### Testing Checklist

- [ ] **News Browsing:**
  - [ ] Breaking news carousel loads and swipeable
  - [ ] Category filter works correctly
  - [ ] News list pagination (if implemented)
  - [ ] Article detail opens correctly

- [ ] **Search:**
  - [ ] Search input accepts text input
  - [ ] Search results display correctly
  - [ ] Empty state when no results

- [ ] **Authentication:**
  - [ ] Login with valid credentials
  - [ ] Register new account
  - [ ] Session persistence after restart
  - [ ] Logout clears session

- [ ] **Bookmarks:**
  - [ ] Bookmark button toggles state
  - [ ] Bookmarks persist after app restart
  - [ ] Bookmarks list displays correctly

- [ ] **Collections:**
  - [ ] Create new collection
  - [ ] Add articles to collection
  - [ ] View collection details
  - [ ] Delete collection

- [ ] **UI/UX:**
  - [ ] Responsive on different screen sizes
  - [ ] Loading states display properly
  - [ ] Error handling for network issues
  - [ ] Offline functionality works

### Known Issues

- **API Rate Limits:** NewsData.io free tier has request limits
- **Image Loading:** Some articles may not have images
- **Offline Sync:** Bookmarks sync only when online
- **iOS Permissions:** May require additional permissions for some features

---

## 🚀 Deployment

### Development (Expo Go)

Aplikasi sudah bisa diakses via Expo Go setelah `npx expo start`.

### Production Build

#### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Login ke Expo Account

```bash
eas login
```

#### 3. Configure EAS

```bash
eas build:configure
```

#### 4. Build for Android

```bash
# Build APK untuk testing
eas build --platform android --profile preview

# Build AAB untuk Google Play Store
eas build --platform android --profile production
```

#### 5. Build for iOS (Requires macOS)

```bash
# Build untuk TestFlight
eas build --platform ios --profile production
```

#### 6. Environment Variables untuk Production

Buat file `eas.json` di root folder:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your-production-url",
        "EXPO_PUBLIC_SUPABASE_KEY": "your-production-key",
        "EXPO_PUBLIC_NEWSDATA_API_KEY": "your-production-api-key"
      }
    }
  }
}
```

**Dokumentasi Lengkap:** [Expo EAS Build](https://docs.expo.dev/build/introduction/)

---

## 🤝 Kontribusi

Kami menerima kontribusi dari siapa saja! Berikut panduan kontribusi:

### 1. Fork Repository

Klik tombol **Fork** di GitHub.

### 2. Clone Fork Anda

```bash
git clone https://github.com/your-username/final-project-mobile-programming-news-app.git
cd final-project-mobile-programming-news-app
```

### 3. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur-anda
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: tambah fitur xyz"
```

**Commit Message Convention:**
- `feat:` — Fitur baru
- `fix:` — Bug fix
- `docs:` — Update dokumentasi
- `style:` — Format code
- `refactor:` — Refactor code
- `test:` — Tambah test
- `chore:` — Update dependencies

### 5. Push ke Fork

```bash
git push origin feature/nama-fitur-anda
```

### 6. Buat Pull Request

Buka GitHub → Klik **New Pull Request** → Pilih branch Anda.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

```
MIT License

Copyright (c) 2025 NewsApp Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Tim Pengembang

**WartaKini-NewsApp** dikembangkan oleh mahasiswa Program Studi Sistem Informasi sebagai Final Project Mobile Programming.

### Acknowledgments

- **Dosen Pembimbing:** Aidil Saputra Kirsan
- **Expo Team** — Untuk framework yang powerful
- **Supabase Team** — Untuk BaaS platform
- **NewsData.io** — Untuk news API
- **React Native Community** — Untuk libraries dan tools

---

**Made with ❤️ by WartaKini-NewsApp Team**  
**© 2025 NewsApp. All rights reserved.**
