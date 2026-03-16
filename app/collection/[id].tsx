// app/collection/[id].tsx
import React, { useEffect, useState } from 'react';
import { 
  View, StyleSheet, ActivityIndicator, Alert, 
  Modal, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { NewsList } from '../../components/NewsList';
// 1. Tambahkan import getCollectionDetails
import { 
  getBookmarksByCollection, 
  deleteCollection, 
  updateCollectionName,
  getCollectionDetails 
} from '../../services/bookmarkService';
import { NewsItem } from '../../types';

const CollectionDetail = () => {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Inisialisasi awal tetap mencoba pakai params, tapi nanti akan di-update oleh fetchNews
  const [collectionName, setCollectionName] = useState(Array.isArray(name) ? name[0] : name || 'Collection');
  
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');

  const collectionId = Number(id);

  useEffect(() => {
    if (id) fetchNews();
  }, [id]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      // 2. Fetch Artikel DAN Detail Koleksi (Nama) secara paralel agar cepat
      const [bookmarksData, collectionData] = await Promise.all([
        getBookmarksByCollection(collectionId),
        getCollectionDetails(collectionId)
      ]);

      setNews(bookmarksData);
      
      // 3. Update nama koleksi dari hasil database
      if (collectionData) {
        setCollectionName(collectionData.name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePressDelete = () => {
    Alert.alert(
      "Hapus Koleksi",
      "Apakah Anda yakin? Semua artikel di dalam koleksi ini akan ikut terhapus.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: performDelete }
      ]
    );
  };

  const performDelete = async () => {
    try {
      await deleteCollection(collectionId);
      Alert.alert("Sukses", "Koleksi berhasil dihapus");
      router.replace('/(tabs)/saved'); 
    } catch (e: any) {
      Alert.alert("Error", "Gagal menghapus: " + e.message);
    }
  };

  const openRenameModal = () => {
    setTempName(collectionName);
    setRenameModalVisible(true);
  };

  const performRename = async () => {
    if (!tempName.trim()) return;
    
    try {
      await updateCollectionName(collectionId, tempName);
      setCollectionName(tempName);
      setRenameModalVisible(false);
    } catch (e: any) {
      Alert.alert("Error", "Gagal mengganti nama: " + e.message);
    }
  };

  const showOptions = () => {
    Alert.alert(
      "Pengaturan Koleksi",
      "Pilih aksi untuk koleksi ini",
      [
        { text: "Ubah Nama", onPress: openRenameModal },
        { text: "Hapus Koleksi", onPress: handlePressDelete, style: 'destructive' },
        { text: "Batal", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: collectionName, // Judul sekarang akan terupdate otomatis setelah loading selesai
          headerBackTitle: 'Back',
          headerRight: () => (
            <TouchableOpacity onPress={showOptions} style={{ padding: 5 }}>
              <Ionicons name="ellipsis-horizontal-circle" size={26} color="#FF4C4C" />
            </TouchableOpacity>
          )
        }} 
      />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF4C4C" />
        </View>
      ) : (
        <NewsList 
          news={news}
          categories={[]}
          onItemPress={(articleId) => router.push(`/article/${articleId}`)}
          selectedCategory="all"
          onCategoryChange={() => {}}
        />
      )}

      {/* Modal Rename Code tetap sama seperti sebelumnya... */}
      <Modal
        visible={isRenameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ubah Nama Koleksi</Text>
            
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              autoFocus
              placeholder="Nama Koleksi Baru"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setRenameModalVisible(false)}
              >
                <Text style={styles.btnTextCancel}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btn, styles.btnSave]}
                onPress={performRename}
              >
                <Text style={styles.btnTextSave}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CollectionDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#f0f0f0',
  },
  btnSave: {
    backgroundColor: '#FF4C4C',
  },
  btnTextCancel: {
    color: '#666',
    fontWeight: '600'
  },
  btnTextSave: {
    color: 'white',
    fontWeight: '600'
  }
});