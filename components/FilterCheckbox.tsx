import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterCheckboxProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export const FilterCheckbox = ({ title, options, selectedValues, onToggle }: FilterCheckboxProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onToggle(option.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#FF4C4C',
    borderColor: '#FF4C4C',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});