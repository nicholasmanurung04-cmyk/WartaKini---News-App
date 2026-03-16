import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  TouchableOpacity 
} from 'react-native';
import { NewsItem } from '../types';

type MainCarouselProps = {
  data: NewsItem[];
  onItemPress: (id: string) => void;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const SPACING = 20;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

export const BreakingNewsCarousel = ({ data, onItemPress }: MainCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const carouselData = data.slice(0, 5);

  useEffect(() => {
    if (carouselData.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= carouselData.length) {
        nextIndex = 0;
      }
      
      scrollToIndex(nextIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeIndex, carouselData.length]);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
    });
    setActiveIndex(index);
  };

  const handleDotPress = (index: number) => {
    scrollToIndex(index);
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SNAP_INTERVAL);
    setActiveIndex(index);
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SNAP_INTERVAL,
    offset: SNAP_INTERVAL * index,
    index,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Trending News</Text>
      
      <FlatList
        ref={flatListRef}
        data={carouselData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => onItemPress(item.id)} 
            style={styles.card}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.categoryBadge}>{item.category}</Text>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.dot,
                activeIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    gap: SPACING, 
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryBadge: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#FF4C4C',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    textTransform: 'capitalize'
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 15,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FF4C4C',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#ccc',
  },
});