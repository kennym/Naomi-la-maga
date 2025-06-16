import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useScrollIndicator } from '../../hooks/useScrollIndicator';
import { Card } from '../../constants';

interface NumberGridProps {
  currentCard: Card;
  boxSize: number;
  margin: number;
}

const NumberGrid: React.FC<NumberGridProps> = ({ currentCard, boxSize, margin }) => {
  const {
    scrollViewRef,
    showScrollIndicator,
    handleLayout,
    handleContentSizeChange,
    handleScroll,
  } = useScrollIndicator();

  const scrollIndicatorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showScrollIndicator) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollIndicatorAnimation, { toValue: 10, duration: 700, useNativeDriver: true }),
          Animated.timing(scrollIndicatorAnimation, { toValue: 0, duration: 700, useNativeDriver: true })
        ])
      ).start();
    } else {
      scrollIndicatorAnimation.stopAnimation();
    }
  }, [showScrollIndicator]);

  return (
    <View style={styles.cardContainerWrapper}>
      <ScrollView
        ref={scrollViewRef}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        contentContainerStyle={styles.cardContainer}
        scrollEventThrottle={16}
      >
        {currentCard.numbers.map((number: number) => (
          <View
            key={number}
            style={[
              styles.numberBox,
              {
                width: boxSize,
                height: boxSize,
                margin: margin,
                borderRadius: boxSize / 5,
              }
            ]}
          >
            <Text style={[styles.numberText, { fontSize: boxSize * 0.45 }]}>{number}</Text>
          </View>
        ))}
      </ScrollView>
      {showScrollIndicator && (
        <Animated.View style={[styles.scrollIndicator, { transform: [{ translateY: scrollIndicatorAnimation }] }]}>
          <Ionicons name="chevron-down" size={48} color="#C792EA" />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainerWrapper: {
    flex: 1,
    position: 'relative',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 40,
  },
  numberBox: {
    backgroundColor: '#E6E6FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  numberText: {
    fontWeight: '600',
    color: '#4B0082',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
});

export default NumberGrid; 