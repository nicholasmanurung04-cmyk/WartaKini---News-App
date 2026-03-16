import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FilterCheckbox } from '../../components/FilterCheckbox'; // Sesuaikan path
import { Ionicons } from '@expo/vector-icons';

// Data Statis untuk Filter
const COUNTRIES = [
  { label: 'Indonesia', value: 'id' },
  { label: 'Japan', value: 'jp' },
  { label: 'USA', value: 'us' },
  { label: 'China', value: 'cn' },
  { label: 'Germany', value: 'de' },
];

const CATEGORIES = [
  { label: 'Top News', value: 'top' },
  { label: 'Education', value: 'education' },
  { label: 'Crime', value: 'crime' },
  { label: 'Food', value: 'food' },
  { label: 'Politics', value: 'politics' },
];

const DiscoverPage = () => {
  const router = useRouter();

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Helper untuk toggle selection array
  const toggleSelection = (value: string, list: string[], setList: Function) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSearch = () => {
    // 1. Validasi: Minimal satu input harus terisi
    const hasQuery = searchQuery.trim().length > 0;
    const hasFilters = 
      selectedCountries.length > 0 || 
      selectedCategories.length > 0;

    if (!hasQuery && !hasFilters) {
      Alert.alert(
        "Input Required", 
        "Please enter a keyword or select at least one filter to search."
      );
      return;
    }

    // 2. Navigasi ke halaman hasil
    // Kita mengirimkan parameter dalam bentuk string JSON agar mudah diparsing di halaman tujuan
    // Atau mengirimkannya sebagai query params biasa jika strukturnya sederhana.
    // Karena struktur `app/search/[query].tsx` Anda sebelumnya berbasis dynamic route [query],
    // kita akan memodifikasinya sedikit untuk menerima parameter kompleks, 
    // atau kita oper query string url-encoded.
    
    router.push({
      pathname: '/search/results', // Disarankan membuat file baru app/search/results.tsx agar lebih bersih
      params: {
        q: searchQuery,
        country: selectedCountries.join(','),
        category: selectedCategories.join(','),
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Hide Native Header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        
        {/* Header Custom Sederhana */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>WartaKini</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.input}
                placeholder="Search keywords (e.g., Bitcoin)..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Filter Sections */}
          <FilterCheckbox
            title="Country"
            options={COUNTRIES}
            selectedValues={selectedCountries}
            onToggle={(val) => toggleSelection(val, selectedCountries, setSelectedCountries)}
          />

          <FilterCheckbox
            title="Category"
            options={CATEGORIES}
            selectedValues={selectedCategories}
            onToggle={(val) => toggleSelection(val, selectedCategories, setSelectedCategories)}
          />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search News</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default DiscoverPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    position: 'relative', // Penting untuk absolute positioning anak
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Memberikan ruang agar konten paling bawah tidak tertutup tombol
  },
  inputSection: {
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  
  // Bottom Button Styles
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff', // Latar belakang putih agar transparan konten di belakangnya tertutup
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // Shadow untuk estetika
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchButton: {
    backgroundColor: '#FF4C4C',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});