// components/NewsList.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Category, NewsItem } from '../types';

type NewsListProps = {
  categories?: Category[];
  news: NewsItem[];
  onItemPress: (id: string) => void;
  selectedCategory?: string; 
  onCategoryChange?: (id: string) => void; 
};

export const NewsList = ({ categories, news, onItemPress, selectedCategory, onCategoryChange}: NewsListProps) => {

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Latest Updates</Text>

      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
                onPress={() => {
                  if (onCategoryChange) {
                    onCategoryChange(item.id)
                  }
                }}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.listContainer}>
        {news.length === 0 ? (
           <Text style={{textAlign: 'center', color: '#999', marginTop: 20}}>No news found in this category.</Text>
        ) : (
          news.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => onItemPress(item.id)} 
            >
              <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
              
              <View style={styles.content}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.footer}>
                  <Ionicons name="person-circle-outline" size={16} color="#666" />
                  <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.date}>{item.date ? item.date.split(' ')[0] : ''}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
    color: '#333',
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#FF4C4C',
    borderColor: '#FF4C4C',
  },
  filterText: {
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 15,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 2, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 12,
    color: '#FF4C4C',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dot: {
    marginHorizontal: 5,
    color: '#ccc',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});