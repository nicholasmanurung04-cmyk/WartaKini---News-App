// app/(tabs)/settings.tsx
import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, Image, TouchableOpacity, 
  FlatList, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/utils/supabase'; // Pastikan path ini benar
import { getUserCollections, Collection } from '../../services/bookmarkService';

const SettingsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProfileAndCollections();
    }, [])
  );

  const fetchProfileAndCollections = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const cols = await getUserCollections();
        setCollections(cols);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // 1. Eksekusi Sign Out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    
    // 2. HAPUS manual router.replace('/')
    // Biarkan Auth Guard di _layout.tsx yang bekerja otomatis.
    // Saat sesi hilang, _layout akan otomatis memindahkan user ke '/'
  };

  const renderCollectionItem = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={styles.collectionCard}
      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: item.id } })}
    >
      <View style={styles.folderIcon}>
        <Ionicons name="folder" size={24} color="#FF4C4C" />
      </View>
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionName}>{item.name}</Text>
        <Text style={styles.collectionMeta}>{item.article_count} Artikel</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <View>
          <Text style={styles.emailText}>{user?.email || "Guest"}</Text>
          <Text style={styles.subText}>News Reader Member</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={24} color="#FF4C4C" />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Collections</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#FF4C4C" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCollectionItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Belum ada koleksi.</Text>
          }
        />
      )}
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  profileHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  avatar: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#FF4C4C',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  emailText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  subText: { fontSize: 12, color: '#666' },
  logoutBtn: { marginLeft: 'auto', padding: 10 },
  
  sectionHeader: { padding: 20, paddingBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  listContent: { paddingHorizontal: 20 },
  collectionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 12, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  folderIcon: { 
    width: 40, height: 40, backgroundColor: '#ffe5e5', 
    borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  collectionInfo: { flex: 1 },
  collectionName: { fontSize: 16, fontWeight: '600', color: '#333' },
  collectionMeta: { fontSize: 12, color: '#999' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});