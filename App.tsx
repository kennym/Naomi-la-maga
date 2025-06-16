import React, { useReducer } from 'react';
import { Platform, useWindowDimensions, Linking } from 'react-native';
import { MAX_NUMBER } from './constants';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ErrorScreen from './components/ErrorScreen';
import { gameReducer, createInitialState } from './lib/game';

export default function App() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 500;

  const containerPadding: number = 10;
  const numColumns: number = Platform.OS === 'web' ? 10 : 8;
  const margin: number = 4;
  const maxWebWidth = 800;

  const effectiveWidth = Platform.OS === 'web' ? Math.min(width, maxWebWidth) : width;
  const availableWidth: number = effectiveWidth - (containerPadding * 2);
  const boxSize: number = (availableWidth / numColumns) - (margin * 2);

  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const { step, calculatedNumber, isFinished, cards } = state;

  const handleAnswer = (yes: boolean) => {
    dispatch({ type: yes ? 'ANSWER_YES' : 'ANSWER_NO' });
  };

  const restartGame = () => {
    dispatch({ type: 'RESTART' });
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
      cards={cards}
      isSmallScreen={isSmallScreen}
      boxSize={boxSize}
      margin={margin}
      onAnswer={handleAnswer}
      onRestart={restartGame}
      onLinkPress={() => Linking.openURL('https://github.com/kennym/Naomi-la-maga')}
    />
  );
}
