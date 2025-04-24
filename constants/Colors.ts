import { Platform } from 'react-native';

const Colors = {
  // Primary colors
  primary: '#7C5DFA',
  primaryLight: '#9277FF',
  primaryDark: '#5E45CC',
  
  // Accent colors
  accent: '#24B47E',
  accentLight: '#4CD5A4',
  accentDark: '#1A8F62',
  
  // Complementary colors
  complementary: '#FF7F5C',
  complementaryLight: '#FF9B82',
  complementaryDark: '#E65C35',
  
  // Status colors
  success: '#24B47E',
  warning: '#F4C152',
  error: '#FF5C5C',
  info: '#7C5DFA',
  
  // Neutral colors
  white: '#FFFFFF',
  background: '#F8F8FB',
  card: '#FFFFFF',
  border: '#EEF0F8',
  textPrimary: '#373B53',
  textSecondary: '#888EB0',
  textTertiary: '#B5B8CE',
  disabled: '#DFE3FA',
  shadow: Platform.select({ ios: '#7E88C3', android: '#000000', web: '#7E88C3' }),
  
  // Semantic colors
  expense: '#FF5C5C',
  income: '#24B47E',
  debt: '#F4C152',
  settlement: '#7C5DFA',

  // Category colors
  categoryFood: '#FF9B82',
  categoryTransport: '#4CD5A4',
  categoryUtilities: '#7C5DFA',
  categoryEntertainment: '#F4C152',
  categoryRent: '#FF5C5C',
  categoryOther: '#888EB0',
};

export default Colors;