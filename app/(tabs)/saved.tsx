// app/(tabs)/saved.tsx
import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, View, ActivityIndicator, Text, FlatList, TouchableOpacity, RefreshControl 
} from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase';

// Gunakan fungsi service yang BARU
import { getUserCollections, Collection } from '../../services/bookmarkService';

const SavedPage = () => {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Cek user & load collections saat halaman dibuka
  useFocusEffect(
    useCallback(() => {
      checkUserAndLoad();
    }, [])
  );

  const checkUserAndLoad = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await loadCollections();
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await getUserCollections();
      setCollections(data);
    } catch (e) {
      console.error("Gagal load collection", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCollections();
  };

  const renderCollectionItem = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: item.id } })}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="folder" size={28} color="#FF4C4C" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.article_count} Artikel tersimpan</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: "My Collections",
          headerShown: true,
          headerShadowVisible: false,
        }} 
      />

      {!user ? (
        <View style={styles.center}>
          <Ionicons name="lock-closed-outline" size={50} color="#ccc" />
          <Text style={styles.message}>Silakan login untuk melihat koleksi.</Text>
        </View>
      ) : loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF4C4C" />
        </View>
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCollectionItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.message}>Belum ada koleksi.</Text>
              <Text style={styles.subMessage}>Simpan artikel untuk membuat koleksi baru.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

export default SavedPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  list: { padding: 20 },
  message: { fontSize: 16, color: '#666', marginTop: 10, textAlign: 'center' },
  subMessage: { fontSize: 14, color: '#999', marginTop: 5, textAlign: 'center' },
  
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 16, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  iconContainer: {
    width: 48, height: 48, backgroundColor: '#FFF0F0', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  cardSub: { fontSize: 12, color: '#888' },
});