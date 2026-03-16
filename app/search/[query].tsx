import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { searchNews } from '../../services/api';
import { NewsItem } from '../../types';
import { NewsList } from '../../components/NewsList';

const SearchResult = () => {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doSearch = async () => {
      if (typeof query === 'string') {
        setLoading(true);
        const data = await searchNews(query);
        setResults(data);
        setLoading(false);
      }
    };
    doSearch();
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerBackTitle: "", 
          headerTitleAlign: 'center',    
          headerShadowVisible: true,    
          
          headerTitle: () => (
            <View style={styles.navTitleContainer}>
              <Text style={styles.navTitle} numberOfLines={1}>
                Search: "{query}"
              </Text>
              <Text style={styles.navSubtitle}>
                {loading ? 'Searching...' : `${results.length} articles found`}
              </Text>
            </View>
          ),
        }}
      />


      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF4C4C" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
           <NewsList 
             news={results} 
             onItemPress={(id) => router.push({ pathname: '/article/[id]', params: { id }})}
           />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchResult;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  navTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: 200, 
  },
  navSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  
});