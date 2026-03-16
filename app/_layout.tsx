// app/_layout.tsx
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Ubah Slot menjadi Stack
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase'; // Pastikan path ini sesuai file supabase Anda (bisa @/lib/supabase)
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Cek sesi saat aplikasi dibuka
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Cek apakah user sedang berada di halaman Auth (Login/Register)
    const inAuthGroup = segments[0] === '(auth)' || segments.length === 0;

    if (session && inAuthGroup) {
      // Hanya redirect ke tabs JIKA user masih di halaman login
      router.replace('/(tabs)');
    } else if (!session && !inAuthGroup) {
      // Jika tidak ada sesi dan user mencoba akses halaman dalam, tendang ke login
      router.replace('/'); 
    }
  }, [session, initialized, segments]);

  // Tampilkan loading screen sampai status auth jelas
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4C4C" />
      </View>
    );
  }

  // GANTI <Slot /> DENGAN <Stack>
  return (
    <Stack>
      {/* 1. Halaman Login/Welcome: Sembunyikan Header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* 2. Halaman Utama (Tabs): Sembunyikan Header (karena tabs punya header sendiri) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 3. Halaman Detail Artikel: Tampilkan Header agar tombol Bookmark muncul */}
      <Stack.Screen 
        name="article/[id]" 
        options={{ 
          headerShown: true, 
          title: '', // Judul dikosongkan agar rapi
          headerBackTitle: 'Back' 
        }} 
      />
      
      {/* 4. Halaman Detail Koleksi */}
      <Stack.Screen 
        name="collection/[id]" 
        options={{ 
          headerShown: true, 
          title: 'Collection Detail' 
        }} 
      />

      {/* 5. Halaman Pencarian (Opsional jika ada) */}
      <Stack.Screen 
        name="search/[query]" 
        options={{ 
          headerShown: true, 
          title: 'Search Results' 
        }} 
      />
    </Stack>
  );
}