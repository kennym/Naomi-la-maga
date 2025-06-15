import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import i18n from '../i18n';
import MagicalBackground from '../MagicalBackground';
import { commonStyles } from './styles';

interface ResultScreenProps {
  calculatedNumber: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ calculatedNumber, onRestart }) => {
  return (
    <SafeAreaView style={commonStyles.container}>
      <MagicalBackground />
      <View style={commonStyles.contentWrapper}>
        <View style={commonStyles.centerContent}>
          <Text style={commonStyles.title}>{i18n.t('finished_title')}</Text>
          <Text style={commonStyles.resultText}>{i18n.t('result_text')}</Text>
          <Text style={commonStyles.finalNumber}>{calculatedNumber}</Text>
          <TouchableOpacity style={commonStyles.button} onPress={onRestart}>
            <Text style={commonStyles.buttonText}>{i18n.t('play_again')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen; 