// app/article/[id].tsx
import React, { useEffect, useState } from 'react';
import { 
  View, Text, Image, StyleSheet, ScrollView, 
  TouchableOpacity, SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import API Service
import { fetchNewsById } from '../../services/api';
import { NewsItem } from '../../types';

// Import Service Baru & Komponen
import { saveBookmarkToCollection } from '../../services/bookmarkService';
import { CollectionModal } from '../../components/CollectionModal';

// Import utility functions
import { 
  isValidArticleId, 
  formatArticleDate, 
  getArticleContent 
} from '../../utils/articleHelpers';

const ArticleDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk mengontrol visibilitas Modal Koleksi
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Fetch Data Artikel
  useEffect(() => {
    const initData = async () => {
      // Menggunakan util function untuk validasi ID
      if (isValidArticleId(id)) {
        setLoading(true);
        try {
          // Hanya fetch artikel, status bookmark tidak dicek di awal 
          // (karena logic collection lebih kompleks, bisa dicek nanti jika perlu)
          const fetchedArticle = await fetchNewsById(id);
          setArticle(fetchedArticle);
        } catch (error) {
          console.error("Error loading article:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    initData();
  }, [id]);

  // 2. Handler saat tombol Bookmark ditekan
  const handleBookmarkPress = () => {
    // Membuka modal untuk memilih koleksi
    setModalVisible(true);
  };

  // 3. Handler saat koleksi dipilih dari Modal
  const onCollectionSelected = async (collectionId: number) => {
    if (!article) return;

    try {
      await saveBookmarkToCollection(collectionId, article);
      setModalVisible(false);
      Alert.alert("Tersimpan", "Artikel berhasil disimpan ke dalam koleksi.");
    } catch (error: any) {
      // Error handling sederhana, bisa dipercantik
      console.error(error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan artikel.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF4C4C" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Artikel tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
           <Text style={styles.backLinkText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: "", 
          headerBackTitle: 'Kembali',
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleBookmarkPress} 
              style={{ marginRight: 10 }}
            >
              {/* Icon selalu outline karena status tersimpan ada di dalam koleksi */}
              <Ionicons 
                name="bookmark-outline" 
                size={24} 
                color="#FF4C4C" 
              />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: article.imageUrl }} style={styles.image} />
        
        <View style={styles.metaContainer}>
           <Text style={styles.category}>{article.category}</Text>
           <Text style={styles.date}>{formatArticleDate(article.date)}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.authorContainer}>
           <Ionicons name="person-circle" size={20} color="#666" />
           <Text style={styles.author}>{article.author || 'Unknown Author'}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.body}>
          {getArticleContent(article.content)}
        </Text>
      </ScrollView>

      {/* Modal Component ditempatkan di sini */}
      <CollectionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        onSelectCollection={onCollectionSelected}
      />

    </SafeAreaView>
  );
};

export default ArticleDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 40 },
  image: { width: '100%', height: 250, backgroundColor: '#eee' },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  category: { color: '#FF4C4C', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 },
  date: { color: '#999', fontSize: 12 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 10,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 5,
  },
  author: { color: '#666', fontWeight: '600' },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#444',
    paddingHorizontal: 20,
    textAlign: 'justify', 
  },
  errorText: { fontSize: 16, color: '#333', marginBottom: 8 },
  backLink: { padding: 8 },
  backLinkText: { color: '#007AFF', fontSize: 16, fontWeight: '500' }
});