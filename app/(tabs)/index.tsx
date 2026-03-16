// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, SafeAreaView, ScrollView, StatusBar, 
  ActivityIndicator, View, Text, TouchableOpacity 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import Supabase Client
import { supabase } from '@/utils/supabase';

import { SearchInput } from '../../components/SearchInput';
import { BreakingNewsCarousel } from '../../components/BreakingNewsCarousel';
import { NewsList } from '../../components/NewsList';
import { NewsItem, Category } from '../../types';
import { fetchTopNews } from '@/services/api';

const categories: Category[] = [
  { id: 'top', name: 'Top' },
  { id: 'crime', name: 'Crime' },
  { id: 'education', name: 'Education' },
  { id: 'food', name: 'Food' },
  { id: 'politics', name: 'Politics' },
];

const Page = () => {
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('top');

  // State untuk User Profile
  const [username, setUsername] = useState('Guest');
  const [initials, setInitials] = useState('G');

  useEffect(() => {
    loadNews(selectedCategory);
    fetchUserProfile();
  }, [selectedCategory]);

  // Logic untuk mengambil data user dari Supabase
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        // Ambil nama dari email (sebelum @)
        const nameFromEmail = user.email.split('@')[0];
        
        // Format nama (huruf pertama kapital)
        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
        
        // Ambil inisial
        const userInitial = formattedName.charAt(0).toUpperCase();

        setUsername(formattedName);
        setInitials(userInitial);
      }
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  const loadNews = async (category: string) => {
    setLoading(true);
    const data = await fetchTopNews(category);
    setNews(data);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    router.push({ pathname: '/search/[query]', params: { query }});
  };

  const handleArticlePress = (id: string) => {
    router.push({ pathname: '/article/[id]', params: { id }});
  };

  const handleCategoryChange = (id: string) => {
    if (id !== selectedCategory) {
        setSelectedCategory(id);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <Stack.Screen 
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          
          // Bagian KIRI: Avatar Inisial & Teks Dinamis
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              {/* Avatar diganti dengan View berisi Text Inisial */}
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>{username}</Text>
              </View>
            </View>
          ),

          // Bagian KANAN: Tombol Lonceng
          headerRight: () => (
            <TouchableOpacity style={styles.ghostButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{marginTop: 10}}> 
          <SearchInput onSearch={handleSearch} />
        </View>
        
        {loading && news.length === 0 ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF4C4C" />
            </View>
        ) : (
             <BreakingNewsCarousel 
                data={news} 
                onItemPress={handleArticlePress} 
             />
        )}
        
        <NewsList 
            categories={categories} 
            news={news} 
            onItemPress={handleArticlePress}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
        />
        
        {loading && news.length > 0 && (
             <ActivityIndicator style={{marginBottom: 20}} size="small" color="#FF4C4C" />
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { padding: 50, alignItems: 'center' },
  
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 0, 
    paddingBlock: 10,
    paddingInline: 20
  },
  // Style baru untuk Avatar Inisial
  avatarPlaceholder: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF4C4C', // Warna background avatar
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 10,
    color: '#666',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  ghostButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginRight: 0 
  },
});