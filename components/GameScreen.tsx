import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import i18n from '../i18n';
import MagicalBackground from '../MagicalBackground';
import { commonStyles } from './styles';
import { Card } from '../constants';

interface GameScreenProps {
  step: number;
  cards: Card[];
  isSmallScreen: boolean;
  boxSize: number;
  margin: number;
  onAnswer: (yes: boolean) => void;
  onRestart: () => void;
  onLinkPress: () => void;
}

const GameScreen: React.FC<GameScreenProps> = (props) => {
    const {
        step,
        cards,
        isSmallScreen,
        boxSize,
        margin,
        onAnswer,
        onRestart,
        onLinkPress,
    } = props;

  const currentCard: Card = cards[step];

  return (
    <SafeAreaView style={commonStyles.container}>
      <MagicalBackground />
      <View style={commonStyles.contentWrapper}>
        <View style={styles.topBar}>
          <View style={styles.topLeftControls}>
            {step > 0 && (
              <TouchableOpacity onPress={onRestart} style={styles.controlButton}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="refresh" size={28} color="#EADFFF" />
                  {!isSmallScreen && <Text style={styles.controlButtonText}>{i18n.t('restart')}</Text>}
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.topRightControls}>
            <TouchableOpacity onPress={onLinkPress} style={styles.controlButton}>
              <AntDesign name="github" size={28} color="#EADFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.header, isSmallScreen && { marginBottom: 10 }]}>
          <MaterialCommunityIcons name="crystal-ball" size={isSmallScreen ? 50 : 80} color="#C792EA" style={commonStyles.logo} />
          <Text style={[commonStyles.title, isSmallScreen && { fontSize: 26 }]}>{i18n.t('title')}</Text>
          <Text style={[styles.instructions, isSmallScreen && { fontSize: 16 }]}>
            {i18n.t('instructions_1')}
          </Text>
          <Text style={[styles.instructions, isSmallScreen && { fontSize: 16 }]}>
            {i18n.t('instructions_2')}
          </Text>
        </View>

        <View style={styles.cardContainerWrapper}>
          <ScrollView
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
        </View>

        <View style={styles.bottomActions}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={commonStyles.button} onPress={() => onAnswer(true)}>
              <Text style={commonStyles.buttonText}>{i18n.t('yes')}</Text>
            </TouchableOpacity>
            <Text style={styles.stepCounter}>
              {i18n.t('step_counter', { current: step + 1, total: cards.length })}
            </Text>
            <TouchableOpacity style={commonStyles.button} onPress={() => onAnswer(false)}>
              <Text style={commonStyles.buttonText}>{i18n.t('no')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    header: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    instructions: {
        fontSize: 18,
        color: '#EADFFF',
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
    bottomActions: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#E6E6FA',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        alignItems: 'center',
    },
});

export default GameScreen; 