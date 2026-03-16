import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchInputProps = {
  onSearch: (query: string) => void;
};

export const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (text.length > 0 && text.length < 3) {
      setError('Minimal 3 huruf');
    } else {
      setError(null);
    }
  };

  const handleSearch = () => {
    if (query.length >= 3) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cari berita..."
          value={query}
          onChangeText={handleTextChange}
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={handleSearch} 
            disabled={query.length < 3}
            style={[styles.searchButton, query.length < 3 && styles.disabledButton]}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    width: '100%',
    height: '80%',
  },
  searchButton: {
    backgroundColor: '#FF4C4C',
    padding: 6,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});