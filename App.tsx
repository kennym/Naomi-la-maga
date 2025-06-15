import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from './i18n'; // Import the i18n config

const MAX_NUMBER: number = 100;
const cardValues: number[] = [1, 2, 4, 8, 16, 32, 64];

// --- Responsive Grid Calculation ---
const { width } = Dimensions.get('window');
const containerPadding: number = 10;
const numColumns: number = 8; // Let's fit 8 numbers per row
const margin: number = 4;
// Calculate the available width for the grid
const availableWidth: number = width - (containerPadding * 2);
// Calculate the size of each box
const boxSize: number = (availableWidth / numColumns) - (margin * 2);
// ---

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
  const [step, setStep] = useState<number>(0);
  const [calculatedNumber, setCalculatedNumber] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

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

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>{i18n.t('finished_title')}</Text>
          <Text style={styles.resultText}>{i18n.t('result_text')}</Text>
          <Text style={styles.finalNumber}>{calculatedNumber}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>{i18n.t('play_again')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard: Card = cards[step];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="crystal-ball" size={80} color="#4B0082" style={styles.logo} />
        <Text style={styles.title}>{i18n.t('title')}</Text>
        <Text style={styles.instructions}>
          {i18n.t('instructions_1')}
        </Text>
        <Text style={styles.instructions}>
          {i18n.t('instructions_2')}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.cardContainer}>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleAnswer(true)}>
          <Text style={styles.buttonText}>{i18n.t('yes')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleAnswer(false)}>
          <Text style={styles.buttonText}>{i18n.t('no')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5', // Lavender Blush background
    padding: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 20, // Reduced margin to accommodate logo
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B0082', // Indigo for title
    marginBottom: 10,
  },
  instructions: {
    fontSize: 18,
    color: '#6A5ACD', // Slate Blue for instructions
    textAlign: 'center',
    marginBottom: 5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E6E6FA',
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
    color: '#6A5ACD', // Slate Blue
    marginBottom: 20,
  },
  finalNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF1493', // Deep Pink for the final number
    marginBottom: 40,
  }
});
