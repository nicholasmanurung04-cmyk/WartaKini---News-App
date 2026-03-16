// app/search/result.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { searchNewsAdvanced, SearchParams } from '../../services/api'; 
import { NewsItem } from '../../types'; 
import { NewsList } from '../../components/NewsList'; 

// Import utility functions yang baru dibuat
import { parseSearchParamArray, formatSearchFilterSummary } from '../../utils/searchHelpers';

const AdvancedSearchResult = () => {
  const router = useRouter();
  // Type definition di sini memastikan kita tahu tipe data params
  const { q, country, category } = useLocalSearchParams<{ q: string, country: string, category: string }>();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchData();
  }, [q, country, category]); 

  const fetchData = async () => {
    setLoading(true);
    
    try {
      // Menggunakan utility function untuk membersihkan logika di sini
      const searchPayload: SearchParams = {
        q: q || '',
        country: parseSearchParamArray(country),
        category: parseSearchParamArray(category),
      };

      console.log("Searching with payload:", searchPayload);

      const data = await searchNewsAdvanced(searchPayload);
      setResults(data);

    } catch (error) {
      console.error("Error fetching advanced results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Menggunakan utility function untuk formatting UI
  const filterSummaryText = formatSearchFilterSummary(country, category);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: 'Search Results',
          headerTintColor: '#000',
        }}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.queryText} numberOfLines={1}>
          Keyword: "{q || 'All'}"
        </Text>
        
        {filterSummaryText !== '' && (
          <Text style={styles.filterText} numberOfLines={1}>
            {filterSummaryText}
          </Text>
        )}
        
        <Text style={styles.countText}>
          {loading ? 'Searching...' : `${results.length} articles found`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FF4C4C" />
          <Text style={styles.loadingText}>Fetching news...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="newspaper-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Articles Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your keywords or removing some filters.
          </Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Adjust Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <NewsList 
            news={results}
            onItemPress={(id) => router.push({ pathname: '/article/[id]', params: { id } })}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdvancedSearchResult;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  queryText: { fontSize: 16, fontWeight: '700', color: '#333' },
  filterText: { fontSize: 12, color: '#666', marginTop: 4 },
  countText: { fontSize: 12, color: '#FF4C4C', marginTop: 4, fontWeight: '600' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  listContainer: { flex: 1 },
  loadingText: { marginTop: 12, color: '#666' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  backButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f2f2f2', borderRadius: 20 },
  backButtonText: { color: '#333', fontWeight: '600' },
});