import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { User } from '../types';

type HeaderProps = {
  user: User;
};

export const Header = ({ user }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.username}>{user.name}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ghostButton}>
        <Ionicons name="notifications-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  greeting: {
    fontSize: 12,
    color: '#666',
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ghostButton: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0', 
    backgroundColor: 'transparent',
  },
});