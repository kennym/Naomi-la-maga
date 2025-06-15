import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const NUM_STARS = 100;

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

const StarryBackground: React.FC = () => {
  const stars = useRef<Star[]>([]).current;
  const animatedValues = useRef<Animated.Value[]>([]).current;

  if (stars.length === 0) {
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
      });
      animatedValues.push(new Animated.Value(0));
    }
  }

  useEffect(() => {
    const animations = animatedValues.map((val) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: Math.random() * 2000 + 1000,
            useNativeDriver: true,
          }),
        ])
      );
    });

    Animated.stagger(50, animations).start();
  }, [animatedValues]);

  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              borderRadius: star.size / 2,
              opacity: animatedValues[index],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: -1,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

export default StarryBackground; 