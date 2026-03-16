// components/CollectionModal.tsx
import React, { useEffect, useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, 
  TextInput, FlatList, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserCollections, createCollection, Collection } from '../services/bookmarkService';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectCollection: (collectionId: number) => void;
}

export const CollectionModal = ({ visible, onClose, onSelectCollection }: Props) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (visible) loadCollections();
  }, [visible]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await getUserCollections();
      setCollections(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;
    setIsCreating(true);
    try {
      const newCol = await createCollection(newCollectionName);
      if (newCol) {
        setCollections([newCol, ...collections]);
        setNewCollectionName('');
        // Opsional: Langsung pilih koleksi baru
        // onSelectCollection(newCol.id);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Simpan ke Koleksi</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Create New Section */}
          <View style={styles.createContainer}>
            <TextInput
              style={styles.input}
              placeholder="Buat koleksi baru..."
              value={newCollectionName}
              onChangeText={setNewCollectionName}
            />
            <TouchableOpacity 
              style={[styles.createBtn, !newCollectionName && styles.disabledBtn]}
              onPress={handleCreate}
              disabled={!newCollectionName || isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* List Collections */}
          {loading ? (
            <ActivityIndicator size="large" color="#FF4C4C" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={collections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.item} 
                  onPress={() => onSelectCollection(item.id)}
                >
                  <Ionicons name="folder-outline" size={20} color="#666" />
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#ccc" />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Belum ada koleksi. Buat baru di atas.</Text>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '60%', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  createContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, backgroundColor: '#f9f9f9' },
  createBtn: { backgroundColor: '#FF4C4C', borderRadius: 8, padding: 10, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: '#ffcccc' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', gap: 10 },
  itemText: { flex: 1, fontSize: 16, color: '#333' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
});