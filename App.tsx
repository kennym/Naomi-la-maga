import React, { useState, useEffect, useRef, useReducer } from 'react';
import { ScrollView, Platform, useWindowDimensions, LayoutChangeEvent, Linking } from 'react-native';
import { MAX_NUMBER } from './constants';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ErrorScreen from './components/ErrorScreen';
import { gameReducer, initialState } from './lib/game';

export default function App() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  const containerPadding: number = 10;
  const numColumns: number = 8;
  const margin: number = 4;
  const maxWebWidth = 800;

  const effectiveWidth = Platform.OS === 'web' ? Math.min(width, maxWebWidth) : width;
  const availableWidth: number = effectiveWidth - (containerPadding * 2);
  const boxSize: number = (availableWidth / numColumns) - (margin * 2);

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { step, calculatedNumber, isFinished } = state;

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
    const duration = 2500;
    const interval = 16;
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
    dispatch({ type: yes ? 'ANSWER_YES' : 'ANSWER_NO' });
  };

  const restartGame = () => {
    dispatch({ type: 'RESTART' });
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
      return <ErrorScreen onRestart={restartGame} />;
    }
    return <ResultScreen calculatedNumber={calculatedNumber} onRestart={restartGame} />;
  }

  return (
    <GameScreen
      step={step}
      isSmallScreen={isSmallScreen}
      autoScrollEnabled={autoScrollEnabled}
      scrollViewRef={scrollViewRef}
      boxSize={boxSize}
      margin={margin}
      onAnswer={handleAnswer}
      onRestart={restartGame}
      toggleAutoScroll={toggleAutoScroll}
      handleContentSizeChange={handleContentSizeChange}
      handleLayout={handleLayout}
      onLinkPress={() => Linking.openURL('https://github.com/kennym/Naomi-la-maga')}
    />
  );
}
