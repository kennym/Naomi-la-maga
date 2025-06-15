import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../i18n';
import MagicalBackground from '../MagicalBackground';
import { commonStyles } from './styles';

interface ErrorScreenProps {
  onRestart: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ onRestart }) => {
  return (
    <SafeAreaView style={commonStyles.container}>
      <MagicalBackground />
      <View style={commonStyles.contentWrapper}>
        <View style={commonStyles.centerContent}>
          <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#FF6347" style={commonStyles.logo} />
          <Text style={[commonStyles.title, { textAlign: 'center' }]}>{i18n.t('error_title')}</Text>
          <Text style={[commonStyles.resultText, { textAlign: 'center' }]}>{i18n.t('error_text')}</Text>
          <TouchableOpacity style={commonStyles.button} onPress={onRestart}>
            <Text style={commonStyles.buttonText}>{i18n.t('play_again')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen; 