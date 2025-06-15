import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0d3d',
    ...Platform.select({
      web: {
        alignItems: 'center',
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
        maxWidth: 800,
        padding: 10,
      },
    }),
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EADFFF',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 24,
    color: '#EADFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  finalNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 10,
  },
}); 