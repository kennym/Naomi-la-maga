import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Platform, useWindowDimensions, LayoutChangeEvent, Linking } from 'react-native';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import i18n from './i18n'; // Import the i18n config
import MagicalBackground from './MagicalBackground';

const MAX_NUMBER: number = 100;
const cardValues: number[] = [1, 2, 4, 8, 16, 32, 64];

interface Card {
  value: number;
  numbers: number[];
}

const generateCards = (): Card[] => {
  return cardValues.map((value: number) => {
    const numbers: number[] = [];
    for (let i = 1; i <= MAX_NUMBER; i++) {
      if ((i & value) > 0) {
        numbers.push(i);
      }
    }
    return { value, numbers };
  });
};

const cards: Card[] = generateCards();

export default function App() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  // --- Responsive Grid Calculation ---
  const containerPadding: number = 10;
  const numColumns: number = 8; // Let's fit 8 numbers per row
  const margin: number = 4;
  const maxWebWidth = 800; // Max width for the game on web

  // On web, constrain the width to the maxWebWidth
  const effectiveWidth = Platform.OS === 'web' ? Math.min(width, maxWebWidth) : width;

  // Calculate the available width for the grid, considering the container's padding
  const availableWidth: number = effectiveWidth - (containerPadding * 2);
  
  // Calculate the size of each box
  const boxSize: number = (availableWidth / numColumns) - (margin * 2);
  // ---

  const [step, setStep] = useState<number>(0);
  const [calculatedNumber, setCalculatedNumber] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const isScrollable = contentHeight > scrollViewHeight;

    if (Platform.OS !== 'web' || !isScrollable || !autoScrollEnabled) {
      return;
    }

    let scrollDownInterval: NodeJS.Timeout | null = null;
    let scrollUpInterval: NodeJS.Timeout | null = null;
    let scrollLoopTimeout: NodeJS.Timeout | null = null;
    let isMounted = true;

    const scrollableHeight = contentHeight - scrollViewHeight;
    const duration = 2500; // 2.5 seconds for a slow scroll
    const interval = 16; // ~60 fps
    const steps = duration / interval;
    const stepAmount = scrollableHeight / steps;

    const scrollDown = (callback: () => void) => {
      let currentScrollY = 0;
      scrollDownInterval = setInterval(() => {
        currentScrollY += stepAmount;
        if (currentScrollY >= scrollableHeight) {
          scrollViewRef.current?.scrollToEnd({ animated: false });
          if (scrollDownInterval) clearInterval(scrollDownInterval);
          callback();
        } else {
          scrollViewRef.current?.scrollTo({ y: currentScrollY, animated: false });
        }
      }, interval);
    };

    const scrollUp = (callback: () => void) => {
      let currentScrollY = scrollableHeight;
      scrollUpInterval = setInterval(() => {
        currentScrollY -= stepAmount;
        if (currentScrollY <= 0) {
          scrollViewRef.current?.scrollTo({ y: 0, animated: false });
          if (scrollUpInterval) clearInterval(scrollUpInterval);
          callback();
        } else {
          scrollViewRef.current?.scrollTo({ y: currentScrollY, animated: false });
        }
      }, interval);
    };

    const scrollLoop = () => {
      if (!isMounted) return;
      scrollDown(() => {
        if (!isMounted) return;
        scrollLoopTimeout = setTimeout(() => {
          if (!isMounted) return;
          scrollUp(() => {
            if (!isMounted) return;
            scrollLoopTimeout = setTimeout(scrollLoop, 500);
          });
        }, 500);
      });
    };

    const startTimeout = setTimeout(scrollLoop, 1000);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      if (scrollLoopTimeout) clearTimeout(scrollLoopTimeout);
      if (scrollDownInterval) clearInterval(scrollDownInterval);
      if (scrollUpInterval) clearInterval(scrollUpInterval);
    };
  }, [scrollViewHeight, contentHeight, step, autoScrollEnabled]);

  const handleAnswer = (yes: boolean) => {
    if (yes) {
      setCalculatedNumber((prev: number) => prev + cards[step].value);
    }
    
    if (step < cards.length - 1) {
      setStep((prev: number) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartGame = () => {
    setStep(0);
    setCalculatedNumber(0);
    setIsFinished(false);
  };

  const toggleAutoScroll = () => {
    setAutoScrollEnabled(prev => !prev);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  if (isFinished) {
    if (calculatedNumber > MAX_NUMBER || calculatedNumber === 0) {
      return (
        <SafeAreaView style={styles.container}>
          <MagicalBackground />
          <View style={styles.contentWrapper}>
            <View style={styles.centerContent}>
              <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#FF6347" style={styles.logo} />
              <Text style={[styles.title, { textAlign: 'center' }]}>{i18n.t('error_title')}</Text>
              <Text style={[styles.resultText, { textAlign: 'center' }]}>{i18n.t('error_text')}</Text>
              <TouchableOpacity style={styles.button} onPress={restartGame}>
                <Text style={styles.buttonText}>{i18n.t('play_again')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <MagicalBackground />
        <View style={styles.contentWrapper}>
          <View style={styles.centerContent}>
            <Text style={styles.title}>{i18n.t('finished_title')}</Text>
            <Text style={styles.resultText}>{i18n.t('result_text')}</Text>
            <Text style={styles.finalNumber}>{calculatedNumber}</Text>
            <TouchableOpacity style={styles.button} onPress={restartGame}>
              <Text style={styles.buttonText}>{i18n.t('play_again')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard: Card = cards[step];

  return (
    <SafeAreaView style={styles.container}>
      <MagicalBackground />
      <View style={styles.contentWrapper}>
        <View style={styles.topBar}>
          <View style={styles.topLeftControls}>
            {Platform.OS === 'web' && (
                <TouchableOpacity onPress={toggleAutoScroll} style={styles.controlButton}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name={autoScrollEnabled ? "pause-circle" : "play-circle"} size={28} color="#EADFFF" />
                        {!isSmallScreen && <Text style={styles.controlButtonText}>Autoscroll {autoScrollEnabled ? 'on' : 'off'}</Text>}
                    </View>
                </TouchableOpacity>
            )}
            {step > 0 && (
              <TouchableOpacity onPress={restartGame} style={styles.controlButton}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="refresh" size={28} color="#EADFFF" />
                  {!isSmallScreen && <Text style={styles.controlButtonText}>{i18n.t('restart')}</Text>}
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={() => Linking.openURL('https://github.com/kennym/Naomi-la-maga')} style={styles.controlButton}>
              <AntDesign name="github" size={28} color="#EADFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.header, isSmallScreen && { marginBottom: 10 }]}>
          <MaterialCommunityIcons name="crystal-ball" size={isSmallScreen ? 50 : 80} color="#C792EA" style={styles.logo} />
          <Text style={[styles.title, isSmallScreen && { fontSize: 26 }]}>{i18n.t('title')}</Text>
          <Text style={[styles.instructions, isSmallScreen && { fontSize: 16 }]}>
            {i18n.t('instructions_1')}
          </Text>
          <Text style={[styles.instructions, isSmallScreen && { fontSize: 16 }]}>
            {i18n.t('instructions_2')}
          </Text>
        </View>
        
        <View style={styles.cardContainerWrapper}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.cardContainer}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
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
        </View>

        <View style={styles.bottomActions}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleAnswer(true)}>
              <Text style={styles.buttonText}>{i18n.t('yes')}</Text>
            </TouchableOpacity>
            <Text style={styles.stepCounter}>
              {i18n.t('step_counter', { current: step + 1, total: cards.length })}
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAnswer(false)}>
              <Text style={styles.buttonText}>{i18n.t('no')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d3d', // Dark purple background
    ...Platform.select({
      web: {
        alignItems: 'center', // Center the content on web
      },
      default: {
        padding: 10,
      }
    }),
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 800, // Max width for the game on web
        padding: 10,
      },
    }),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  topLeftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 5,
    marginRight: 10,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '400',
    color: '#EADFFF',
    opacity: 0.8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 10, // Reduced margin to accommodate top bar
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EADFFF', // Light lavender for title
    marginBottom: 10,
  },
  instructions: {
    fontSize: 18,
    color: '#EADFFF', // Light lavender for instructions
    textAlign: 'center',
    marginBottom: 5,
  },
  controlButtonText: {
    color: '#EADFFF',
    marginLeft: 8,
    fontSize: 16
  },
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
  },
  numberBox: {
    backgroundColor: '#E6E6FA', // Lavender for number boxes
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
    color: '#4B0082', // Indigo for numbers
  },
  bottomActions: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E6E6FA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF69B4', // Hot Pink for buttons
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Make them round
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF', // White text for buttons
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 24,
    color: '#EADFFF', // Light lavender
    marginBottom: 20,
    textAlign: 'center',
  },
  finalNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF1493', // Deep Pink for the final number
    marginBottom: 40,
  }
});
